import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from server/.env or root .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
