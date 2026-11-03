# ADR 0001: Modular Monolith with Express, Prisma, and Neon PostgreSQL

## Context
GaliGuide requires a fast, low-overhead backend capable of serving public discovery queries, geospatial calculations, and admin verification operations. The deployment target is Vercel Serverless Functions. Local SQLite files are ephemeral and read-only on serverless lambda instances.

## Decision
We chose a **modular monolith** with Express, TypeScript, and Prisma ORM backed by **Neon Serverless PostgreSQL** with connection pooling (`aws-eu-central-1.pooler.neon.tech`).

## Rationale
1. **Serverless Persistence:** Neon PostgreSQL provides persistent cloud storage with instant branching and connection pooling, overcoming the read-only `/tmp` limitation of serverless functions.
2. **Type Safety:** Prisma ORM provides end-to-end type safety between the database schema and Express controllers.
3. **Low Complexity:** A modular monolith avoids the operational and network latency overhead of microservices while keeping the deployment footprint minimal.

## Consequences
- **Positive:** Persistent cloud updates across all lambda instances; connection pooling prevents database socket exhaustion; rapid development via Prisma schema migrations.
- **Negative:** Requires external cloud database connection rather than purely offline local execution (mitigated by environment variables and connection pooling).
