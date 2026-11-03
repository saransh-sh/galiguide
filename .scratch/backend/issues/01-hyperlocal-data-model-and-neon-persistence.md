# Ticket 01: Hyperlocal Data Model & Neon Persistence

## Goal
Implement and migrate the relational Prisma schema to Neon Serverless PostgreSQL with connection pooling.

## Scope
- Relational schema with `Vendor`, `OperatingSchedule`, `Category`, `Area`, `User`, `AuditLog`.
- Foreign key relations, unique indices on vendor slug and category slug.
- Connection pooling support in `server/src/lib/prisma.ts`.
- Database seeding with authentic Indore vendors across Chappan Dukan, Sarafa Bazaar, Rajwada, Palasia.

## Acceptance Criteria
- [x] Schema pushed to Neon PostgreSQL with 0 migration errors.
- [x] Connection pooling via `pooler.neon.tech` prevents connection exhaustion.
- [x] Seed populates 22 authentic vendors, 10 categories, 10 municipal wards, 154 operating schedules.
- [x] Meets PAC-01, PAC-03, PAC-04.
