# Agent Instructions — GaliGuide

Authoritative instructions for AI agents working in this repository.

## Project Context

- **Product:** GaliGuide — Hyperlocal Informal Vendor Discovery & Navigation System for Indore, Madhya Pradesh (see `docs/PRD.md`, `docs/TECHNICAL_DESIGN.md`, and `docs/PRODUCTION_SPECIFICATION.md`).
- **Backend:** Express + TypeScript + Prisma ORM + Neon PostgreSQL serverless application (`server/` and `api/index.ts`).
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Leaflet web application (`client/`).
- **Database:** Neon Serverless PostgreSQL with connection pooling (`aws-eu-central-1`).
- **Mapping:** OpenStreetMap + Leaflet + MarkerCluster + Leaflet Heatmap (**strictly zero Google Maps API costs**).
- **Deployment:** Single unified Vercel deployment serving both client SPA and serverless API functions under `https://galiguide-saranshlab.vercel.app`.

---

## The 6 Golden Rules of GaliGuide

> 1. **Zero Google Maps Platform API Cost:** Under NO circumstances may the codebase import, initialize, or execute Google Maps Platform paid APIs (Places, Directions, Geocoding, Dynamic JavaScript SDK). The application MUST use Leaflet with OpenStreetMap tiles.
> 2. **Zero-Cost Universal Navigation Link:** Route directions MUST be initiated by opening an external link to the universal web URL:  
>    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`  
>    This hands off routing to the user's native Google Maps mobile app on Android/iOS at zero cost to the platform.
> 3. **Privacy-First Phone Protection:** If an informal vendor has not explicitly granted consent (`hasConsentForPhone = false`), the public API MUST mask their phone number (`+91 98XXX-XX123`). Only authenticated Municipal Ward Admins may view unmasked numbers.
> 4. **Bilingual First:** All vendor names, categories, and searches MUST support seamless bilingual discovery in both English and Devanagari Hindi (e.g. "Dahi Vada" and "दही वड़ा", "Cobbler" and "मोची").
> 5. **Mathematical Haversine Geodesy:** Spatial proximity filtering and radius calculations MUST use spherical geodesy (`server/src/lib/haversine.ts`) with bounding box pre-filtering. Never require PostGIS database extensions or external geocoders.
> 6. **Neon Serverless Persistence:** Production state lives in Neon PostgreSQL with connection pooling (`aws-eu-central-1.pooler.neon.tech`). Never rely on serverless lambda local disk for persistent data.

---

## Non-Negotiable Coding Standards

### 1. Architecture & Layer Boundaries

See `docs/ARCHITECTURE_CODING_STANDARDS.md`, `.cursor/rules/node-express-backend.mdc`, and `.cursor/rules/react-frontend.mdc`.

- **Express Backend:** `routes -> controller -> services/lib -> Prisma ORM -> Neon PostgreSQL`.
- **Validation:** All incoming request bodies and query parameters MUST be validated with Zod or dedicated validation middleware.
- **Error Envelopes:** All errors return `{ success: false, error: { code, message }, requestId }`.
- **React Frontend:** `views/pages -> components -> hooks -> lib/api -> Express API`.
- **Leaflet Map:** Map instances must initialize cleanly with OpenStreetMap tiles, spiderfy clusters at street level (zoom 18), and handle responsive mobile touch viewports.

### 2. YAGNI and DRY — No Speculative Abstraction

See `.cursor/rules/yagni-dry.mdc`.

- Build only what current PRD requirements specify.
- No Redis caches, Kafka queues, or microservice splits. The single unified monorepo satisfies all performance goals.
- Reuse mathematical geodesy functions from `server/src/lib/haversine.ts` instead of duplicating coordinate math.

### 3. SOLID — Pragmatic and Lean

See `.cursor/rules/solid-principles.mdc`.

- Single responsibility per controller and component.
- Keep data transfer objects clean and avoid leaking admin metadata into public endpoints.

### 4. Mandatory Unit Tests with Full Scenario Coverage

See `.cursor/rules/mandatory-unit-tests.mdc`.

- Every change MUST ship with corresponding unit/integration tests in the same commit.
- Cover all 5 scenario categories: Happy path, Invalid inputs, Boundary values, Error paths, Domain edge cases.
- `npm test --workspace=server` must pass with 0 failures before any deploy.

### 5. Mandatory `/grill-me` Before Requirements or Specs

See `.cursor/rules/grill-me-mandatory.mdc`.

- Never guess requirements or make silent assumptions on spatial boundaries, privacy constraints, or admin permissions. Run `/grill-me` when details are ambiguous.

### 6. Anti-Slop Quality Gate

See `.agents/skills/saransh_custom_antislop/SKILL.md` and `.agents/skills/brandkit/SKILL.md`.

- GaliGuide features an authentic, culturally rooted Indore aesthetic:
  - Terracotta Primary: `#9d3e1c`
  - Sage Green Secondary: `#3d6659`
  - Warm Cream Surface: `#f5fbf3`
- Never introduce purple/indigo AI gradients, heavy glassmorphism, floating decorative blobs, or nested card border clutter.

---

## Ubiquitous Domain Vocabulary

Use these authoritative terms consistently across code, tests, and documentation:

| Term | Meaning | Terms to Avoid |
|---|---|---|
| **Vendor** | An informal street entrepreneur (thela, gumti, phad, roaming) | Merchant, Store, Shop, Outlet |
| **Thela** | A mobile four-wheeled handcart / pushcart | Food truck, Mobile kiosk, Van |
| **Gumti** | A small semi-permanent wooden or tin roadside stall | Storefront, Booth, Retail unit |
| **Phad** | A ground-cloth vendor setup (e.g. vegetable or utensil sellers) | Pop-up shop, Ground store |
| **Roaming Vendor** | A vendor who moves between localities through the day | Itinerant merchant, Roaming retailer |
| **Operating Schedule** | 7-day operating windows with opening/closing times | Store hours, Business hours |
| **Landmark Guidance** | Hyperlocal descriptive directions (e.g. "Opposite High Court Gate 2") | Turn-by-turn routing, GPS address |
| **Ward Lead** | Indore Municipal Ward administrator who verifies vendor listings | Store manager, Moderator |
| **Universal Nav Link** | Zero-cost deep link to Google Maps navigation (`/maps/dir/?api=1`) | Google Maps SDK, Native directions |

---

## Engineering Execution Workflow

```text
1. Requirement Analysis (docs/PRD.md & PAC-01 to PAC-14)
       │
       ▼
2. Architecture & Design Alignment (docs/ARCHITECTURE_CODING_STANDARDS.md)
       │
       ▼
3. Test-Driven Development (TDD with Jest & Supertest)
       │
       ▼
4. Backend / Frontend Implementation Slice
       │
       ▼
5. Anti-Slop Pass & UI Polish (Terracotta/Sage Palette, Leaflet OSM)
       │
       ▼
6. Full Suite Verification (`npm test --workspace=server` & verify_galiguide.ps1)
       │
       ▼
7. Vercel Production Deployment & GitHub Sync
```
