---
title: "GaliGuide System Architecture & Topology Audit"
document_id: "AUDIT-01-ARCH-2026"
version: "1.0.0"
status: "PRODUCTION_VERIFIED"
classification: "AI_INGESTIBLE_AUDIT"
last_audit_timestamp: "2026-11-15T14:57:00Z"
target_system: "GaliGuide (Hyperlocal Informal Vendor Discovery & Navigation)"
production_url: "https://galiguide-saranshlab.vercel.app"
repository: "c:\\Users\\saransh\\Desktop\\galiguide"
---

# 1. System Architecture Overview & Topology

## 1.1 Executive Summary
GaliGuide is a production-grade, zero-cost hyperlocal vendor discovery and navigation system purpose-built for the informal street economy of Indore, Madhya Pradesh. The system provides real-time digital visibility, bilingual search, topological landmark navigation, and administrative governance for over 60,000 informal street entrepreneurs (operating *thelas*, *gumtis*, *phads*, and roaming pushcarts) across 10 commercial corridors.

The platform is engineered as an npm workspaces monorepo deployed as a unified atomic release on Vercel (`https://galiguide-saranshlab.vercel.app`), integrating a React 18 Single Page Application (SPA), an Express + TypeScript modular API, and a serverless PostgreSQL database hosted on Neon Cloud (`aws-eu-central-1.pooler.neon.tech`) managed via Prisma ORM.

```
+----------------------------------------------------------------------------------------------------+
|                                    GALIGUIDE MONOREPO TOPOLOGY                                     |
|                                                                                                    |
|  +---------------------------------+             +----------------------------------------------+  |
|  |     Client Tier (client/)       |             |             Server Tier (server/)            |  |
|  |  React 18 + TypeScript + Vite   |             |           Express + TypeScript API           |  |
|  |  Tailwind CSS (Terracotta/Sage) |             |        Modular Controllers & Services        |  |
|  |  Leaflet 1.9.4 + OSM Tiles      |             |        Spherical Haversine Geodesy Engine    |  |
|  |  MarkerCluster + Leaflet Heat   |             |        DPDP Privacy Redaction Pipeline       |  |
|  +----------------+----------------+             +----------------------+-----------------------+  |
|                   |                                                     |                          |
|                   | Build output: client/dist/                          | Mounted via api/index.ts |
|                   v                                                     v                          |
|  +----------------------------------------------------------------------------------------------+  |
|  |                          Vercel Unified Serverless Edge & Gateway                            |  |
|  |                     (vercel.json: Static SPA @ / , Serverless API @ /api/*)                  |  |
|  +------------------------------------------------+---------------------------------------------+  |
|                                                   |                                                |
|                                                   | TLS Pooled Connection (Prisma Client)          |
|                                                   v                                                |
|  +----------------------------------------------------------------------------------------------+  |
|  |                     Persistence Tier: Neon Serverless PostgreSQL                             |  |
|  |                 Region: aws-eu-central-1 | Pooled Host: aws-eu-central-1.pooler.neon.tech    |  |
|  |                 Relational Models: AdminUser, Category, Area, Vendor, OperatingHour, AuditLog|  |
|  +----------------------------------------------------------------------------------------------+  |
+----------------------------------------------------------------------------------------------------+
```

---

## 1.2 The 6 Golden Rules of GaliGuide

Every architectural boundary, controller, and component strictly satisfies the 6 Golden Rules codified in `AGENTS.md` and `GEMINI.md`:

| # | Rule Name | Specification & Implementation Mechanism | Architectural Impact |
|---|-----------|------------------------------------------|----------------------|
| **1** | **Zero Google Maps Platform API Cost** | Cartography strictly utilizes Leaflet 1.9.4 (`client/src/components/MapView.tsx:113`) with OpenStreetMap raster tiles (`tile.openstreetmap.org`). Under no circumstances is the paid Google Maps JavaScript SDK, Places API, or Geocoding API imported or executed. | Zero licensing fees, infinite public map view scalability without credit card consumption or billing spikes. |
| **2** | **Zero-Cost Universal Navigation Link** | Pedestrian routing is triggered by external deep links (`client/src/components/VendorDetailDrawer.tsx:210-220` and `server/src/controllers/vendor.controller.ts:217, 340`):<br>`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`. | Hands off turn-by-turn navigation directly to the user's native Google Maps mobile application on Android/iOS at $0.00 platform cost. |
| **3** | **Privacy-First Phone Protection** | Enforces India's Digital Personal Data Protection (DPDP) Act. In `server/src/controllers/vendor.controller.ts:176-188, 330-337`, if `consentObtained` or `isPhonePublic` is false, `contactPhone` is rendered `null` and redacted (`+91 98XXX-XX123`). The UI replaces the call button with *"In-Person Visit Only"*. | Shields vulnerable street vendors from automated commercial scraping, telemarketing, and predatory harassment. |
| **4** | **Bilingual First** | Every vendor, category, and locality entity maintains paired English and Devanagari Hindi strings (`name` & `hindiName`). The search engine (`server/src/controllers/vendor.controller.ts:130-164`) executes case-insensitive substring matching across both scripts simultaneously. | Ensures equitable access for vernacular-first local buyers, civic ward leads, and tourists alike. |
| **5** | **Mathematical Haversine Geodesy** | Proximity filtering and distance sorting are executed via pure spherical geodesy (`server/src/lib/haversine.ts:25-38`) with pre-filtering bounding boxes (`deltaLat = radiusKm / 111.045`). | Sub-meter spatial precision without requiring PostGIS extensions, keeping the database lean and portable. |
| **6** | **Neon Serverless Persistence** | Persistent data lives in Neon PostgreSQL with connection pooling (`ep-lucky-cloud-b94saro1-pooler.c-7.eu-central-1.aws.neon.tech`). | Overcomes ephemeral serverless lambda disk limitations, pooling hundreds of concurrent connections seamlessly. |

---

## 1.3 Monorepo Workspace Structure & Layer Boundaries

The repository is structured as an npm workspaces monorepo declared in root `package.json` (lines 6-9):
```json
{
  "name": "galiguide",
  "version": "1.0.0",
  "workspaces": [
    "server",
    "client"
  ]
}
```

### Layer Boundary Constraints
```
[Client SPA View]
      │
      ▼ (HTTP / JSON)
[Vercel Serverless Function: api/index.ts]
      │
      ▼
[Express Router: server/src/routes/api.routes.ts]
      │
      ▼ (Zod Schema Validation & Auth Guards)
[Controllers: server/src/controllers/*.ts]
      │
      ▼ (Business Logic & Geodesy)
[Services / Lib: server/src/lib/haversine.ts, redaction.ts]
      │
      ▼ (Prisma Query Engine)
[Neon Serverless PostgreSQL (aws-eu-central-1)]
```

- **Non-Negotiable Seam 1 (Client-Server):** `client/` communicates with `server/` strictly over HTTP REST using standardized JSON envelopes. No direct database or ORM imports exist within the frontend codebase.
- **Non-Negotiable Seam 2 (Server-Persistence):** Express controllers never execute raw, unparameterized SQL strings. All queries run through type-safe Prisma ORM Client (`server/src/lib/prisma.ts`), enforcing foreign key constraints and schema validations.
- **Non-Negotiable Seam 3 (Single-Domain Routing):** In production, `vercel.json` serves `client/dist` statically at `/` and routes `/api/(.*)` to `/api/index.ts`, avoiding cross-origin preflight requests (CORS) and deployment version mismatches.

---

## 1.4 Architectural Decision Records (ADR Index)

The architectural foundations of GaliGuide are documented in 5 authoritative ADRs located at `docs/adr/`:

### ADR 0001: Modular Monolith with Express, Prisma, and Neon PostgreSQL
- **Context:** Hyperlocal vendor discovery requires atomic deployments, low operational complexity, and serverless scalability without maintaining persistent VMs.
- **Decision:** Use an npm workspaces modular monolith with Express.js for the API layer, Prisma ORM for type-safe schema definitions, and Neon Serverless PostgreSQL with connection pooling for high-concurrency serverless execution.
- **Consequences:** Eliminates microservice networking overhead; supports instant branch deployments; enables zero-downtime migrations.

### ADR 0002: Zero-Cost OpenStreetMap & Leaflet over Google Maps Platform API
- **Context:** Google Maps JavaScript SDK and Places API incur prohibitive costs ($7 per 1,000 dynamic map loads, $17 per 1,000 places requests) that violate the zero-cost civic sustainability requirement.
- **Decision:** Mandate Leaflet 1.9.4 with OpenStreetMap raster tiles for in-app map visualization and `Leaflet.heat` for density analytics. Mandate universal Google Maps external URL deep links (`/maps/dir/?api=1`) for pedestrian turn-by-turn routing.
- **Consequences:** Platform mapping costs remain strictly $0.00 regardless of traffic volume.

### ADR 0003: Serverless Single Deployment on Vercel
- **Context:** Running independent frontend and backend hosting services causes CORS latency, token sharing complexity, and dual-deployment synchronization bugs.
- **Decision:** Unify the React Vite frontend and Express backend into a single Vercel deployment using `vercel.json` rewrites and `api/index.ts` serverless function wrapper.
- **Consequences:** Atomic frontend/backend releases; zero CORS preflight overhead for same-origin requests; automatic edge asset caching.

### ADR 0004: Privacy-First Phone Masking and Vendor Protection
- **Context:** Informal street vendors are vulnerable to predatory commercial marketing, automated data harvesting, and financial scam calls.
- **Decision:** Mandate an explicit double-gate check (`consentObtained === true && isPhonePublic === true`) in all public API serializers. Mask unconsented numbers (`+91 98XXX-XX123`) and suppress direct dialer URIs. Only authenticated Municipal Ward Admins can access raw phone numbers.
- **Consequences:** DPDP compliance achieved; vendors trust the municipal directory without fearing spam.

### ADR 0005: Haversine Geodesy Engine with Bounding Box Pre-Filtering
- **Context:** Geospatial queries on cloud databases often require PostGIS extensions that increase hosting costs and complicate deployment pipelines.
- **Decision:** Implement pure TypeScript spherical Haversine geodesy ($R = 6371\text{ km}$) with bounding box delta pre-filtering in memory and SQL range queries.
- **Consequences:** Sub-meter spatial precision; zero database engine dependencies; portable across standard PostgreSQL, SQLite, and serverless compute runtimes.

---

## 1.5 Ubiquitous Domain Vocabulary

To prevent domain drift, all code, schemas, API contracts, and documentation strictly use the ubiquitous Indore domain vocabulary:

| Term | Formal Domain Definition | Code Entity / Property | Prohibited Cliché Terms |
|------|--------------------------|------------------------|-------------------------|
| **Vendor** | An informal street entrepreneur registered within a municipal ward. | `Vendor` model, `/api/vendors` | Merchant, Store, Shop, Outlet, Retailer |
| **Thela** | A mobile 4-wheeled pushcart or handcart. | `stallType = 'PUSH_CART'` | Food truck, Mobile kiosk, Van |
| **Gumti** | A small semi-permanent wooden or tin roadside stall. | `stallType = 'KIOSK'` | Storefront, Booth, Commercial unit |
| **Phad** | A ground-cloth vendor setup (e.g. vegetable or utensil seller). | `stallType = 'GROUND_MAT'` | Pop-up shop, Floor retail |
| **Roaming Vendor** | A mobile hawker moving between galis throughout the day. | `isApproximateLoc = true` | Itinerant merchant, Roaming retailer |
| **Operating Schedule** | 7-day daily operating windows handling late-night shifts. | `OperatingHour` model | Business hours, Store times |
| **Landmark Guidance** | Hyperlocal descriptive directions based on physical anchors. | `vendor.landmark` | Turn-by-turn route, Street address |
| **Ward Lead** | Indore Municipal Corporation official verifying listings. | `AdminUser (role: ADMIN)` | Moderator, Store manager, Admin |
| **Universal Nav Link** | Zero-cost deep link handing off routing to Google Maps app. | `vendor.navigationUrl` | Maps API, Directions route |
