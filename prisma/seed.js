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

    // ── Seed Posts ────────────────────────────────────────────────────────────
    await prisma.post.createMany({
        data: [
            {
                title: "Monitoring Daemon v2 - Retired HTB",
                slug: "monitoring-daemon-v2",
                type: "WRITEUP",
                platform: "HTB",
                difficulty: "Hard",
                status: "PUBLISHED",
                tags: "SSRF, Networking, Linux",
                content: `# Monitoring Daemon v2 Writeup

## Introduction
This machine involved an SSRF vulnerability in a custom monitoring dashboard.

## Initial Access
After scanning with nmap, I found port 80 and 8080 open.

\`\`\`bash
nmap -sV -sC -oA nmap/initial 10.10.11.144
\`\`\`

## Privilege Escalation
Found a misconfigured sudo capability on a custom binary.

| Strategy | Success | Notes |
|----------|---------|-------|
| SUID | No | - |
| Capabilities | Yes | cap_setuid |
| Cron | No | - |

## Conclusion
Great machine for practicing internal SSRF.`,
            },
            {
                title: "Active Mission: Encryption Key [ENCRYPTED]",
                slug: "active-mission-encryption",
                type: "WRITEUP",
                platform: "CTF",
                difficulty: "Insane",
                status: "LOCKED",
                password: await bcrypt.hash("key123", 10),
                tags: "Binary, Overflow, ROP",
                content: `# YOU FOUND THE SECRET CONTENT
This content is protected because the mission is still active.

## Steps taken:
1. Binary analysis of the target ELF.
2. Identifying the overflow in the read() buffer.
3. ROP chain construction.

### Flag:
CTF{n30n_cyp3rpunk_vib3s_2026}`,
            },
            {
                title: "Aegis Scraper",
                slug: "aegis-scraper",
                type: "PROJECT",
                platform: "N/A",
                status: "PUBLISHED",
                description:
                    "A high-performance security auditing tool for distributed web architectures.",
                githubUrl: "https://github.com/example/aegis",
                tags: "Rust, Security, Networking",
                content: "# Aegis Scraper\n\nA high-performance security auditing tool.",
            },
            {
                title: "Neon-CMS",
                slug: "neon-cms",
                type: "PROJECT",
                platform: "N/A",
                status: "PUBLISHED",
                description:
                    "A cyberpunk-themed headless CMS for security researchers.",
                demoUrl: "https://demo.example.com",
                tags: "Next.js, Prisma, Tailwind",
                content: "# Neon-CMS\n\nA cyberpunk-themed headless CMS.",
            },
        ],
    });
    console.log("✅ Posts seeded (writeups + projects).");

    // ── Seed Certifications ──────────────────────────────────────────────────
    await prisma.certification.createMany({
        data: [
            {
                title: "CompTIA Security+",
                issuer: "CompTIA",
                date: new Date("2025-06-15"),
                description: "Foundational cybersecurity certification.",
            },
        ],
    });
    console.log("✅ Certifications seeded.");

    console.log("\n🚀 Database seeded successfully.");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
