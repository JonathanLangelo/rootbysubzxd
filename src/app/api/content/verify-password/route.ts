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
            { error: "TOO_MANY_ATTEMPTS: LOCKDOWN_ACTIVE" },
            { status: 429 }
        );
    }

    try {
        const { id, password } = await request.json();

        if (!id || !password || typeof id !== "string" || typeof password !== "string") {
            return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id },
            select: { password: true, status: true, content: true },
        });

        if (!post || post.status !== "LOCKED" || !post.password) {
            return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
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
        // Content is ONLY sent to the client after successful authentication
        const contentHtml = await renderMDXToHtml(post.content);

        return NextResponse.json({ success: true, contentHtml });
    } catch (error) {
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}
