// Load .env.local (Next.js convention)
require("dotenv").config({ path: ".env.local" });
require("dotenv").config(); // fallback to .env

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
    // Clear existing data (order matters for referential integrity)
    await prisma.certification.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.admin.deleteMany({});

    // ── Create Admin ─────────────────────────────────────────────────────────
    // Use env vars if available, otherwise fall back to defaults for dev
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPasswordHash =
        process.env.ADMIN_PASSWORD_HASH ||
        (await bcrypt.hash("admin1337", 10));

    await prisma.admin.create({
        data: {
            username: adminUsername,
            password: adminPasswordHash,
        },
    });
    console.log(`✅ Admin user "${adminUsername}" created.`);

    console.log("✅ Seed completed (No dummy content, clean state).");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
