import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { renderMDXToHtml } from "@/lib/mdx";

// ── C4 FIX: Rate limiting on password verification ───────────────────────────
const verifyAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

export async function POST(request: Request) {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const attempt = verifyAttempts.get(ip);

    if (attempt && now - attempt.lastAttempt < RATE_LIMIT_WINDOW && attempt.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
            { error: "RATE_LIMIT_EXCEEDED" },
            { status: 429 }
        );
    }

    try {
        const { id, password: rawPassword } = await request.json();
        const password = rawPassword?.trim();

        if (!id || !password || typeof id !== "string" || typeof password !== "string") {
            return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id },
            select: { password: true, status: true, content: true, title: true },
        });

        if (!post) {
            return NextResponse.json({ error: "POST_NOT_FOUND" }, { status: 404 });
        }

        if (post.status !== "LOCKED" || !post.password) {
            return NextResponse.json({ error: "CONTENT_NOT_LOCKED" }, { status: 400 });
        }

        const isValid = await bcrypt.compare(password, post.password);

        if (!isValid) {
            // Record failed attempt
            const count = attempt ? attempt.count + 1 : 1;
            verifyAttempts.set(ip, { count, lastAttempt: now });

            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        verifyAttempts.delete(ip); // Reset on success

        // ── C1 FIX: Render content server-side and return HTML ────────────
        try {
            const contentHtml = await renderMDXToHtml(post.content);
            return NextResponse.json({ success: true, contentHtml });
        } catch (renderError) {
            console.error("MDX Rendering failed in unlock:", renderError);
            // If rendering fails (likely due to async components), return raw MDX for client-side fallback
            return NextResponse.json({ success: true, contentMdx: post.content });
        }

    } catch (error) {
        console.error("Auth process error:", error);
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}
