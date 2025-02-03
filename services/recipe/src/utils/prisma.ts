import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "info", "query", "warn"],
  });

// Ensure Prisma is properly closed when the app stops
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// Store Prisma instance globally to prevent multiple connections in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
