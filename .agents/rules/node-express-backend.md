# Express / Node.js Backend Architecture Rules

Authoritative rules for the GaliGuide Express / TypeScript serverless backend.

## Layer Flow
```text
routes -> controller -> lib/service -> Prisma client -> Neon PostgreSQL (pooled)
```

## Mandatory Constraints
1. **Zero Google Maps Platform API Cost:** NEVER import, initialize, or execute Google Maps Platform SDKs. All spatial queries MUST use native Haversine formulas (`server/src/lib/haversine.ts`).
2. **Universal Navigation URLs:** Generate zero-cost deep links only: `https://www.google.com/maps/dir/?api=1&destination=lat,lng`.
3. **Privacy-First Phone Masking:** If `hasConsentForPhone = false`, public APIs MUST mask the number (`+91 98XXX-XX123`). Only authenticated Municipal Ward Admins via `/api/admin/vendors` can inspect full numbers.
4. **Bilingual Search:** All text searches must match both English and Devanagari Hindi substrings.
5. **Neon Serverless Persistence:** Connect via Prisma using connection pooling (`aws-eu-central-1.pooler.neon.tech`). Never rely on local filesystem `/tmp` for persistent mutations.
6. **Error Handling & Traceability:** Use `AppError` subclasses. Every response must attach an `x-request-id`. Redact sensitive data from logs.
