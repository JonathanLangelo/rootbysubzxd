import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prismaLatest: PrismaClient };

export const prisma =
    globalForPrisma.prismaLatest ||
    new PrismaClient({
        // M6 FIX: Only log queries in development
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaLatest = prisma;
