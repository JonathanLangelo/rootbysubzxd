import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { put } from "@vercel/blob";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simple CSRF check via custom header (standard stateless approach for same-origin APIs). */
function validateCSRF(request: Request): boolean {
    return request.headers.get("X-Requested-With") === "XMLHttpRequest";
}

/**
 * Sanitizes a plain title (no HTML allowed).
 * We do NOT sanitize Markdown content here because that would destroy code blocks, headers, etc.
 * XSS is prevented at render time by the MDX/ReactMarkdown pipeline.
 */
function sanitizeTitle(raw: string): string {
    return raw.replace(/<[^>]*>/g, "").trim().slice(0, 500);
}

/** Handles image thumbnail upload and returns the public URL. */
async function handleThumbnailUpload(file: File): Promise<string | null> {
    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) throw new Error("INVALID_FILE_TYPE");
    if (file.size > 5 * 1024 * 1024) throw new Error("FILE_TOO_LARGE");

    const extMap: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    };
    const ext = extMap[file.type] ?? "bin";
    const safeName = `${uuidv4()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // M2 FIX: Validate file magic bytes to prevent MIME type spoofing (duplicated from upload route for security)
    const MAGIC_BYTES: Record<string, number[][]> = {
        "image/jpeg": [[0xff, 0xd8, 0xff]],
        "image/png": [[0x89, 0x50, 0x4e, 0x47]],
        "image/webp": [[0x52, 0x49, 0x46, 0x46]],
    };

    const signatures = MAGIC_BYTES[file.type];
    if (signatures) {
        const isValid = signatures.some((sig) =>
            sig.every((byte, i) => buffer[i] === byte)
        );
        if (!isValid) throw new Error("FILE_SIGNATURE_MISMATCH");
    }

    // Upload to Vercel Blob instead of local filesystem
    const blob = await put(`thumbnails/${safeName}`, file, {
        access: "public",
    });

    return blob.url;
}

// ─── POST – Create ────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    if (!validateCSRF(request)) {
        return NextResponse.json({ error: "CSRF_DETECTED" }, { status: 403 });
    }

    try {
        const formData = await request.formData();

        const rawTitle = (formData.get("title") as string) ?? "";
        const content = (formData.get("content") as string) ?? "";
        const description = (formData.get("description") as string) ?? "";
        const type = (formData.get("type") as string) ?? "WRITEUP";
        const platform = (formData.get("platform") as string) ?? "N/A";
        const difficulty = (formData.get("difficulty") as string) ?? "Easy";
        const status = (formData.get("status") as string) ?? "DRAFT";
        const password = (formData.get("password") as string) ?? "";
        const tags = (formData.get("tags") as string) ?? "";
        const githubUrl = (formData.get("githubUrl") as string) ?? "";
        const demoUrl = (formData.get("demoUrl") as string) ?? "";
        const thumbnail = formData.get("thumbnail") as File | null;

        // Validate required fields
        const title = sanitizeTitle(rawTitle);
        if (!title) return NextResponse.json({ error: "TITLE_REQUIRED" }, { status: 400 });

        // Generate slug (unique-safe on collision)
        const baseSlug = slugify(title, { lower: true, strict: true });
        const existing = await prisma.post.count({ where: { slug: baseSlug } });
        const slug = existing > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

        // Hash password if LOCKED
        let hashedPassword: string | null = null;
        if (status === "LOCKED") {
            if (!password) {
                return NextResponse.json({ error: "PASSWORD_REQUIRED_FOR_LOCKED_STATUS" }, { status: 400 });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Handle thumbnail
        let thumbnailUrl: string | null = null;
        if (thumbnail && thumbnail.size > 0) {
            thumbnailUrl = await handleThumbnailUpload(thumbnail);
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                description,
                type,
                platform,
                difficulty,
                status,
                password: hashedPassword,
                tags,
                thumbnail: thumbnailUrl,
                githubUrl: githubUrl || null,
                demoUrl: demoUrl || null,
            },
        });

        return NextResponse.json(post);
    } catch (error: any) {
        console.error("Content creation error:", error);
        if (error.message === "INVALID_FILE_TYPE") return NextResponse.json({ error: "INVALID_FILE_TYPE" }, { status: 400 });
        if (error.message === "FILE_TOO_LARGE") return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
        if (error.message === "FILE_SIGNATURE_MISMATCH") return NextResponse.json({ error: "FILE_SIGNATURE_MISMATCH" }, { status: 400 });
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}

// ─── PUT – Update ─────────────────────────────────────────────────────────────
export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    if (!validateCSRF(request)) {
        return NextResponse.json({ error: "CSRF_DETECTED" }, { status: 403 });
    }

    try {
        const formData = await request.formData();

        const id = formData.get("id") as string;
        if (!id) return NextResponse.json({ error: "ID_REQUIRED" }, { status: 400 });

        const rawTitle = (formData.get("title") as string) ?? "";
        const content = (formData.get("content") as string) ?? "";
        const description = (formData.get("description") as string) ?? "";
        const type = (formData.get("type") as string) ?? "WRITEUP";
        const platform = (formData.get("platform") as string) ?? "N/A";
        const difficulty = (formData.get("difficulty") as string) ?? "Easy";
        const status = (formData.get("status") as string) ?? "DRAFT";
        const password = (formData.get("password") as string) ?? "";
        const tags = (formData.get("tags") as string) ?? "";
        const githubUrl = (formData.get("githubUrl") as string) ?? "";
        const demoUrl = (formData.get("demoUrl") as string) ?? "";
        const thumbnail = formData.get("thumbnail") as File | null;

        const title = sanitizeTitle(rawTitle);
        if (!title) return NextResponse.json({ error: "TITLE_REQUIRED" }, { status: 400 });

        const updateData: any = {
            title,
            content,
            description,
            type,
            platform,
            difficulty,
            status,
            tags,
            githubUrl: githubUrl || null,
            demoUrl: demoUrl || null,
        };

        // Password: only re-hash if a new value is provided (not an existing bcrypt hash)
        if (status === "LOCKED") {
            if (password && !password.startsWith("$2")) {
                updateData.password = await bcrypt.hash(password, 10);
            } else {
                // If it's becoming LOCKED but no password provided, check if it already has one
                const currentPost = await prisma.post.findUnique({ where: { id }, select: { password: true } });
                if (!currentPost?.password && !password) {
                    return NextResponse.json({ error: "PASSWORD_REQUIRED_FOR_LOCKED_STATUS" }, { status: 400 });
                }
            }
        } else {
            updateData.password = null;
        }

        // Handle thumbnail replacement
        if (thumbnail && thumbnail.size > 0) {
            updateData.thumbnail = await handleThumbnailUpload(thumbnail);
        }

        const post = await prisma.post.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(post);
    } catch (error: any) {
        console.error("Content update error:", error);
        if (error.message === "INVALID_FILE_TYPE") return NextResponse.json({ error: "INVALID_FILE_TYPE" }, { status: 400 });
        if (error.message === "FILE_TOO_LARGE") return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
        if (error.message === "FILE_SIGNATURE_MISMATCH") return NextResponse.json({ error: "FILE_SIGNATURE_MISMATCH" }, { status: 400 });
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    if (!validateCSRF(request)) {
        return NextResponse.json({ error: "CSRF_DETECTED" }, { status: 403 });
    }

    try {
        const { id } = await request.json();
        if (!id) return NextResponse.json({ error: "ID_REQUIRED" }, { status: 400 });

        await prisma.post.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Content delete error:", error);
        return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
    }
}
