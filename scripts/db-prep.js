const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || '';

if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  console.log('[db-prep] PostgreSQL database detected. Generating Prisma client...');
  execSync('npx prisma generate --schema=server/prisma/schema.postgresql.prisma', { stdio: 'inherit' });
  try {
    console.log('[db-prep] Pushing PostgreSQL schema...');
    execSync('npx prisma db push --schema=server/prisma/schema.postgresql.prisma --accept-data-loss', { stdio: 'inherit' });
    console.log('[db-prep] Seeding PostgreSQL database...');
    execSync('npx ts-node server/prisma/seed.ts', { stdio: 'inherit' });
  } catch (err) {
    console.warn('[db-prep] Note during PostgreSQL migration/seeding:', err.message);
  }
} else {
  console.log('[db-prep] SQLite database mode. Generating Prisma client...');
  execSync('npx prisma generate --schema=server/prisma/schema.prisma', { stdio: 'inherit' });
  try {
    console.log('[db-prep] Pushing SQLite schema to server/prisma/dev.db...');
    execSync('npx prisma db push --schema=server/prisma/schema.prisma --accept-data-loss', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'file:./dev.db' }
    });
    console.log('[db-prep] Seeding SQLite database...');
    execSync('npx ts-node server/prisma/seed.ts', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'file:./dev.db' }
    });
  } catch (err) {
    console.warn('[db-prep] Note during SQLite setup/seeding:', err.message);
  }
}
