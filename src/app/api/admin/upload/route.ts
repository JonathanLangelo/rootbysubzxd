import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/admin/upload
 * Accepts a single image file and stores it using @vercel/blob.
 * Returns the public URL for embedding in Markdown.
 */
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (request.headers.get("X-Requested-With") !== "XMLHttpRequest") {
        return NextResponse.json({ error: "CSRF_DETECTED" }, { status: 403 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "NO_FILE_PROVIDED" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `INVALID_FILE_TYPE: Only ${ALLOWED_TYPES.join(", ")} allowed.` },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "FILE_TOO_LARGE: Max 5MB allowed." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Validate file magic bytes to prevent MIME type spoofing
        const MAGIC_BYTES: Record<string, number[][]> = {
            "image/jpeg": [[0xff, 0xd8, 0xff]],
            "image/png": [[0x89, 0x50, 0x4e, 0x47]],
            "image/webp": [[0x52, 0x49, 0x46, 0x46]],
            "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // %PDF
        };

        const signatures = MAGIC_BYTES[file.type];
        if (signatures) {
            const isValid = signatures.some((sig) =>
                sig.every((byte, i) => buffer[i] === byte)
            );
            if (!isValid) {
                return NextResponse.json(
                    { error: "FILE_SIGNATURE_MISMATCH: File content does not match declared type." },
                    { status: 400 }
                );
            }
        }

        // Derive safe extension
        const extMap: Record<string, string> = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
            "application/pdf": "pdf",
        };
        const ext = extMap[file.type] ?? "bin";
        const safeName = `${uuidv4()}.${ext}`;

        const inputFolder = formData.get("folder") as string | null;
        const validFolders = ["certifications"];
        const targetFolder = validFolders.includes(inputFolder || "") ? `${inputFolder}/` : "";

        // Upload to Vercel Blob
        const blob = await put(`uploads/${targetFolder}${safeName}`, file, {
            access: "public",
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}
