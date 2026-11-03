const { execSync } = require('child_process');

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || '';

if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  console.log('PostgreSQL database detected. Generating Prisma client with PostgreSQL schema...');
  execSync('npx prisma generate --schema=server/prisma/schema.postgresql.prisma', { stdio: 'inherit' });
} else {
  console.log('Local/SQLite database detected. Generating Prisma client with SQLite schema...');
  execSync('npx prisma generate --schema=server/prisma/schema.prisma', { stdio: 'inherit' });
}
