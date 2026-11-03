# YAGNI & DRY (Strict Lean Architecture)

Every feature in GaliGuide must remain lean and directly tied to informal street discovery.

## YAGNI — You Aren't Gonna Need It
- Implement only what the current PRD requirements dictate.
- No Redis caching, PostGIS spatial extensions, microservices, or complex queues.
- Avoid wrapper classes around single database queries.

## DRY — Don't Repeat Yourself
- Reuse spatial geodesy helpers (`calculateHaversineDistance`, `calculateBoundingBox`) from `server/src/lib/haversine.ts`.
- Share API contracts and status enum definitions between client and server.
- Reuse phone masking and distance display utilities across views.
