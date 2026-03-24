import { NextResponse } from "next/server";

/**
 * POST /api/logout
 * Securely terminates the session by invalidating the auth cookie.
 */
export async function POST(request: Request) {
    // CSRF check
    if (request.headers.get("X-Requested-With") !== "XMLHttpRequest") {
        return NextResponse.json({ error: "CSRF_DETECTED" }, { status: 403 });
    }

    const response = NextResponse.json({ success: true });

    // Expire the session cookie
    response.cookies.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
    });

    return response;
}
