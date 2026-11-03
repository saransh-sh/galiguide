# GaliGuide — Antigravity Workspace Directives

Authoritative instructions and constraints for Google Antigravity agents operating in the GaliGuide codebase.

## The 6 Golden Rules of GaliGuide

1. **Zero Google Maps Platform API Cost:** Under NO circumstances may the codebase import, initialize, or execute Google Maps Platform paid APIs (Places, Directions, Geocoding, Dynamic JavaScript SDK). The application MUST use Leaflet with OpenStreetMap raster tiles.
2. **Zero-Cost Universal Navigation Link:** Route directions MUST be initiated by opening an external link to the universal web URL:  
   `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`  
   This hands off turn-by-turn navigation directly to the user's native Google Maps mobile app or browser at zero platform cost.
3. **Privacy-First Phone Protection:** If an informal vendor has not explicitly granted consent (`hasConsentForPhone = false`), the public API MUST mask their phone number (`+91 98XXX-XX123`). Only authenticated Municipal Ward Admins may view unmasked numbers.
4. **Bilingual First:** All vendor names, categories, and searches MUST support seamless bilingual discovery in both English and Devanagari Hindi (e.g. "Dahi Vada" and "दही वड़ा", "Cobbler" and "मोची").
5. **Mathematical Haversine Geodesy:** Spatial proximity filtering and radius calculations MUST use spherical geodesy (`server/src/lib/haversine.ts`) with bounding-box pre-filtering. Never require PostGIS database extensions or external geocoders.
6. **Neon Serverless Persistence:** Production state lives in Neon Serverless PostgreSQL with connection pooling (`aws-eu-central-1.pooler.neon.tech`). Never rely on serverless lambda local disk for persistent data.

---

## Workspace Navigation & References

- **Full Agent Manual:** [AGENTS.md](file:///C:/Users/saransh/teamwork_projects/galiguide/AGENTS.md)
- **Ubiquitous Domain Vocabulary:** [CONTEXT.md](file:///C:/Users/saransh/teamwork_projects/galiguide/CONTEXT.md)
- **System Architecture & Coding Standards:** [docs/ARCHITECTURE_CODING_STANDARDS.md](file:///C:/Users/saransh/teamwork_projects/galiguide/docs/ARCHITECTURE_CODING_STANDARDS.md)
- **Architectural Decision Records:** [docs/adr/](file:///C:/Users/saransh/teamwork_projects/galiguide/docs/adr/)
- **Modular Rule Files:** [.agents/rules/](file:///C:/Users/saransh/teamwork_projects/galiguide/.agents/rules/)
- **Skills Library:** [.agents/skills/](file:///C:/Users/saransh/teamwork_projects/galiguide/.agents/skills/)

---

## Non-Negotiable Layer Boundaries

- **Backend (Express + Prisma + Neon):** `routes -> controller -> services/lib -> Prisma ORM -> Neon PostgreSQL`.
- **Frontend (React 18 + Vite + Tailwind CSS):** `pages/views -> components -> hooks -> lib/api -> Express API`.
- **Cartography (Leaflet + OSM):** Leaflet raster tiles from OpenStreetMap; MarkerCluster spiderfying at zoom 18; Leaflet Heat density overlay.
- **Testing Standard:** Every change must ship with 100% scenario coverage across Happy path, Invalid inputs, Boundary values, Error paths, and Domain edge cases (`npm test --workspace=server`).
