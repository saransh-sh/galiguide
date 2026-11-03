# ADR 0003: Single Unified Monorepo Deployment on Vercel

## Context
Deploying frontend and backend as separate Vercel projects causes CORS overhead, split environment variable management, synchronization mismatches, and multiple URLs.

## Decision
We deploy GaliGuide as a **single unified monorepo on Vercel**, serving static Vite assets from `client/dist` at `/` and serverless Express routes from `api/index.ts` at `/api/*` via `vercel.json` rewrites.

## Rationale
1. **Atomic Deployments:** Every Git push deploys both client and server simultaneously with matching schemas and APIs.
2. **Zero CORS Friction:** Client and API share the identical origin (`https://galiguide-saranshlab.vercel.app`), eliminating cross-origin preflight delays.
3. **Streamlined CI/CD:** A single GitHub Actions workflow tests and builds the monorepo in one run.

## Consequences
- **Positive:** Single domain, zero CORS configuration needed in production, synchronized releases.
- **Negative:** Build command must orchestrate both client build and serverless bundle (`vercel-build`).
