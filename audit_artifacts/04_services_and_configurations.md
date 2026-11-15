---
title: "GaliGuide Services, Database & Infrastructure Audit"
document_id: "AUDIT-04-SERVICES-2026"
version: "1.0.0"
status: "PRODUCTION_VERIFIED"
classification: "AI_INGESTIBLE_AUDIT"
last_audit_timestamp: "2026-11-15T15:00:00Z"
target_system: "Neon Serverless PostgreSQL, Vercel Edge & GitHub Actions CI"
---

# 4. Services, Database & Infrastructure Configurations Audit

## 4.1 Persistence Infrastructure: Neon Serverless PostgreSQL

Production persistence lives on Neon Serverless PostgreSQL in the AWS Europe (Frankfurt) region (`aws-eu-central-1`). Neon's compute-storage separation and connection pooling resolve the challenges of serverless API deployments.

### 1. Connection Topology & Pooling Specification
- **Database Endpoint:** `ep-lucky-cloud-b94saro1-pooler.c-7.eu-central-1.aws.neon.tech`
- **Database Name:** `neondb`
- **SSL Mode:** `require` (TLS 1.3 enforced)
- **Connection Pooling Host:** Uses PgBouncer serverless connection pooler on port 5432 (`-pooler` subdomain). This prevents connection exhaustion during concurrent Vercel serverless lambda execution bursts.
- **Client Configuration (`server/src/lib/prisma.ts`):**
  ```typescript
  import { PrismaClient } from '@prisma/client';

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;

  export const prisma = new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
  ```
  Seamlessly binds to either `DATABASE_URL` (direct/pooled connection) or `POSTGRES_PRISMA_URL` (injected automatically by Vercel's native Neon marketplace integration).

### 2. Neon Branching Lifecycle (`neon.ts`)
Configured using `@neon/config/v1`:
```typescript
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  branch: {
    name: "production",
  },
  nonDefaultBranch: {
    ttl: "7d", // Ephemeral preview branches auto-expire after 7 days
  },
  auth: false, // Authentication is handled internally via JWT & bcrypt
});
```
- **Production Branch:** Persistent state hosting all verified Indore municipal vendor records.
- **Preview Branches:** Ephemeral database branches spun up per GitHub Pull Request, automatically garbage collected after 7 days to eliminate cloud storage waste.

### 3. Live Production Database Verification
Executed via Neon MCP SQL client on project `nameless-fog-83505027`:
- `categories`: 10 rows (Street Food & Chaat, Chai & Beverages, Cobbler / Shoe Repair, Key Maker & Locksmith, Knife Sharpener, Fruit & Vegetable Thelas, Tailor & Alteration, Flower & Garland Vendor, Cycle & Tyre Repair, Pottery & Mitti Artisans).
- `areas`: 10 rows (Sarafa Bazaar, Chappan Dukan, Rajwada, Palasia, Vijay Nagar, Bhanwarkuan, Malwa Mill, Jail Road, Annapurna, MT Cloth Market).
- `admin_users`: 2 rows (`admin@galiguide.in` as `SUPER_ADMIN`, `verifier@galiguide.in` as `ADMIN`).
- `vendors`: 22 authentic Indore street vendors.
- `operating_hours`: 154 rows (7 daily schedule rows per vendor).
- `audit_logs`: 36 immutable action trail records.

---

## 4.2 Hosting & Gateway: Vercel Serverless Edge

Unified deployment is governed by root `vercel.json`:
```json
{
  "version": 2,
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "client/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 1. Build & Routing Execution
- **Build Trigger:** `npm run vercel-build` in root `package.json`:
  ```json
  "vercel-build": "prisma generate --schema=server/prisma/schema.prisma && npm run build --workspace=client && npm run build --workspace=server"
  ```
- **Static Assets:** The compiled React Vite bundle (`client/dist/`) is served directly from Vercel's global CDN edge at `/`.
- **API Rewrites:** All requests matching `/api/(.*)` route directly to `api/index.ts`.
- **Zero CORS Preflight:** Because client and API share the same origin (`https://galiguide-saranshlab.vercel.app`), standard browser API calls bypass CORS OPTIONS preflight penalties.

---

## 4.3 Environment Variable Configuration

| Variable Name | Environment | Classification | Description & Expected Format |
|---------------|-------------|----------------|-------------------------------|
| `DATABASE_URL` | Production & Staging | Secret | Neon PostgreSQL pooled connection URI:<br>`postgresql://[user]:[password]@[host]-pooler.neon.tech/neondb?sslmode=require` |
| `POSTGRES_PRISMA_URL` | Vercel Edge | Secret | Injected automatically by Vercel-Neon integration for Prisma pooled access. |
| `JWT_SECRET` | Production & Local | Secret | 256-bit secret key used by `jsonwebtoken` for signing and verifying 24-hour admin bearer tokens. |
| `PORT` | Local Development | Config | Standalone HTTP listener port for Express backend (default: `5000`). |
| `NODE_ENV` | Production & Local | Config | Runtime mode (`development`, `production`, `test`). Controls Prisma query logging and error detail disclosure. |

---

## 4.4 Continuous Integration & Delivery (GitHub Actions)

Defined in `.github/workflows/ci.yml`, the automated pipeline gates every pull request and push to `main`:

```yaml
name: GaliGuide CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: galiguide_test
          POSTGRES_USER: galiguide
          POSTGRES_PASSWORD: testpassword123
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-cmd-interval 10s
          --health-cmd-timeout 5s
          --health-cmd-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate --schema=server/prisma/schema.prisma

      - name: Run Prisma Database Migrations
        run: npx prisma db push --schema=server/prisma/schema.prisma
        env:
          DATABASE_URL: postgresql://galiguide:testpassword123@localhost:5432/galiguide_test

      - name: Run Backend Unit & Integration Tests
        run: npm test --workspace=server
        env:
          DATABASE_URL: postgresql://galiguide:testpassword123@localhost:5432/galiguide_test
          JWT_SECRET: ci-test-secret-key-32-characters-minimum

      - name: Verify Client Build
        run: npm run build --workspace=client

      - name: Verify Server Build
        run: npm run build --workspace=server
```

---

## 4.5 Automated Verification Scripts

The repository ships with 3 comprehensive verification scripts in `scripts/`:

1. **`scripts/verify_galiguide.ps1`**:
   - Automated 14-point Prototype Acceptance Criteria regression runner.
   - Evaluates categories, bilingual search, pagination, 7-day schedule, dialer protocol, universal navigation links, admin JWT, vendor CRUD, coordinate bounds, verification toggles, fallback localities, roaming pushcart safeguards, DPDP phone masking, and Haversine distance.
   - Can target local host (`http://localhost:5000`) or production (`https://galiguide-saranshlab.vercel.app`).
2. **`scripts/verify_rules.ps1`**:
   - Verifies 16 workspace rule files across `AGENTS.md`, `GEMINI.md`, `.cursor/rules/`, and `.agents/rules/`.
   - Confirms zero violations.
3. **`scripts/verify_skills.ps1`**:
   - Verifies 50 Antigravity agent skill manifests, ensuring YAML frontmatter integrity and skill routing health.
