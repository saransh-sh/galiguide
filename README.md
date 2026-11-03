# GaliGuide 🧭
**Hyperlocal Informal Vendor Discovery & Navigation System (Indore Pilot)**

[![Project Status: Production-Ready Specification](https://img.shields.io/badge/Status-Specification%20Complete-emerald.svg)](docs/PRODUCTION_SPECIFICATION.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack: React 18 + Vite](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg)](https://react.dev/)
[![Backend: Node.js + Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg)](https://nodejs.org/)
[![Database: PostgreSQL + Prisma](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-2D3748.svg)](https://www.prisma.io/)
[![Mapping: Leaflet + OSM](https://img.shields.io/badge/Maps-Leaflet%20%2B%20OpenStreetMap-199900.svg)](https://leafletjs.com/)

---

## 📖 Executive Summary & Mission

In urban India, the informal street economy forms the lifeblood of daily municipal commerce. In Indore—celebrated as India's cleanest city and a culinary and commercial capital of Central India—tens of thousands of micro-entrepreneurs operate daily on sidewalks, alleyway corners (*galis*), street intersections (*chourahas*), and mobile pushcarts (*thelas*).

These micro-enterprises provide indispensable community services:
- **Culinary Heritage Artisans:** Morning poha-jalebi, usal poha, midnight chaat artisans at Sarafa Bazaar, and snack stalls at Chappan Dukan.
- **Everyday Utility & Repair Trades:** Footpath cobblers (*mochis*), duplicate key makers (*chabiwale*), mobile knife sharpeners (*dharwale*), roadside tailors and darners (*darzis/raffu*), and cycle puncture mechanics.
- **Fresh Perishables & Crafts:** Seasonal fruit and vegetable pushcarts (*fal-sabzi thelas*), temple flower and garland stalls (*phool-mala*), and terracotta clay pottery artisans (*kumhars*).

Despite their vital utility, these micro-enterprises are **digitally invisible** on commercial map platforms (Google Maps, Zomato, Swiggy) that cater exclusively to registered brick-and-mortar storefronts with formal postal addresses, GSTIN numbers, and marketing budgets.

**GaliGuide** is an open-source, zero-commission, lightweight hyperlocal discovery and navigation platform designed to bridge this divide. It provides citizens with immediate GPS-based discovery, bilingual search, topological landmark directions, and one-tap calling and navigation, while giving municipal administrators a geospatial portal for vendor onboarding, coordinate mapping, and community verification.

---

## 💡 The Zero-Cost Geospatial Architecture

Commercial mapping APIs (such as Google Maps JavaScript API, Places API, and Directions API) impose steep pay-per-request pricing models ($5–$30 per 1,000 requests) that make civic and public-interest mapping financially unsustainable.

GaliGuide eliminates external mapping API licensing costs through a four-part zero-cost architecture:
1. **OpenStreetMap Basemaps:** Uses free OpenStreetMap raster tiles rendered via Leaflet.js with round-robin subdomains at **$0.00 infrastructure cost**.
2. **Client-Side Spatial Processing:** Spatial clustering (`leaflet.markercluster`) and density heatmap rendering (`leaflet.heat`) execute entirely on the client's GPU and Canvas thread.
3. **Turn-by-Turn Navigation Delegation:** Pedestrian and vehicle turn-by-turn routing is offloaded via universal external deep links:
   ```
   https://www.google.com/maps/dir/?api=1&destination={latitude},{longitude}
   ```
   This launches the user's native Google Maps mobile application or desktop web client with pre-filled destination coordinates at **$0.00 API expenditure**.
4. **Native Telephony:** Telephone communication utilizes standard `tel:` URI links (`tel:+91XXXXXXXXXX`), triggering the device's native dialer directly with zero commercial voice-proxy middleware.

---

## 🏛️ System Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GALIGUIDE 3-TIER ARCHITECTURE                   │
├────────────────────────────────────────────────────────────────────────┤
│ Client Tier (React 18 + Vite + Tailwind CSS)                           │
│ - Leaflet.js interactive map canvas with OpenStreetMap raster tiles   │
│ - Leaflet.markercluster with dynamic CSS badges & zoom-18 spiderfy     │
│ - Leaflet.heat 5-tier density heatmap layer overlay                    │
│ - Custom SVG category pins with verification badge overlays            │
│ - Responsive synchronized dual view (Desktop Split / Mobile Drawer)    │
│ - useGeolocation hook with graceful denial fallback to Indore areas   │
├────────────────────────────────────────────────────────────────────────┤
│ Application Tier (Node.js 20 LTS + Express 4.19 + TypeScript)          │
│ - Stateless RESTful API with uniform JSON envelopes                    │
│ - JWT authentication with bcrypt password hashing (cost factor 12)     │
│ - Role-Based Access Control (RBAC: ADMIN vs SUPER_ADMIN)               │
│ - Zod runtime request validation on query, params, and body            │
│ - Helmet Content Security Policy explicitly whitelisting OSM tiles     │
│ - Anti-scraping rate limiting (100 requests per 15-minute window)      │
├────────────────────────────────────────────────────────────────────────┤
│ Data Tier (PostgreSQL 15+ & Prisma ORM 5.19)                           │
│ - Normalized schema: AdminUser, Category, Area, Vendor,                │
│   OperatingHour, AuditLog                                              │
│ - IEEE 754 64-bit Double Precision coordinates (sub-meter resolution)  │
│ - Composite B-Tree indexes: [latitude, longitude] & [status, categoryId│
│ - Two-tier spatial engine: BBox pre-filter + Clamped Haversine SQL     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v20.x LTS or higher
- **npm**: v10.x or higher
- **PostgreSQL**: v15.x or higher
- **Git**
- Optional: `curl` and `jq` for command-line verification scripts

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-org/galiguide.git
cd galiguide

# Install root, client, and server dependencies via npm workspaces
npm install
```

### 2. Environment Configuration
Create environment files from the provided templates:

```bash
# Root environment configuration
cp .env.example .env

# Server environment configuration
cp .env.example server/.env
```

Ensure `server/.env` points to your PostgreSQL instance:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/galiguide?schema=public"
PORT=5000
NODE_ENV="development"
CLIENT_ORIGIN="http://localhost:5173"
JWT_SECRET="galiguide_indore_super_secure_jwt_secret_key_2026_production"
JWT_EXPIRES_IN="24h"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Migration & Seeding
Deploy the PostgreSQL schema and populate the authentic 22-vendor Indore demonstration dataset:

```bash
# Run database migrations
npm run db:migrate

# Seed administrative accounts, categories, Indore areas, and 22 vendors
npm run db:seed
```

### 4. Launch Development Servers
Run client and server concurrently:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

### 5. Administrative Credentials (Pre-Seeded)
- **Super Administrator:**
  - **Email:** `admin@galiguide.in`
  - **Password:** `GaliGuide@Indore2026`
  - **Portal:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Field Verifier:**
  - **Email:** `verifier@galiguide.in`
  - **Password:** `IndoreVerifier#2026`

---

## 🧪 Comprehensive Testing Guide

GaliGuide features an exhaustive testing harness conforming to an **Opaque-Box Testing Methodology** (testing real observable behaviors without artificial facades or hardcoded stubs).

### 1. Zero-Dependency Automated CLI Verification Scripts
Run the automated 14-point Prototype Acceptance Criteria regression suite against a running server:

```bash
# On Linux, macOS, or Git Bash:
bash scripts/verify_galiguide.sh

# On Windows PowerShell:
powershell -ExecutionPolicy Bypass -File scripts/verify_galiguide.ps1
```

Both scripts test all 14 criteria (`TC-01` through `TC-14`), reporting real HTTP response codes, JSON payload integrity, and outputting green `[PASS]` tags upon successful execution.

### 2. Backend REST API & Spatial Integration Tests (Jest + Supertest)
```bash
# Run full backend integration test suite
npm run test:e2e --workspace=server

# Run with verbose logging
cd server && npx jest __tests__/e2e/api.e2e.test.ts --verbose --runInBand
```

### 3. Frontend & Geospatial Browser E2E Tests (Playwright)
```bash
# Run Playwright headless browser tests across Desktop and Mobile viewports
cd client && npx playwright test

# Run tests in headed mode with visible browser canvas
cd client && npx playwright test --headed

# Run single real-world Indore scenario (e.g. Sarafa Night Market)
cd client && npx playwright test e2e/galiguide.spec.ts -g "Sarafa"
```

---

## 📂 Repository Navigation & Directory Inventory

```
galiguide/
├── package.json                         # Root workspace manifest & orchestrator scripts
├── .gitignore                           # Git ignore rules for node_modules, dist, .env
├── .env.example                         # Master environment template
├── README.md                            # This comprehensive onboarding & operational runbook
├── TEST_INFRA.md                        # Master E2E testing infrastructure specification
├── TEST_READY.md                        # E2E test execution readiness checklist
│
├── docs/                                # Authoritative Architecture & Planning Specs
│   ├── PRODUCTION_SPECIFICATION.md      # Master Unified Production Specification
│   ├── PRD.md                           # Product Requirements Document (FR-01..12, EC-01..22)
│   ├── TECHNICAL_DESIGN.md              # Technical Design, Relational Schema & API Contracts
│   ├── IMPLEMENTATION_ROADMAP.md        # 7-Phase Engineering Implementation Roadmap
│   └── VERIFICATION_RUBRIC.md           # 14-Point Acceptance Criteria Test Rubric
│
├── scripts/                             # Zero-Dependency Verification & Deployment Tools
│   ├── verify_galiguide.sh              # POSIX Bash 14-PAC automated regression test script
│   └── verify_galiguide.ps1             # Windows PowerShell 14-PAC automated regression script
│
├── client/                              # Frontend Client SPA (React 18 + Vite + Tailwind CSS)
│   ├── package.json                     # Client dependency manifest
│   ├── vite.config.ts                   # Vite bundler configuration & proxy routing
│   ├── tsconfig.json                    # Client TypeScript compiler options
│   ├── tailwind.config.js               # Tailwind custom theme (Malwa color palette)
│   ├── index.html                       # HTML5 entry shell with Leaflet stylesheet links
│   ├── e2e/                             # Playwright Browser E2E Test Suite
│   └── src/
│       ├── main.tsx                     # React client bootstrap
│       ├── App.tsx                      # Root layout, router & context providers
│       ├── components/                  # map/, vendor/, admin/, common/
│       ├── hooks/                       # useGeolocation, useVendors, useAdminAuth
│       └── utils/                       # haversine, navigation, formatters
│
└── server/                              # Backend REST API Service (Node.js + Express + Prisma)
    ├── package.json                     # Server dependency manifest
    ├── tsconfig.json                    # Server TypeScript compiler configuration
    ├── server.ts                        # HTTP server listener and graceful shutdown
    ├── prisma/                          # Database Modeling & Migration Tools
    │   ├── schema.prisma                # Normalized PostgreSQL models, relations & enums
    │   └── seed.ts                      # 22 Indore vendor authentic dataset seeder script
    ├── __tests__/                       # Automated Server Test Suite (Supertest/Jest)
    └── src/
        ├── app.ts                       # Express application pipeline & middleware assembly
        ├── controllers/                 # vendor, category, area, auth controllers
        ├── middleware/                  # auth, validate, rateLimiter, errorHandler
        ├── routes/                      # Public & administrative route definitions
        └── services/                    # spatialService, auditService
```

---

## 🗺️ Documentation Roadmap

GaliGuide is backed by an exhaustive suite of architectural, technical, and quality documentation located in `docs/` and the repository root:

| Document | File Path | Scope & Purpose |
|---|---|---|
| **Master Production Specification** | [`docs/PRODUCTION_SPECIFICATION.md`](docs/PRODUCTION_SPECIFICATION.md) | Single authoritative master document synthesizing all 9 functional and technical dimensions. |
| **Product Requirements Document (PRD)** | [`docs/PRD.md`](docs/PRD.md) | Functional requirements (`FR-01` to `FR-12`), user flows, 22 edge cases (`EC-01` to `EC-22`), and informal vendor safeguards. |
| **Technical Design & API Specs** | [`docs/TECHNICAL_DESIGN.md`](docs/TECHNICAL_DESIGN.md) | Normalized Prisma schema, raw SQL Haversine query engine, 14 REST endpoint contracts, and Leaflet architecture. |
| **Implementation Roadmap** | [`docs/IMPLEMENTATION_ROADMAP.md`](docs/IMPLEMENTATION_ROADMAP.md) | 7-phase execution roadmap, monorepo setup, package manifests, and engineering transition gates. |
| **Verification Test Rubric** | [`docs/VERIFICATION_RUBRIC.md`](docs/VERIFICATION_RUBRIC.md) | 14-point acceptance criteria matrix (`PAC-01` to `PAC-14` / `TC-01` to `TC-14`) with cURL and Playwright snippets. |
| **E2E Testing Infrastructure** | [`TEST_INFRA.md`](TEST_INFRA.md) | 4-tier testing specification (75+ happy path cases, 20 boundary cases, composite workflows, real-world Indore trails). |
| **Test Readiness Declaration** | [`TEST_READY.md`](TEST_READY.md) | Readiness verification declaration and test execution quick reference. |

---

## 🎯 Key Features & Capabilities

### For Public Citizens & Visitors
- 📍 **Hyperlocal Geolocation:** Automatic GPS positioning with smooth centering on user location.
- 🏙️ **Graceful Fallback Locality Selector:** When location permissions are disabled or unavailable, defaults smoothly to central Indore (Rajwada) and enables one-tap navigation across 10 commercial areas (Sarafa, Chappan Dukan, Palasia, Vijay Nagar, Bhanwarkuan, etc.).
- 🔍 **Bilingual Partial Search:** 300 ms debounced search matching English trade names, Devanagari Hindi aliases (`hindiName`), categories, specialties, and landmarks.
- 🗺️ **Interactive Leaflet Mapping:** High-DPI category colored SVG pins, MarkerCluster grouping with density rings, and spiderfication at max zoom.
- 🌡️ **Hotspot Density Overlays:** Canvas-based 5-tier density heatmap visualizing street vendor concentrations across Indore.
- 📱 **Dual View Modes:** Responsive side-by-side split view on desktop and synchronized Map/List bottom toggle on mobile.
- 📋 **Rich Vendor Detail Drawer:** Displays operating schedules, live "Open Now" / "Closed" calculations (handling midnight-crossing night shifts), payment modes (Cash/UPI), and topological landmarks.
- 📞 **One-Tap Device Calling (`tel:`):** Native telephony dialer triggering with strict enforcement of vendor privacy consent.
- 🧭 **Zero-Cost Google Maps Navigation:** Turn-by-turn pedestrian and driving navigation via universal deep links with zero API billing.

### For Municipal Administrators & Field Officers
- 🔐 **Stateless JWT Authentication:** Secure login using bcrypt salt hashing (cost factor 12) and 24-hour HMAC-SHA256 bearer tokens.
- 📊 **Administrative Moderation Dashboard:** Paginated, filterable, and searchable vendor management table across all statuses (`PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`).
- 📍 **Interactive Map Coordinate Picker:** Embedded Leaflet map in vendor onboarding modal allowing click-to-pin, draggable marker positioning, and sub-meter coordinate synchronization.
- 🛡️ **Instant Verification Toggling:** Inline toggle to verify community-submitted vendors, automatically issuing an immutable `AuditLog` entry.
- 🔒 **Informal Vendor Privacy Safeguards:** Strict non-residential mapping policy and public masking of phone numbers when consent is withheld.

---

## 🛡️ Informal Vendor Ethics & Privacy Safeguards

Informal street vendors face unique socioeconomic vulnerabilities. GaliGuide enforces strict ethical data handling safeguards:
1. **Explicit Telephone Consent:** A vendor's phone number is exposed publicly **only** if explicit consent has been documented (`phoneConsentGiven === true`). When withheld, the public API returns `contactPhone: null`, and the UI displays *"In-Person Visit Only (No Public Phone)"*. Phone numbers are preserved only for authorized municipal verifiers in audit logs.
2. **Strict Non-Residential Mapping:** GaliGuide explicitly forbids the collection or mapping of residential home addresses. All coordinates represent public sidewalk, market, or cart vending spots.
3. **Rapid De-Listing Protocol:** Administrators can immediately deactivate (`isActive: false`) or delete a listing upon vendor request, removing it instantaneously from public search.
4. **Anti-Scraping Rate Limiting:** Public endpoints are protected by IP rate limiters (100 requests per 15 minutes) to prevent commercial data harvesting of informal micro-entrepreneurs.

---

## 👥 Seed Dataset Summary (Indore Pilot)

The demonstration database comes pre-seeded with 22 authentic micro-enterprises across 10 categories:
- **Sarafa Bazaar:** Vijay Chaat House, Joshi Dahi Bada, Nagori Shikanji, Sanwariya Seth Sabudana Khichdi.
- **Chappan Dukan:** Johny Hot Dog, Apna Sweets Tea Counter, Anand Paan Sadan.
- **Rajwada:** Mohan Chabiwala, Ramu Mochi, Lakhan Phool Bhandar.
- **Palasia:** Sharma Chai Corner, Shankar Shoe Repair Stall.
- **Vijay Nagar:** Ramesh Sabziwala, Babu Lal Puncture Thela.
- **Bhanwarkuan:** Gurukripa Student Chai Stall, Raju Cycle Repair.
- **Malwa Mill:** Ganesh Lock & Key Duplicators, Kailash Ganne Ka Ras.
- **Jail Road:** Munna Tailor & Alteration.
- **Annapurna:** Rajesh Phal Bhandar, Shyamu Matka & Mitti Ke Bartan.
- **MT Cloth Market:** Babu Dharwala (Knife Sharpener).

---

## 📄 License & Attribution

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

- **Map Data:** &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- **Iconography:** [Lucide Icons](https://lucide.dev/).
- **Mapping Framework:** [Leaflet.js](https://leafletjs.com/).

---
*Built with ❤️ for the street vendors and citizens of Indore.*
