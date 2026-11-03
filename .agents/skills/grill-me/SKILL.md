---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Run a `/grilling` session.

**GaliGuide mandatory topics** — cover these for any architecture, API, or feature scope (see `docs/ARCHITECTURE_CODING_STANDARDS.md`):

1. **Layer placement** — what belongs in Express `lib/services` vs `controllers` vs `routes` vs React?
2. **Zero-cost cartography & invariants** — Leaflet OpenStreetMap tiles, MarkerCluster spiderfying at zoom 18, zero paid Google Maps API consumption
3. **Spatial geodesy & boundaries** — Haversine math, bounding box deltas, 6-decimal precision, Indore metropolitan limits
4. **Privacy & ethics** — phone masking for unconsented contacts, non-residential mapping policy, immediate de-listing
5. **Bilingual domain & search** — English and Devanagari Hindi indexing, keyword normalization
6. **Authority & presentation** — what is server-authoritative (Prisma/Neon) vs pure client presentation (React)?
7. **Test scenarios** — full 5-category scenario coverage before any code is written
8. **YAGNI / SOLID** — challenge any proposed interface, package, or abstraction: is there a second use case?

Do not propose code until the frontier is empty and the user confirms shared understanding.
