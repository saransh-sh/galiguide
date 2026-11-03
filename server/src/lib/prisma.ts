import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from server/.env if not already present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;

// On Vercel serverless environments, if using SQLite, copy pre-seeded database to writable /tmp
if (process.env.VERCEL && (!dbUrl || dbUrl.startsWith('file:'))) {
  const tmpDbPath = '/tmp/galiguide.db';
  if (!fs.existsSync(tmpDbPath)) {
    // Search possible bundled locations for dev.db
    const candidatePaths = [
      path.resolve(process.cwd(), 'server/prisma/dev.db'),
      path.resolve(__dirname, '../../prisma/dev.db'),
      path.resolve(__dirname, '../../../server/prisma/dev.db'),
      path.resolve(process.cwd(), 'prisma/dev.db'),
    ];

    let copied = false;
    for (const src of candidatePaths) {
      if (fs.existsSync(src)) {
        try {
          fs.copyFileSync(src, tmpDbPath);
          console.log(`[GaliGuide] Successfully copied seeded database from ${src} to ${tmpDbPath}`);
          copied = true;
          break;
        } catch (err) {
          console.error(`[GaliGuide] Failed to copy from ${src}:`, err);
        }
      }
    }

    if (!copied) {
      console.warn('[GaliGuide] No bundled dev.db found. Prisma will initialize new SQLite database at /tmp/galiguide.db');
    }
  }

  dbUrl = `file:${tmpDbPath}`;
  process.env.DATABASE_URL = dbUrl;
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.resolve(__dirname, '../../prisma/dev.db')}`;
  dbUrl = process.env.DATABASE_URL;
}

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
