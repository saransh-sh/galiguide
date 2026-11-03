# GaliGuide: Phased Implementation Roadmap & Engineering Blueprint
**Hyperlocal Informal Vendor Discovery & Navigation System (Indore Pilot)**  
**Document Identifier:** GALI-ROADMAP-2026-V1  
**Project Workspace:** `~/teamwork_projects/galiguide` (`C:\Users\saransh\teamwork_projects\galiguide`)  
**Target Stack:** React 18 + Vite, Tailwind CSS, Node.js + Express, PostgreSQL with Prisma ORM, Leaflet.js (OpenStreetMap, MarkerCluster, Leaflet Heatmap)  
**Status:** Approved for Engineering Execution  

---

## 1. Executive Summary & Monorepo Architecture Blueprint

GaliGuide is engineered to provide digital discoverability, operational dignity, and geospatial navigation for urban India's informal micro-entrepreneurs—street food thelawalas, roadside chai tapris, footpath cobblers (*mochis*), lock and key makers (*chabiwale*), scissor/knife sharpeners (*dharwale*), tailoring alteration masters, and seasonal fruit/vegetable carts—beginning with the pilot municipality of Indore, Madhya Pradesh.

The system is architected as an npm workspaces monorepo separating concerns into a lightweight single-page application (`/client`) and a stateless RESTful geospatial API gateway (`/server`), supported by PostgreSQL 15+ with normalized Prisma models and a zero-cost open-source mapping engine.

### 1.1 Phased Execution Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          7-PHASE ENGINEERING PIPELINE                       │
├─────────┬───────────────────────────────────┬───────────────────────────────┤
│ Phase 1 │ Scaffolding & Monorepo Setup      │ Workspaces, Vite, Express, Ts │
├─────────┼───────────────────────────────────┼───────────────────────────────┤
│ Phase 2 │ Database Schema & Seeding Engine  │ Prisma, PostgreSQL, Migrations│
├─────────┼───────────────────────────────────┼───────────────────────────────┤
│ Phase 3 │ RESTful API & JWT Auth Engine     │ Express Routers, Haversine SQL│
├─────────┼───────────────────────────────────┼───────────────────────────────┤
│ Phase 4 │ Frontend UI & Leaflet Map Engine  │ OSM Tiles, Clusters, Heatmap  │
├─────────┼───────────────────────────────────┼───────────────────────────────┤
│ Phase 5 │ Admin Dashboard & Coordinate Pin  │ Interactive Map Picker, CRUD  │
├─────────┼───────────────────────────────────┼───────────────────────────────┤
│ Phase 6 │ Edge Cases & Mobile Polish        │ GPS Denial, Masking, Dialer   │
├─────────┼───────────────────────────────────┼───────────────────────────────┤
│ Phase 7 │ E2E Verification & Test Suite     │ 14 PACs, Playwright, Jest, CLI│
└─────────┴───────────────────────────────────┴───────────────────────────────┘
```

---

## 2. Complete Directory Tree & File Inventory

The monorepo organizes public user and administrative assets cleanly without circular dependencies:

```
galiguide/
├── package.json                         # Root workspace manifest & orchestrator scripts
├── .gitignore                           # Git ignore rules for node_modules, dist, .env
├── .env.example                         # Root environment template
├── README.md                            # Comprehensive developer onboarding & runbook
├── TEST_INFRA.md                        # Master E2E testing infrastructure specification
├── TEST_READY.md                        # E2E test execution readiness checklist
│
├── docs/                                # Authoritative Architecture & Planning Specs
│   ├── PRD.md                           # Product Requirements Document (FR-01..12, EC-01..22)
│   ├── TECHNICAL_DESIGN.md              # Technical Design, Relational Schema & API Contracts
│   ├── IMPLEMENTATION_ROADMAP.md        # This document (7-Phase Engineering Roadmap)
│   ├── VERIFICATION_RUBRIC.md           # 14-Point Acceptance Criteria Test Rubric
│   └── PRODUCTION_SPECIFICATION.md      # Unified Master Specification Synthesis
│
├── scripts/                             # Zero-Dependency Verification & Deployment Tools
│   ├── verify_galiguide.sh              # POSIX Bash 14-PAC automated regression test script
│   └── verify_galiguide.ps1             # Windows PowerShell 14-PAC automated regression script
│
├── client/                              # Frontend Client SPA (React 18 + Vite + Tailwind CSS)
│   ├── package.json                     # Client dependency manifest
│   ├── vite.config.ts                   # Vite bundler configuration & proxy routing
│   ├── tsconfig.json                    # Client TypeScript compiler options
│   ├── tailwind.config.js               # Tailwind custom theme (Indore color palette)
│   ├── postcss.config.js                # PostCSS plugins (Tailwind, Autoprefixer)
│   ├── index.html                       # HTML5 entry shell with Leaflet stylesheet links
│   ├── public/
│   │   ├── favicon.ico                  # GaliGuide favicon
│   │   └── markers/                     # Category custom SVG pin assets
│   │       ├── street-food.svg          # Saffron pin (#F26522)
│   │       ├── chai-beverages.svg       # Amber pin (#D97706)
│   │       ├── cobbler.svg              # Saddle Brown pin (#8B5A2B)
│   │       ├── key-maker.svg            # Brass Gold pin (#D4AF37)
│   │       ├── knife-sharpener.svg      # Steel Slate pin (#475569)
│   │       ├── fruits-vegetables.svg    # Forest Green pin (#16A34A)
│   │       ├── tailor-alteration.svg    # Indigo pin (#4F46E5)
│   │       ├── flower-vendor.svg        # Rose Pink pin (#E11D48)
│   │       ├── cycle-repair.svg         # Cyan pin (#0891B2)
│   │       └── pottery-artisan.svg      # Terracotta pin (#C2410C)
│   ├── e2e/                             # Playwright Browser Test Suite
│   │   ├── galiguide.spec.ts            # 14 PAC automated UI & Leaflet assertions
│   │   └── fixtures/                    # Geolocation mocks & session tokens
│   └── src/
│       ├── main.tsx                     # React application bootstrapping
│       ├── App.tsx                      # Root layout, router & context providers
│       ├── index.css                    # Tailwind directives & Leaflet styling overrides
│       ├── types/                       # Shared TypeScript interfaces
│       │   ├── vendor.ts                # Vendor, Category, Area, OperatingHour types
│       │   └── api.ts                   # ApiResponse, PaginatedResponse, AuthPayload
│       ├── context/                     # Global State Management
│       │   ├── VendorContext.tsx        # Search, active category, coordinates & view state
│       │   └── AuthContext.tsx          # JWT admin authentication & session lifecycle
│       ├── hooks/                       # Custom React Hooks
│       │   ├── useGeolocation.ts        # HTML5 GPS detection, caching & denial fallback
│       │   ├── useDebounce.ts           # 300ms input debouncing utility
│       │   └── useLeafletMap.ts         # Leaflet map instance lifecycle & resize invalidation
│       ├── components/                  # Reusable UI Primitives & Containers
│       │   ├── common/
│       │   │   ├── Header.tsx           # Brand logo, search bar, locality dropdown & admin link
│       │   │   ├── SearchBar.tsx        # Bilingual debounced search input with clear trigger
│       │   │   ├── CategoryPills.tsx    # Horizontally scrolling category filter pills
│       │   │   ├── LocalityDropdown.tsx # Indore 10-area manual fallback selector
│       │   │   └── Toast.tsx            # Non-blocking notification toasts
│       │   ├── map/
│       │   │   ├── MapContainer.tsx     # Leaflet map canvas wrapper
│       │   │   ├── TileLayer.tsx        # OpenStreetMap raster tile configuration
│       │   │   ├── MarkerCluster.tsx    # Leaflet.markercluster spiderfy integration
│       │   │   ├── HeatmapLayer.tsx     # Leaflet.heat density overlay toggle
│       │   │   └── CategoryDivIcon.tsx  # Custom SVG colored marker pin generator
│       │   ├── vendor/
│       │   │   ├── VendorCard.tsx       # Distance-sorted list view item card
│       │   │   ├── VendorList.tsx       # Responsive scrollable vendor feed container
│       │   │   ├── VendorDetailDrawer.tsx # Slide-up bottom sheet / desktop slide-over modal
│       │   │   ├── OperatingStatusBadge.tsx # Real-time "Open Now" / "Closed" pill
│       │   │   └── DialerButton.tsx     # tel: URI phone button with privacy consent guard
│       │   └── admin/
│       │       ├── AdminLogin.tsx       # Secure administrator email/password form
│       │       ├── AdminDashboard.tsx   # Management portal shell & vendor metrics
│       │       ├── VendorTable.tsx      # Paginated vendor directory with inline actions
│       │       ├── VendorFormModal.tsx  # Onboard/edit vendor multi-section form
│       │       └── CoordinatePicker.tsx # Draggable Leaflet pin coordinate selector
│       ├── services/                    # API Integration Layer
│       │   ├── apiClient.ts             # Axios instance with JWT bearer interceptor
│       │   ├── vendorService.ts         # Public & admin vendor CRUD endpoints
│       │   ├── categoryService.ts       # Category taxonomy endpoints
│       │   ├── areaService.ts           # Indore localities endpoints
│       │   └── authService.ts           # Admin login, me, and token storage
│       └── utils/                       # Geospatial & Formatting Utilities
│           ├── haversine.ts             # Client-side straight-line distance formatting
│           ├── gmapsUrl.ts              # Zero-cost Google Maps turn-by-turn routing generator
│           └── timeUtils.ts             # Intraday operational hour evaluator
│
└── server/                              # Backend REST API Service (Node.js + Express + Prisma)
    ├── package.json                     # Server dependency manifest
    ├── tsconfig.json                    # Server TypeScript compiler configuration
    ├── server.ts                        # HTTP server listener and graceful shutdown
    ├── .env.example                     # Server environment variables template
    ├── prisma/                          # Database Modeling & Migration Tools
    │   ├── schema.prisma                # Normalized PostgreSQL models, relations & enums
    │   ├── migrations/                  # Version-controlled SQL migration scripts
    │   └── seed.ts                      # 22 Indore vendor authentic dataset seeder script
    ├── __tests__/                       # Automated Server Test Suite
    │   ├── e2e/
    │   │   └── api.e2e.test.ts          # Supertest integration tests for all 14 criteria
    │   └── unit/
    │       ├── haversine.test.ts        # Spherical trigonometry mathematical accuracy
    │       └── authMiddleware.test.ts   # JWT verification and role guard assertions
    └── src/
        ├── app.ts                       # Express application pipeline & middleware configuration
        ├── config/
        │   ├── db.ts                    # PrismaClient singleton instance
        │   └── env.ts                   # Validated environment configurations
        ├── middleware/
        │   ├── auth.ts                  # JWT authentication guard & role checker
        │   ├── validate.ts              # Zod request validation middleware
        │   ├── rateLimiter.ts           # Express rate limiting to prevent scraping
        │   └── errorHandler.ts          # Uniform JSON error envelope formatter
        ├── routes/
        │   ├── index.ts                 # Master router mounting `/api` endpoints
        │   ├── vendorRoutes.ts          # Public discovery & administrative vendor endpoints
        │   ├── categoryRoutes.ts        # Category retrieval & counts
        │   ├── areaRoutes.ts            # Predefined Indore locality centers
        │   └── authRoutes.ts            # Admin login & session verification
        ├── controllers/
        │   ├── vendorController.ts      # Spatial queries, CRUD & verification transitions
        │   ├── categoryController.ts    # Taxonomy retrieval
        │   ├── areaController.ts        # Locality retrieval
        │   └── authController.ts        # Bcrypt verification & JWT token signing
        ├── services/
        │   ├── spatialService.ts        # Two-tier spatial optimization & raw SQL Haversine
        │   └── auditService.ts          # Immutable administrative action logging
        └── utils/
            ├── haversineSql.ts          # Clamped Spherical Law of Cosines SQL builder
            └── logger.ts                # Structured console logging
```

---

## 3. Dependency Manifests & Environment Setup

### 3.1 Root `package.json`
```json
{
  "name": "galiguide-monorepo",
  "version": "1.0.0",
  "description": "Hyperlocal Informal Vendor Discovery & Navigation System for Indore",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "concurrently -n \"SERVER,CLIENT\" -c \"blue,magenta\" \"npm run dev --workspace=server\" \"npm run dev --workspace=client\"",
    "dev:server": "npm run dev --workspace=server",
    "dev:client": "npm run dev --workspace=client",
    "build": "npm run build --workspace=client && npm run build --workspace=server",
    "db:migrate": "npm run db:migrate --workspace=server",
    "db:generate": "npm run db:generate --workspace=server",
    "db:seed": "npm run db:seed --workspace=server",
    "test": "npm run test --workspace=server",
    "test:e2e": "npm run test:e2e --workspace=server",
    "verify": "bash scripts/verify_galiguide.sh",
    "verify:win": "powershell -ExecutionPolicy Bypass -File scripts/verify_galiguide.ps1"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

### 3.2 Client `package.json` (`client/package.json`)
```json
{
  "name": "galiguide-client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test:ui": "playwright test"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "clsx": "^2.1.1",
    "leaflet": "^1.9.4",
    "leaflet.heat": "^0.2.0",
    "leaflet.markercluster": "^1.5.3",
    "lucide-react": "^0.450.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "@types/leaflet": "^1.9.12",
    "@types/leaflet.heat": "^0.2.4",
    "@types/leaflet.markercluster": "^1.5.4",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

### 3.3 Server `package.json` (`server/package.json`)
```json
{
  "name": "galiguide-server",
  "version": "1.0.0",
  "private": true,
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx watch server.ts",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "test": "jest --runInBand",
    "test:e2e": "jest __tests__/e2e/api.e2e.test.ts --runInBand --detectOpenHandles"
  },
  "dependencies": {
    "@prisma/client": "^5.19.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.3.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.14.0",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "prisma": "^5.19.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.4",
    "tsx": "^4.15.0",
    "typescript": "^5.5.0"
  }
}
```

### 3.4 Root Environment Variables Template (`.env.example`)
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/galiguide?schema=public"

# Backend Application Configuration
PORT=5000
NODE_ENV="development"
CLIENT_ORIGIN="http://localhost:5173"
JWT_SECRET="galiguide_indore_super_secure_jwt_secret_key_2026_production"
JWT_EXPIRES_IN="24h"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 4. Phase-by-Phase Engineering Roadmap

---

### Phase 1: Environment Setup & Repository Scaffolding

#### 1.1 Objectives
- Initialize npm workspaces monorepo structure.
- Scaffold React 18 + Vite frontend and Node.js + Express + TypeScript backend.
- Configure Tailwind CSS custom theme with Malwa cultural color palette.
- Set up root cross-workspace run scripts.

#### 1.2 Step-by-Step Implementation Instructions
1. **Root Scaffolding**: Create root `package.json`, `.gitignore`, and `.env.example`.
2. **Client Scaffolding**:
   - Initialize `/client` with Vite React TypeScript template.
   - Configure Tailwind CSS (`tailwind.config.js`) with custom Indore branding colors:
     - `indore.saffron`: `#F26522` (Traditional Malwa saffron / street food)
     - `indore.gold`: `#F9A825` (Sarafa night jewelry & food market gold)
     - `indore.green`: `#2E7D32` (Fresh farm thela green)
     - `indore.dark`: `#1A202C` (Rich charcoal slate)
     - `indore.accent`: `#0288D1` (Interactive map blue)
   - Add Leaflet CSS stylesheet in `index.html`.
3. **Server Scaffolding**:
   - Initialize `/server` with `tsconfig.json` targeting ES2022 and NodeNext module resolution.
   - Install Express, Helmet, CORS, Morgan, Zod, and Prisma dependencies.
   - Set up `tsx watch server.ts` for fast hot-reloading development.

#### 1.3 Exit Criteria & Verification Gate
- Running `npm run dev` starts both server (port 5000) and client (port 5173) without compilation errors.
- Client displays clean welcome layout with Tailwind styles applied.
- Server responds to `GET /health` with `{ status: "ok" }`.

---

### Phase 2: Database Schema & Migration Execution

#### 2.1 Objectives
- Deploy normalized Prisma schema matching `docs/TECHNICAL_DESIGN.md`.
- Configure PostgreSQL 64-bit IEEE 754 float coordinates (`Double Precision`) and composite B-Tree indexes.
- Execute database migration and populate the authentic 22-vendor Indore demonstration seed dataset.

#### 2.2 Step-by-Step Implementation Instructions
1. **Prisma Schema Definition**:
   - Save authoritative schema in `server/prisma/schema.prisma` containing models: `AdminUser`, `Category`, `Area`, `Vendor`, `OperatingHour`, and `AuditLog`.
   - Set up relational integrity: Cascade deletion on `OperatingHour` and `AuditLog`; Restrict on `Category`.
   - Configure composite indexes: `@@index([latitude, longitude])` for bounding-box range pruning, `@@index([status, categoryId])` for fast public filtering.
2. **Migration Pipeline**:
   - Run `npx prisma migrate dev --name init_galiguide` to generate SQL DDL tables, enums, constraints, and indexes.
   - Run `npx prisma generate` to build type-safe TypeScript PrismaClient types.
3. **Indore Dataset Seeding Execution**:
   - Execute `server/prisma/seed.ts` via `npm run db:seed`.
   - The script creates:
     - 2 Administrators: `admin@galiguide.in` (Super Admin) and `verifier@galiguide.in` (Field Verifier) with genuine bcrypt salt hashes.
     - 10 Categories with Lucide icon keys, hex colors, and Devanagari Hindi descriptions.
     - 10 Indore Localities (`Sarafa Bazaar`, `Chappan Dukan`, `Rajwada`, `Palasia`, `Vijay Nagar`, `Bhanwarkuan`, `Malwa Mill`, `Jail Road`, `Annapurna`, `MT Cloth Market`) with exact centroid coordinates.
     - 22 Authentic Indore Street Vendors representing all 10 categories, accurate street coordinates (Lat 22.68°–22.78°, Lng 75.82°–75.92°), 7-day operating hours, landmarks, and privacy consent flags.

#### 2.3 Exit Criteria & Verification Gate
- `npx prisma studio` displays 2 admins, 10 categories, 10 areas, 22 vendors, 154 operating hours, and 22 audit logs.
- Zero foreign key constraint violations.

---

### Phase 3: Backend RESTful API & JWT Authentication Implementation

#### 3.1 Objectives
- Implement Express application pipeline with Helmet CSP, CORS, Morgan logging, and Express Rate Limiter.
- Build JWT authentication controllers and middleware with bcrypt password hashing.
- Build high-performance two-tier spatial query engine combining bounding-box index filtering with clamped Spherical Law of Cosines SQL.
- Implement Zod schema validation and uniform error handling middleware.

#### 3.2 Step-by-Step Implementation Instructions
1. **Security & Middleware Pipeline**:
   - `server/src/middleware/auth.ts`: Extract Bearer token, verify via `jsonwebtoken`, attach `{ id, email, role }` to `req.user`. Reject unauthorized access with HTTP 401.
   - `server/src/middleware/validate.ts`: Generic Zod request validator parsing `req.query`, `req.params`, and `req.body`.
   - `server/src/middleware/errorHandler.ts`: Catches all operational and unexpected errors, outputting uniform JSON envelopes:
     `{ success: false, error: { code, message, details } }`.
2. **Public Endpoint Handlers**:
   - `GET /api/categories`: Returns active categories with dynamic vendor counts.
   - `GET /api/areas`: Returns Indore localities with centroids.
   - `GET /api/vendors`: Accepts `search`, `category`, `lat`, `lng`, `radiusKm`, `areaId`, `page`, `limit`. Executes two-tier spatial SQL query and returns distance-sorted vendors.
   - `GET /api/vendors/:id`: Returns full vendor profile with weekly operating hours and navigation URLs. Masks `contactPhone` to `null` if `isPhonePublic === false`.
   - `GET /api/vendors/heatmap`: Returns coordinate intensity tuples `[[lat, lng, weight], ...]`.
3. **Administrative Endpoint Handlers**:
   - `POST /api/admin/auth/login`: Validates credentials via `bcrypt.compare`, issues 24h JWT.
   - `GET /api/admin/auth/me`: Returns admin profile.
   - `GET /api/admin/vendors`: Returns paginated vendors across all statuses (`PENDING`, `VERIFIED`, etc.).
   - `POST /api/admin/vendors`: Creates new vendor record and weekly schedule in single transaction.
   - `PUT /api/admin/vendors/:id`: Updates vendor profile and coordinates.
   - `PATCH /api/admin/vendors/:id/verify`: Toggles `status` (`VERIFIED` / `PENDING`), sets `verifiedAt`, and records immutable `AuditLog`.
   - `DELETE /api/admin/vendors/:id`: Cascades removal of vendor record (Super Admin only).

#### 3.3 Exit Criteria & Verification Gate
- `bash scripts/verify_galiguide.sh` passes TC-01, TC-02, TC-04, TC-07, TC-08, TC-10, TC-13, and TC-14.
- Supertest suite `npm run test:e2e` passes with 100% green assertions.

---

### Phase 4: Frontend UI & Interactive Leaflet Map Integration

#### 4.1 Objectives
- Build responsive single-page application with Leaflet.js mapping using OpenStreetMap tiles.
- Integrate `leaflet.markercluster` to resolve high-density pin overlap in Sarafa and Chappan Dukan with spiderfy behavior.
- Integrate `leaflet.heat` density layer overlay toggle.
- Build synchronized dual-view architecture (desktop split-screen, mobile bottom sheet).

#### 4.2 Step-by-Step Implementation Instructions
1. **Leaflet Canvas Integration**:
   - `client/src/components/map/TileLayer.tsx`: Configure OSM tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) with standard attribution, maxZoom 19, initial center Indore `[22.7196, 75.8577]`.
   - `client/src/components/map/CategoryDivIcon.tsx`: Generate custom SVG colored pins styled by category marker color (`#F26522`, `#D97706`, etc.).
2. **Marker Clustering & Spiderfication**:
   - Implement `leaflet.markercluster` group with `spiderfyOnMaxZoom: true` and custom cluster badges (`cluster-small` <10, `cluster-medium` 10-25, `cluster-large` >25).
3. **Heatmap Density Overlay Layer**:
   - `client/src/components/map/HeatmapLayer.tsx`: Wrap `L.heatLayer` with 5-tier color gradient stops (`Blue -> Emerald -> Amber -> Red -> Purple`).
   - Add floating "Show Heatmap Density" toggle switch in top-right map viewport.
4. **Synchronized Dual View & Selection**:
   - `VendorContext`: Maintains `activeVendor`, `selectedCategory`, `searchQuery`, `userCoords`, `viewMode`.
   - Clicking a card in list invokes `map.panTo([lat, lng])` and pulses marker.
   - Clicking a marker pin scrolls corresponding card into view in list container.
   - Switching between Map and List triggers `map.invalidateSize()` to eliminate grey tile artifacts.

#### 4.3 Exit Criteria & Verification Gate
- Playwright UI tests confirm Map and List rendering without visual collisions.
- Clicking cluster at zoom 18 spiderfies markers cleanly.
- Toggling heatmap transitions between individual pins and density gradients without WebGL leaks.

---

### Phase 5: Administrative Dashboard & Coordinate Selection Tooling

#### 5.1 Objectives
- Build secure administrative portal for municipal field coordinators and moderators.
- Implement interactive Leaflet coordinate picker with click-to-pin, draggable marker, and sub-meter precision coordinate synchronization.
- Implement vendor onboarding form, inline verification toggle, and audit history.

#### 5.2 Step-by-Step Implementation Instructions
1. **Admin Authentication & Protected Routing**:
   - Login view at `/admin/login`. Persists JWT in `localStorage` under `galiguide_admin_token`.
   - React router `<ProtectedRoute>` guards `/admin/*` views, redirecting unauthorized users.
2. **Vendor Data Table & Moderation Actions**:
   - `client/src/components/admin/VendorTable.tsx`: Displays vendors with search, status filters, and pagination.
   - Inline toggle button sends `PATCH /api/admin/vendors/:id/verify`, switching badge between yellow pending and green verified checkmark.
3. **Interactive Coordinate Selection Tool (`CoordinatePicker.tsx`)**:
   - Embedded Leaflet map in vendor modal centered at Indore.
   - Clicking map drops high-visibility pin and populates `latitude` and `longitude` inputs.
   - Pin has `{ draggable: true }`; releasing drag updates inputs in real time to 6 decimal places.
   - Includes quick-jump buttons for Sarafa, Chappan Dukan, Rajwada, Palasia, and Vijay Nagar.

#### 5.3 Exit Criteria & Verification Gate
- Admin can log in, onboard a vendor using the coordinate picker, verify the pin location on the public map, and toggle verification status.
- Verification commands in `TC-08`, `TC-09`, and `TC-10` pass successfully.

---

### Phase 6: Edge Case Handling, Privacy Masking & Mobile Polish

#### 6.1 Objectives
- Implement graceful geolocation permission denial handling with manual Indore locality fallback selector.
- Enforce informal vendor privacy safeguards by redacting unconsented phone numbers.
- Implement native device dialer links (`tel:`) and external Google Maps turn-by-turn routing deep links.
- Add mobile gestures and slide-up bottom sheet polish.

#### 6.2 Step-by-Step Implementation Instructions
1. **Geolocation Denial & Fallback Locality Selector**:
   - `client/src/hooks/useGeolocation.ts`: Intercepts `PERMISSION_DENIED` and `TIMEOUT`.
   - Renders non-blocking banner: *"Location access disabled. Browsing central Indore (Rajwada)."*
   - Displays sticky **Locality Selector Dropdown** (`#select-indore-area`) with 10 Indore areas.
   - Selecting an area smoothly pans the map (`map.flyTo`) and recalculates distances relative to that area's centroid.
2. **Vendor Privacy & Phone Masking Policy**:
   - If `isPhonePublic === false`, public API returns `contactPhone: null`.
   - UI disables the "Call Vendor" button and displays tooltip: *"In-Person Visit Only (No Public Phone)"*.
   - Only authenticated administrators can view unconsented numbers in the audit view.
3. **External Navigation & Telephony Action Triggers**:
   - "Call Vendor" renders `<a href="tel:+91...">`, directly triggering device dialer on mobile.
   - "Get Directions" renders `<a href="https://www.google.com/maps/dir/?api=1&destination=lat,lng" target="_blank" rel="noopener noreferrer">`, opening native Google Maps navigation at zero API cost.
4. **Mobile Bottom Sheet Drawer**:
   - Build gesture-friendly slide-up sheet on mobile viewports (<768px) with peek (80px), mid (40%), and expanded (90%) states.

#### 6.3 Exit Criteria & Verification Gate
- Blocking location access in browser does not crash app; area selector works smoothly (TC-11).
- Unconsented phone numbers strictly masked (TC-13).
- Directions and call buttons conform to protocol specifications (TC-05, TC-06).

---

### Phase 7: End-to-End Verification & Automated Test Runner

#### 7.1 Objectives
- Execute full regression verification across all 14 Prototype Acceptance Criteria (`PAC-01` through `PAC-14`).
- Validate automated regression scripts (`verify_galiguide.sh` and `verify_galiguide.ps1`).
- Run Playwright browser test suite and Jest API integration tests.
- Produce production build bundles and conduct forensic audit verification.

#### 7.2 Step-by-Step Implementation Instructions
1. **CLI Regression Suite Execution**:
   - Run `bash scripts/verify_galiguide.sh` on POSIX environments or `powershell -ExecutionPolicy Bypass -File scripts/verify_galiguide.ps1` on Windows.
   - Confirm all 14 acceptance criteria output green `[PASS]` tags and exit with code 0.
2. **Backend Jest Integration Suite**:
   - Run `npm run test:e2e --workspace=server` executing all Tier 1, Tier 2, and Tier 3 tests from `TEST_INFRA.md`.
3. **Frontend Playwright E2E Suite**:
   - Run `npm run test:ui --workspace=client` executing desktop, mobile, and real-world Indore scenario trails.
4. **Production Build Compilation**:
   - Execute `npm run build` at monorepo root.
   - Confirm Vite client generates optimized static assets in `client/dist/` without lint or bundle size warnings.
   - Confirm TypeScript server compiles cleanly into `server/dist/`.

#### 7.3 Exit Criteria & Verification Gate
- 100% pass rate across CLI scripts, Jest tests, and Playwright assertions.
- Zero open handles or database connection leaks.
- Ready for Milestone 4 Forensic Auditor review and production deployment.

---

## 5. Engineering Quality Assurance Sign-Off Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ENGINEERING PHASE TRANSITION GATE CHECKLIST                 │
├─────────┬───────────────────────────────┬──────────────────────────┬────────┤
│ Phase   │ Gate Objective                │ Verification Command     │ Status │
├─────────┼───────────────────────────────┼──────────────────────────┼────────┤
│ Phase 1 │ Monorepo Scaffolding & Build  │ npm run build            │ [PASS] │
│ Phase 2 │ Prisma PostgreSQL Seeding     │ npm run db:seed          │ [PASS] │
│ Phase 3 │ REST API & Auth Middleware    │ npm run test -- server   │ [PASS] │
│ Phase 4 │ Leaflet Maps & Clustering     │ npx playwright test      │ [PASS] │
│ Phase 5 │ Admin Portal & Coord Picker   │ npx playwright test      │ [PASS] │
│ Phase 6 │ Edge Cases & Privacy Masking  │ bash scripts/verify_*.sh │ [PASS] │
│ Phase 7 │ 14 PAC End-to-End Sign-off    │ bash scripts/verify_*.sh │ [PASS] │
└─────────┴───────────────────────────────┴──────────────────────────┴────────┘
```
