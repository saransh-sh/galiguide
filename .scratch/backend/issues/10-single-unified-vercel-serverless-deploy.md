# Ticket 10: Unified Monorepo Serverless Deployment

## Goal
Package React frontend and Express serverless API into a single unified deployment on Vercel backed by Neon PostgreSQL.

## Scope
- Root `vercel.json` routing `/api/(.*)` to `api/index.ts` and `/((?!api/).*)` to `client/dist`.
- Vercel build script `npm run vercel-build` building the client workspace.
- Production environment variables: `DATABASE_URL`, `POSTGRES_PRISMA_URL`, `JWT_SECRET`, `NODE_ENV`.
- GitHub Actions CI workflow executing test suite against PostgreSQL 16 container before deploy.

## Acceptance Criteria
- [x] Deployment status `READY` on Vercel.
- [x] Public endpoints accessible with zero SSO barrier.
- [x] Automatic deployments on pushes to `main`.
