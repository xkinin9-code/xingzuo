import { PrismaClient } from '@prisma/client';

// Create a dummy Prisma client since the project uses SQLite directly
// This file is kept for compatibility but won't be used
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Dummy client that throws an error if used
const prisma = undefined as unknown as PrismaClient;

export const prismaClient = prisma;
export default prisma;