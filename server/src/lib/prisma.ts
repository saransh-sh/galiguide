import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from server/.env if not already present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.resolve(__dirname, '../../prisma/dev.db')}`;
}

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
