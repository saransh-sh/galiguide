require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { execSync } = require('child_process');

console.log('Pushing schema to Neon PostgreSQL...');
execSync('npx prisma db push --schema=server/prisma/schema.postgresql.prisma --accept-data-loss', {
  stdio: 'inherit',
  env: process.env,
});

console.log('Seeding Neon PostgreSQL...');
execSync('npx ts-node server/prisma/seed.ts', {
  stdio: 'inherit',
  env: process.env,
});

console.log('Neon database migration and seed completed successfully!');
