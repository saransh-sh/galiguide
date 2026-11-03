const { execSync } = require('child_process');

console.log('[db-prep] Generating Prisma Client for Neon PostgreSQL...');
execSync('npx prisma generate --schema=server/prisma/schema.prisma', { stdio: 'inherit' });
console.log('[db-prep] Prisma Client ready.');
