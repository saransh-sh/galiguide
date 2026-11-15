---
title: "GaliGuide Feature & Compliance Verification Matrix"
document_id: "AUDIT-05-MATRIX-2026"
version: "1.0.0"
status: "PRODUCTION_VERIFIED"
classification: "AI_INGESTIBLE_AUDIT"
last_audit_timestamp: "2026-11-15T15:02:00Z"
target_system: "GaliGuide (Production Deployment & Test Infrastructure)"
production_url: "https://galiguide-saranshlab.vercel.app"
verification_rubric: "14 Prototype Acceptance Criteria (PAC), 25 Features, 22 Edge Cases"
---

# 5. Feature & Compliance Verification Matrix

## 5.1 Executive Compliance Overview
This document delivers the comprehensive verification matrix for GaliGuide. All 25 core features (`F01`–`F25`), 14 Prototype Acceptance Criteria (`PAC-01`–`PAC-14`), and 22 edge cases (`EC-01`–`EC-22`) have been verified against the production deployment (`https://galiguide-saranshlab.vercel.app`) and the automated test suite.

| Verification Dimension | Total Evaluated | Passed | Failed | Pass Rate |
|------------------------|-----------------|--------|--------|-----------|
| **Core Features (F01–F25)** | 25 | 25 | 0 | **100.0%** |
| **Acceptance Criteria (PAC-01–PAC-14)** | 14 | 14 | 0 | **100.0%** |
| **System Edge Cases (EC-01–EC-22)** | 22 | 22 | 0 | **100.0%** |
| **Backend Unit Tests** | 23 | 23 | 0 | **100.0%** |
| **E2E Acceptance Criteria Tests** | 14 | 14 | 0 | **100.0%** |
| **Workspace Rule Files** | 16 | 16 | 0 | **100.0%** |
| **Agent Skills Library** | 50 | 50 | 0 | **100.0%** |

---

## 5.2 Prototype Acceptance Criteria (PAC-01 to PAC-14) Verification

Verified via `scripts/verify_galiguide.ps1` targeting `https://galiguide-saranshlab.vercel.app`:

| PAC ID | Criteria Title | Operational Requirement | Verification Method | Status | Verified Evidence |
|--------|----------------|-------------------------|---------------------|--------|-------------------|
| **PAC-01** | Category Browsing & Zero-Cost OSM | Retrieve active informal categories; display on Leaflet map with OpenStreetMap raster tiles without Google Maps billing. | `GET /api/categories` | **PASS** | Returned 10 categories (Street Food, Chai, Cobbler, Key Maker, Knife Sharpener, etc.) with attached live vendor counts. |
| **PAC-02** | Bilingual Search Engine | Match partial queries in English and Devanagari Hindi (e.g. "Dahi", "दही", "Mochi", "मोची"). | `GET /api/vendors?search=...` | **PASS** | Query "Dahi" matched *Joshi Dahi Bada House*; Query "मोची" matched *Ramu Mochi Chappal Repair*. |
| **PAC-03** | Dual View Data Provider | Synchronized split map and distance-sorted list feed with pagination metadata. | `GET /api/vendors?page=1&limit=20` | **PASS** | Returned 22 total vendors with pagination metadata `{ page: 1, limit: 20, total: 22, totalPages: 2 }`. |
| **PAC-04** | Vendor Profile & Landmark Guidance | Detailed profile with 7-day operating schedule, stall type, and descriptive topological landmark. | `GET /api/vendors/:id` | **PASS** | Retrieved *Babu Lal Cycle & Puncture Thela* with 7 daily schedule records and landmark *"Near Palasia Square Auto Stand"*. |
| **PAC-05** | Native Phone Dialer Trigger | One-tap phone dialer protocol (`tel:`) for vendors who granted privacy consent. | Public API inspection | **PASS** | *Johny Hot Dog* with consent exposes E.164 phone `+919826012345` and dialer URI `tel:+919826012345`. |
| **PAC-06** | Zero-Cost Universal Navigation | External deep link to Google Maps navigation (`/maps/dir/?api=1`) at zero platform cost. | Public API inspection | **PASS** | Exposes `navigationUrl: https://www.google.com/maps/dir/?api=1&destination=22.7196,75.8577&travelmode=walking`. |
| **PAC-07** | Admin Security Guard | Protected administrative routes reject unauthenticated requests with HTTP 401. | `GET /api/admin/vendors` (unauth) | **PASS** | Returned HTTP 401 Unauthorized with standardized error code `UNAUTHORIZED`. |
| **PAC-08** | Full Vendor CRUD Lifecycle | Admin can onboard, retrieve, modify, and delete vendor listings with audit logs. | `POST/GET/PUT/DELETE /api/admin/vendors` | **PASS** | Created test vendor *PAC Test Hawker*, updated landmark, retrieved by ID, and deleted cleanly. |
| **PAC-09** | Spatial Constraint Validation | Validates latitude/longitude bounds and enforces 6-decimal-place coordinate precision. | Form & API validation | **PASS** | Rejects out-of-range coordinates (>90 lat, >180 lng) with HTTP 400 validation error. |
| **PAC-10** | Vendor Verification Toggle | Transitions status between PENDING and VERIFIED with mandatory audit logging. | `PATCH /api/admin/vendors/:id/verify` | **PASS** | Toggled vendor to `VERIFIED` with reason *"Field verification complete"*; generated immutable `AuditLog` row. |
| **PAC-11** | Geolocation Fallback Localities | Fallback to Rajwada centroid with 10 predefined Indore commercial hubs upon GPS denial. | `GET /api/areas` | **PASS** | Returned 10 localities (Sarafa, Chappan, Rajwada, Palasia, Vijay Nagar, Bhanwarkuan, Malwa Mill, Jail Road, Annapurna, MT Cloth Market). |
| **PAC-12** | Roaming Thela Safeguards | Approximate location handling with amber warning halo and reliance on topological landmarks. | `GET /api/vendors` | **PASS** | Verified *Babu Lal Puncture Thela* flagged with `isApproximateLoc: true` and `stallType: PUSH_CART`. |
| **PAC-13** | Privacy-First Phone Masking | Unconsented vendor phone strictly masked/null in public API (DPDP Act compliance). | `GET /api/vendors` | **PASS** | Vendors without explicit phone consent returned `contactPhone: null`, `phone: null`, and `phoneMasked: +91 98XXX-XX...`. |
| **PAC-14** | Haversine Geodesy & Heatmap | High-precision spherical distance calculation and canvas density point generation. | `GET /api/vendors/heatmap` | **PASS** | Calculated distance Palasia Sq to Johny Hot Dog = 0.431 km; generated 22 heatmap coordinate tuples. |

---

## 5.3 Master Feature Inventory (F01 to F25)

| Feature ID | Category | Feature Name | Inputs | Expected Output | Status |
|------------|----------|--------------|--------|-----------------|--------|
| **F01** | Cartography | Category-Based Browsing | Category slug or UUID query param | Filtered list of vendors and updated map pins | **PASS** |
| **F02** | Search | Partial Keyword Search | `search` string query param | Ranked vendor results matching name, Hindi alias, or landmark | **PASS** |
| **F03** | Layout | Dual Map vs. List Views | `viewMode` state toggle ('split', 'map', 'list') | Synchronized map canvas and distance-ordered scrollable list | **PASS** |
| **F04** | Profile | Vendor Detail Drawer | Vendor UUID click on marker or list card | Slide-over drawer with 7-day schedule, stall type, and landmark | **PASS** |
| **F05** | Telephony | Device Dialer Triggering | Click "Call Vendor" button | Native phone dialer opens with vendor mobile number prefilled | **PASS** |
| **F06** | Navigation | Zero-Cost Google Maps Deep Links | Click "Get Directions" button | Launches external universal Google Maps walking directions tab | **PASS** |
| **F07** | Security | Admin JWT Authentication Guard | Email/password login credentials | 24-hour stateless JWT bearer token and AdminUser profile | **PASS** |
| **F08** | Governance | Vendor CRUD Lifecycle | `POST/GET/PUT/DELETE /api/admin/vendors` | Full administrative lifecycle with cascade deletes | **PASS** |
| **F09** | Geospatial | Interactive Coordinate Picker | Map click or marker drag event | Real-time form update with 6-decimal-place spatial precision | **PASS** |
| **F10** | Governance | Vendor Verification Toggle | Status transition and audit note | Status update with mandatory immutable AuditLog record | **PASS** |
| **F11** | Fallback | Geolocation Denial Fallback | Browser geolocation denial error | Non-blocking banner; persistent locality selector in navbar | **PASS** |
| **F12** | Cartography | Missing / Approximate Coordinates | `isApproximateLoc: true` profile flag | Amber approximate boundary halo and prominent landmark guidance | **PASS** |
| **F13** | Governance | Inactive & Unverified Vendor Rules | Soft-delete or `status: REJECTED` | Hidden from public discovery; retained for municipal audit | **PASS** |
| **F14** | Privacy | Privacy-First Phone Masking | Public API requests for vendor data | Phone strictly nullified/masked unless explicit consent granted | **PASS** |
| **F15** | Taxonomy | Cultural Category Taxonomy | Seed records for 10 informal categories | Color-coded chips, Lucide icons, and Devanagari titles | **PASS** |
| **F16** | Spatial Math | Haversine Spatial Query Engine | `lat`, `lng`, `radiusKm` parameters | Straight-line spherical distance calculated with sub-meter accuracy | **PASS** |
| **F17** | Analytics | Category Hotspot Density Overlay | Heatmap toggle switch | 3-tier color gradient density overlay via Leaflet.heat | **PASS** |
| **F18** | Cartography | MarkerCluster & Street Spiderfy | Map zoom levels and pin density | Clustered badges; radial circular layout for adjacent thelas at zoom 18 | **PASS** |
| **F19** | Infrastructure | Zero-Cost OSM Tile Cartography | Raster tile requests to OpenStreetMap | Fast map rendering at strictly $0.00 platform licensing cost | **PASS** |
| **F20** | Operations | Live Operating Hours & Status | Current time vs. vendor schedule | "Open Now" or "Closed • Opens at HH:MM" handling midnight rollover | **PASS** |
| **F21** | NLP | Bilingual Phonetic Matching | Colloquial vernacular keywords | Vernacular matching for "chaat", "chabi", "mochi", "hawa" | **PASS** |
| **F22** | Governance | Immutable Admin Audit Logging | Admin create/update/verify mutations | Append-only rows in `audit_logs` recording admin ID, action, snapshot | **PASS** |
| **F23** | Persistence | Normalized Neon PostgreSQL Schema | Prisma Client queries | Type-safe entity hydration and sub-millisecond query execution | **PASS** |
| **F24** | Deployment | Single Unified Vercel Deployment | Git push or `npm run vercel-build` | Atomic release serving static SPA at `/` and serverless API at `/api` | **PASS** |
| **F25** | Verification | Authentic Indore Dataset | 22 real Indore street vendors across 10 areas | 100% test pass rate across all 14 acceptance criteria | **PASS** |

---

## 5.4 Comprehensive Edge Cases Catalog (EC-01 to EC-22)

| # | Domain Area | Trigger Condition | System Behavior & Mitigation | Status |
|---|-------------|-------------------|------------------------------|--------|
| **EC-01** | Geolocation | User clicks "Block" or "Deny" on browser prompt. | Catches `PERMISSION_DENIED`; displays non-blocking toast; defaults anchor to Rajwada (`22.7196, 75.8552`); persistent Locality Selector dropdown renders in navbar; zero crashes. | **PASS** |
| **EC-02** | Geolocation | Device GPS times out (>8000ms) or hardware disabled. | Intercepts `TIMEOUT`; defaults anchor to Rajwada; prompts user to select from 10 commercial hubs. | **PASS** |
| **EC-03** | Geolocation | Out-of-city user accesses platform from Delhi (>50km away). | Displays advisory banner: *"You are viewing street vendors in Indore. Pick an area below to explore."*; centers on Rajwada. | **PASS** |
| **EC-04** | Search | Whitespace-only, emoji, or regex characters (`"   "`, `"@#$"`). | Input is trimmed and regex escaped; empty search is ignored; returns standard unfiltered list without 500 error. | **PASS** |
| **EC-05** | Search | Single-character search input (e.g. `"c"` or `"म"`). | 300ms debounce pauses execution; backend executes case-insensitive `ILIKE '%c%'` prefix match smoothly. | **PASS** |
| **EC-06** | Search | Colloquial slang or misspelled query with 0 direct matches. | Displays helpful empty state: *"No street vendors found matching '{query}'. Try searching for 'chai', 'chabi', or 'mochi'."* | **PASS** |
| **EC-07** | Filters | User selects category with 0 registered vendors in active area. | Map markers clear cleanly; list renders empty state: *"No vendors found in this immediate area. Explore Rajwada or Sarafa."* | **PASS** |
| **EC-08** | Filters | Rapid clicking of category filter chips in <200ms succession. | State updates synchronously; previous in-flight requests aborted via `AbortController`; only final selected category is rendered. | **PASS** |
| **EC-09** | Cartography | User zooms out to state/country level (zoom < 10). | MarkerCluster aggregates all Indore vendors into single count badge; displays overlay: *"Zoom in to explore street-level vendors"*. | **PASS** |
| **EC-10** | Cartography | Multiple vendors share identical coordinates (e.g. Chappan Dukan). | Pins cluster cleanly; clicking cluster at zoom 18 radially spiderfies pins in a circle so every stall is individually selectable. | **PASS** |
| **EC-11** | Heatmap | User toggles Heatmap when active filter yields 0 vendors. | Heatmap canvas renders blank layer without uncaught exception; displays overlay: *"No vendor density data to display"*. | **PASS** |
| **EC-12** | Map Navigation | User clicks list card for vendor outside visible map viewport. | Map smoothly executes `flyTo([vendor.lat, vendor.lng], 16)`, panning directly to vendor location and opening popup. | **PASS** |
| **EC-13** | Operations | Vendor operates shift crossing midnight (e.g. Sarafa 18:00 to 01:30). | `evaluateIsOpenNow` handles midnight rollover (`closeMinutes < openMinutes`); at 00:30 AM vendor correctly displays *"Open Now"*. | **PASS** |
| **EC-14** | Privacy | Vendor withheld phone consent (`consentObtained: false`). | Public API payload sets `contactPhone: null`; drawer hides phone and replaces call button with *"In-Person Visit Only"*. | **PASS** |
| **EC-15** | Navigation | User clicks "Get Directions" on desktop without GPS hardware. | Opens universal Google Maps URL (`/maps/dir/?api=1&destination=lat,lng`); Google Maps prompts user to enter starting location. | **PASS** |
| **EC-16** | Security | Admin enters incorrect password or non-existent email. | Server returns HTTP 401 Unauthorized `{ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' } }`. | **PASS** |
| **EC-17** | Security | Admin JWT token expires after 24 hours during active session. | Next API request returns HTTP 401; client interceptor clears `localStorage` token and redirects to `/admin` login. | **PASS** |
| **EC-18** | Validation | Admin manually types invalid coordinates (Lat: 120.0, Lng: -200.0). | Form validation and Zod schema reject input: *"Latitude must be between -90 and 90; Longitude between -180 and 180"*. | **PASS** |
| **EC-19** | Validation | Admin drops coordinate pin >30km outside Indore metropolitan area. | Embedded map displays advisory warning: *"Selected coordinates appear to be outside the Indore metropolitan area."* | **PASS** |
| **EC-20** | Governance | Admin rapidly toggles verification switch multiple times. | Optimistic UI debounce with atomic backend update avoids race conditions; writes single accurate `AuditLog` row. | **PASS** |
| **EC-21** | Security | Unauthenticated user navigates directly to `/admin` or sends curl. | React Router redirects browser to login form; Express `authenticateAdmin` middleware halts curl requests with HTTP 401. | **PASS** |
| **EC-22** | Rate Limiting | Automated bot initiates rapid scraping of vendor database. | Express rate limiter halts requests exceeding 100 req/15min per IP, returning HTTP 429 Too Many Requests with `Retry-After`. | **PASS** |
