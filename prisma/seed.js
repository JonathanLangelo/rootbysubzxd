// Load .env.local (Next.js convention)
require("dotenv").config({ path: ".env.local" });
require("dotenv").config(); // fallback to .env

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
    // ── Check if Admin exists ────────────────────────────────────────────────
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const existingAdmin = await prisma.admin.findUnique({
        where: { username: adminUsername },
    });

    if (!existingAdmin) {
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
    } else {
        console.log(`ℹ️ Admin user "${adminUsername}" already exists. Skipping.`);
    }

    console.log("✅ Seed check completed (Non-destructive).");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
