# Architecture & Coding Standards — GaliGuide

Authoritative reference for architecture, layer boundaries, spatial geodesy, data contracts, and coding standards across the GaliGuide codebase.

---

## 1. System Overview

GaliGuide is a **unified full-stack application** deployed as a single Vercel deployment. It serves a high-performance React Single Page Application (SPA) alongside serverless Express API routes connecting to Neon Serverless PostgreSQL.

```text
               ┌────────────────────────────────────────────────────────┐
               │              Public Explorer (Mobile/Desktop)          │
               │   • Bilingual Search (Hindi/English)                   │
               │   • Interactive Leaflet OpenStreetMap View             │
               │   • MarkerCluster & Heatmap Overlays                   │
               │   • Native Dialer & Universal Google Maps Deep Links   │
               └──────────────────────────┬─────────────────────────────┘
                                          │
                                          │ HTTPS (Vercel Edge CDN)
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │             Vercel Serverless Architecture             │
               │                                                        │
               │   client/dist (Static Assets) ──► Served at /          │
               │   api/index.ts (Express Lambda) ──► Routed at /api/*   │
               └──────────────────────────┬─────────────────────────────┘
                                          │
                                          │ Connection Pooler (SSL)
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │             Neon Serverless PostgreSQL                 │
               │   • Region: aws-eu-central-1 (Frankfurt)               │
               │   • Prisma ORM Engine                                  │
               │   • Authentic Seeded Indore Informal Vendors           │
               └────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Backend

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js (v20.x) / Vercel Lambda | Serverless execution environment |
| Language | TypeScript (strict) | Strong typing and interface enforcement |
| Framework | Express | Lightweight HTTP server & middleware routing |
| Database | Neon PostgreSQL | Cloud serverless database with connection pooling |
| ORM | Prisma ORM (`@prisma/client`) | Type-safe persistence and schema migrations |
| Validation | Custom / Zod schemas | Strict incoming payload and parameter validation |
| Authentication | JWT + bcrypt | Admin session tokens and password verification |
| Spatial Math | Pure TypeScript (Haversine) | Zero-cost spherical geodesy calculations |
| Error Handling | Custom `AppError` Hierarchy | Consistent `{ success, error, requestId }` envelopes |
| Testing | Jest + Supertest | Unit geodesy and end-to-end REST API verification |

### Frontend

| Layer | Technology | Purpose |
|---|---|---|
| UI Library | React 18 | Component-based interactive UI |
| Build Tool | Vite | Sub-second HMR and optimized production bundles |
| Styling | Tailwind CSS | Utility-first responsive design system |
| Palette | Indore Artisanal | Terracotta (`#9d3e1c`), Sage (`#3d6659`), Cream (`#f5fbf3`) |
| Mapping Engine | Leaflet (`leaflet`, `react-leaflet`) | Zero-cost OpenStreetMap interactive cartography |
| Clustering | `leaflet.markercluster` | High-density pin clustering and street spiderfying |
| Heatmap | `leaflet.heat` | Visual density rendering for vendor concentrations |
| Icons | Lucide React | Clean, accessible iconography |
| Routing / Nav | Native Universal URLs | Direct device deep-linking to Google Maps & phone dialer |

---

## 3. Backend Architecture & Layer Boundaries

### Layer Flow

```text
routes -> controller -> lib/service -> Prisma Client -> Neon PostgreSQL
```

### Layer Responsibilities

| Layer | Responsibility | May Depend On | Must NOT Do |
|---|---|---|---|
| **Routes** (`api.routes.ts`) | Wire HTTP verbs and paths, apply authentication and validation middleware | Controllers, Middlewares | Contain SQL queries, calculate spatial distances, parse DB records |
| **Middlewares** (`middlewares/`) | Authentication check, input validation, request-id normalization | JWT library, Shared utils | Execute business logic, format final domain responses |
| **Controllers** (`controllers/`) | Extract params, orchestrate queries, apply pagination, format responses | Prisma Client, Lib services, Shared errors | Contain direct raw SQL queries without Prisma |
| **Domain / Lib** (`lib/`) | Pure domain logic: Haversine geodesy, bounding boxes, JWT helpers | Pure math, Standard Node crypto | Access HTTP request/response objects, touch DB directly |
| **Data Layer** (`prisma/`) | Schema definitions, migrations, relational queries | Prisma Client | Format HTTP responses, execute external network requests |

---

## 4. Zero-Cost Spatial Architecture

GaliGuide eliminates Google Maps Platform API billing through three architectural decisions:

1. **Client-Side OpenStreetMap Rendering:**  
   The interactive map renders raster tiles directly from the OpenStreetMap Foundation (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) using Leaflet. No API keys or credit cards are required.
2. **Server-Side Mathematical Geodesy:**  
   Proximity filtering uses spherical geodesy via the Haversine formula (`server/src/lib/haversine.ts`):
   $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
   Candidates are pre-filtered using bounding-box latitude/longitude deltas before calculating exact surface distances.
3. **External Universal Navigation Handoff:**  
   Turn-by-turn routing is delegated to the user's native device by launching:  
   `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`  
   This opens the native Google Maps app on Android/iOS or web browser for free.

---

## 5. Security, Error Handling, and Privacy

### Request ID Tracking
Every incoming request receives or normalizes an `x-request-id` header (via `server/src/shared/utils/request-id.ts`) attached to both the response headers and error envelopes.

### Standard Error Envelope
All error responses conform to:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Latitude must be between 22.650000 and 22.780000"
  },
  "requestId": "req_f8b1a3c4-e9a2-4a7b-8f12-0987654321ab"
}
```

### Sensitive Data Redaction
- Database connection strings with embedded passwords are automatically sanitized (`redactDatabaseUrl()`).
- Unconsented phone numbers are masked in public endpoints (`+91 98XXX-XX123`).

---

## 6. Testing & Quality Standards

- **Unit Tests:** All mathematical and utility helpers (`haversine.ts`, `request-id.ts`, `redaction.ts`, `app-error.ts`) must maintain 100% test coverage.
- **E2E / PAC Tests:** The Supertest test suite (`server/__tests__/e2e/api.e2e.test.ts`) must verify all 14 Prototype Acceptance Criteria before any commit is promoted.
