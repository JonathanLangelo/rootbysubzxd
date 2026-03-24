import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // M4 FIX: CSRF check
    if (req.headers.get("X-Requested-With") !== "XMLHttpRequest") {
        return NextResponse.json({ error: "CSRF_DETECTED" }, { status: 403 });
    }

    try {
        const { id } = await params;
        await prisma.certification.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
    }
}
