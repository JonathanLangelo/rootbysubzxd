import { login } from "@/lib/auth";
import { NextResponse } from "next/server";

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    const attempt = loginAttempts.get(ip);
    if (attempt && now - attempt.lastAttempt < RATE_LIMIT_WINDOW && attempt.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
            { error: "TOO_MANY_ATTEMPTS: LOCKDOWN_ACTIVE" },
            { status: 429 }
        );
    }

    try {
        const { username, password } = await request.json();

        // Use the login utility
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const success = await login(formData);

        if (success) {
            loginAttempts.delete(ip); // Reset on success
            return NextResponse.json({ success: true });
        }

        // Record failed attempt
        const count = attempt ? attempt.count + 1 : 1;
        loginAttempts.set(ip, { count, lastAttempt: now });

        return NextResponse.json({ error: "AUTHENTICATION_FAILED" }, { status: 401 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}
