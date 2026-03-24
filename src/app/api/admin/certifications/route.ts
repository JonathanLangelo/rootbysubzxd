import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// M4 FIX: CSRF validation helper
function validateCSRF(request: Request): boolean {
    return request.headers.get("X-Requested-With") === "XMLHttpRequest";
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // M4 FIX: CSRF check
    if (!validateCSRF(req)) {
        return NextResponse.json({ error: "CSRF_DETECTED" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { title, issuer, date, description, fileUrl, thumbnailUrl, verificationUrl } = body;

        if (!title || !issuer || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const certification = await prisma.certification.create({
            data: {
                title,
                issuer,
                date: new Date(date),
                description,
                fileUrl,
                thumbnail: thumbnailUrl,
                verificationUrl,
            },
        });

        return NextResponse.json(certification);
    } catch (error: any) {
        console.error("CERTIFICATION_API_ERROR:", error);
        // M5 FIX: Do not leak raw error messages to client
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const certifications = await prisma.certification.findMany({
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(certifications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
    }
}
