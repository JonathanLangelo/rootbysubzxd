import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (req.headers.get("X-Requested-With") !== "XMLHttpRequest") {
        return NextResponse.json({ error: "CSRF_DETECTED" }, { status: 403 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof File)) {
            return Response.json(
                { error: "Invalid file input" },
                { status: 400 }
            );
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            return Response.json(
                { error: "Unsupported file type" },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return Response.json(
                { error: "File too large (max 5MB)" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const MAGIC_BYTES: Record<string, number[][]> = {
            "image/jpeg": [[0xff, 0xd8, 0xff]],
            "image/png": [[0x89, 0x50, 0x4e, 0x47]],
            "image/webp": [[0x52, 0x49, 0x46, 0x46]],
            "application/pdf": [[0x25, 0x50, 0x44, 0x46, 0x2d]],
        };

        const signatures = MAGIC_BYTES[file.type];
        if (signatures) {
            const isValid = signatures.some((sig) =>
                sig.every((byte, i) => buffer[i] === byte)
            );
            if (!isValid) {
                return Response.json(
                    { error: "File signature mismatch" },
                    { status: 400 }
                );
            }
        }

        const inputFolder = formData.get("folder") as string | null;
        const validFolders = ["certifications"];
        const targetFolder = validFolders.includes(inputFolder || "") ? `${inputFolder}/` : "";

        const blob = await put(
            `uploads/${targetFolder}${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
            file,
            {
                access: "public",
            }
        );

        return Response.json({
            url: blob.url,
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);

        return Response.json(
            {
                error: "Internal Server Error"
            },
            { status: 500 }
        );
    }
}
