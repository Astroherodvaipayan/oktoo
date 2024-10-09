import { PrismaClient } from '@prisma/client';

const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.NEXT_PUBLIC_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NEXT_PUBLIC_ENV !== 'production') globalForPrisma.prisma = db;
