import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error(
        "[FATAL] JWT_SECRET environment variable is not set. " +
        "The application cannot start without a secure signing key. " +
        "Set JWT_SECRET in your .env file."
    );
}
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload: Record<string, unknown>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const admin = await prisma.admin.findUnique({
        where: { username },
    });

    if (admin && await bcrypt.compare(password, admin.password)) {
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const session = await encrypt({ user: admin.username, expires });

        (await cookies()).set("session", session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });
        return true;
    }
    return false;
}

// Logout is handled by POST /api/logout Route Handler
// (cookies can only be modified in Route Handlers or Server Actions)

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}
