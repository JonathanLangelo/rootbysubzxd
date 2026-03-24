import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Admin Route Protection ─────────────────────────────────────────────────
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const session = request.cookies.get("session")?.value;

        if (!session) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            await decrypt(session);
        } catch {
            // Invalid or expired token → clear cookie and redirect
            const res = NextResponse.redirect(new URL("/admin/login", request.url));
            res.cookies.set("session", "", { expires: new Date(0), path: "/" });
            return res;
        }
    }

    // ── Security Headers (applied to all non-API routes) ─────────────────────
    const response = NextResponse.next();

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    // C3 FIX: HSTS — enforce HTTPS for 1 year including subdomains
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    // M3 FIX: Tightened CSP — removed unsafe-eval
    response.headers.set(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
            "connect-src 'self'",
            "frame-ancestors 'none'",
        ].join("; ")
    );

    return response;
}

export const config = {
    // Apply to all pages except static assets and Next.js internals
    matcher: ["/admin/:path*", "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
