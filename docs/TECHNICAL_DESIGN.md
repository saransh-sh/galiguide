# GaliGuide — Technical Architecture, Database Schema & API Specification

**Document Title**: GaliGuide Technical Architecture, Database Schema & API Specification  
**System Target**: Hyperlocal Informal Vendor Discovery & Navigation System (Indore Prototype)  
**File Location**: `docs/TECHNICAL_DESIGN.md`  
**Status**: Final / Production-Grade Architecture Specification  
**Version**: 1.0.0  
**Target Monorepo**: `~/teamwork_projects/galiguide` (`C:\Users\saransh\teamwork_projects\galiguide`)  

---

## 1. System Architecture & Component Topology

### 1.1 Architecture Pattern & Topological Interaction Model
GaliGuide is engineered as a decoupled client-server web application optimized for ultra-low latency spatial lookups, zero mapping API operational expenditure, and high-performance mobile browser consumption. It addresses the unique operational realities of informal street vendors in Indore, Madhya Pradesh—vendors who lack formal street numbers, commercial postal addresses, or standard Google Business profiles.

The system topology is split across three primary tiers:
1. **Client Tier (React + Vite SPA)**: Mobile-first single-page application with Leaflet mapping, MarkerCluster rendering, canvas-based heatmaps, and reactive state management.
2. **Application Tier (Node.js + Express API Gateway)**: Stateless REST API handling JWT authentication, Zod request validation, rate limiting, and geospatial query formulation.
3. **Data Tier (PostgreSQL + Prisma ORM)**: Relational storage engine with double-precision WGS84 coordinate indexes, composite filtering keys, and parameterized spherical distance calculations.

```
+---------------------------------------------------------------------------------------------------+
|                                     CLIENT APPLICATION TIER                                       |
|                                     (React 18 + Vite + Tailwind CSS)                              |
|                                                                                                   |
|   +--------------------------+  +--------------------------+  +-------------------------------+   |
|   |   Leaflet Map Engine     |  |   Responsive UI Layers   |  |     State & Geo Hooks         |   |
|   |  - OSM Raster Tile Layer |  |  - Split View (Desktop)  |  |  - useGeolocation (GPS/cache) |   |
|   |  - MarkerCluster Group   |  |  - Bottom Sheet (Mobile) |  |  - useVendors (spatial query) |   |
|   |  - Leaflet Heatmap Layer |  |  - Category Filter Chips |  |  - useCategories (taxonomy)   |   |
|   |  - SVG DivIcon Pins      |  |  - Debounced Search Bar  |  |  - useAdminAuth (JWT session) |   |
|   +--------------------------+  +--------------------------+  +-------------------------------+   |
+---------------------------------------------------------------------------------------------------+
                               |                                ^
                               | HTTPS / JSON                   | JSON Envelopes
                               | (Bearer Token / Query Params)  | (Vendors, Categories, Heatmap)
                               v                                |
+---------------------------------------------------------------------------------------------------+
|                                     APPLICATION SERVER TIER                                       |
|                                     (Node.js 20 LTS + Express 4.19)                               |
|                                                                                                   |
|   +-------------------------------------------------------------------------------------------+   |
|   |   Security & Network Perimeters: Helmet (OSM CSP), CORS, Express Rate Limiters            |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                              |                                                    |
|   +------------------------------------------v------------------------------------------------+   |
|   |   Middleware Pipeline:                                                                    |   |
|   |   - authenticateAdmin (JWT HS256 Verification & Claims Injection)                         |   |
|   |   - requireRole (RBAC: ADMIN vs SUPER_ADMIN)                                              |   |
|   |   - validateRequest (Zod Schema Validation for Params, Query, and Body)                   |   |
|   +------------------------------------------+------------------------------------------------+   |
|                                              |                                                    |
|   +------------------------------------------v------------------------------------------------+   |
|   |   Service & Business Logic:                                                               |   |
|   |   - Spatial Query Service (Bounding Box Pre-Filtering + Spherical Law of Cosines SQL)     |   |
|   |   - Vendor Service (CRUD, Status State Machine, Phone Privacy Masking)                    |   |
|   |   - Category Service (Taxonomy & Dynamic Count Aggregation)                               |   |
|   |   - Audit Service (Immutable Action Logging & Admin Fingerprinting)                       |   |
|   +-------------------------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------------------+
                               |                                ^
                               | Prisma Client &                | Hydrated Relational Models
                               | Raw Parameterized SQL          | & Tuple Record Sets
                               v                                |
+---------------------------------------------------------------------------------------------------+
|                                        DATA PERSISTENCE TIER                                      |
|                                      (PostgreSQL 15+ & Prisma ORM)                                |
|                                                                                                   |
|   +-------------------------------------------------------------------------------------------+   |
|   |   Relational Tables:                                                                      |   |
|   |   - admin_users     : Administrative accounts, hashed credentials, roles                  |   |
|   |   - categories      : Standardized informal vendor taxonomy, slugs, colors, icons         |   |
|   |   - areas           : Indore administrative localities, fallback centers & bounds         |   |
|   |   - vendors         : WGS84 coordinates, landmarks, status, privacy flags                |   |
|   |   - operating_hours : Day-specific schedules (24-hr HH:mm format)                         |   |
|   |   - audit_logs      : Immutable verification and modification history                     |   |
|   +-------------------------------------------------------------------------------------------+   |
|   |   Indexing Architecture:                                                                  |   |
|   |   - Composite B-Tree: [latitude, longitude] for rectangular envelope pruning              |   |
|   |   - Composite B-Tree: [status, categoryId] for public active vendor filtering             |   |
|   |   - Foreign Key Indexes: [areaId], [vendorId, dayOfWeek]                                  |   |
|   +-------------------------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------------------+
```

---

### 1.2 Technology Stack Justification & Version Matrix

| Tier | Component | Technology & Version | Selection Rationale |
|---|---|---|---|
| **Frontend Framework** | Web Client Core | React v18.3+ | Component-driven architecture, virtual DOM reconciliation, concurrent features for responsive map-list interactions. |
| **Frontend Bundler** | Build Tool | Vite v5.4+ | Lightning-fast Hot Module Replacement (HMR), optimized Rollup production builds, native ES module support. |
| **Styling** | Utility CSS | Tailwind CSS v3.4+ | Atomic CSS utility classes, zero runtime overhead, responsive layout primitives, custom hex badge support. |
| **Icons** | Iconography | Lucide React v0.450+ | Clean, consistent SVG icon set matching informal vendor trade categories (utensils, coffee, key, scissors, etc.). |
| **Mapping Engine** | Geospatial Client | Leaflet.js v1.9.4 | Lightweight (42KB gzipped), no external proprietary API keys, mature ecosystem, complete mobile touch support. |
| **Clustering** | Pin Aggregator | Leaflet.markercluster v1.5.3 | High-performance client-side spatial clustering; resolves dense bazaar pin overlap via animated spiderfying. |
| **Heatmap** | Hotspot Layer | Leaflet.heat v0.2.0 | Canvas-based density gradient renderer; visualizes high-density informal commercial hubs without DOM overhead. |
| **Backend Runtime** | Server Engine | Node.js v20 LTS | Long-term support, non-blocking asynchronous I/O, native JSON parsing, widespread deployment compatibility. |
| **Application Server**| REST Framework | Express.js v4.19+ | Lightweight, robust middleware ecosystem, deterministic routing, minimal abstraction over native HTTP. |
| **Language** | Type Safety | TypeScript v5.5+ | End-to-end type safety across client and server, shared interface contracts, compile-time error detection. |
| **Database** | Relational Store | PostgreSQL v15+ | Enterprise-grade ACID compliance, native double-precision trigonometric math, robust B-Tree index engine. |
| **ORM** | Data Mapping | Prisma ORM v5.19+ | Type-safe query building, declarative schema modeling, migration management, raw SQL execution (`$queryRaw`). |
| **Validation** | Schema Validator| Zod v3.23+ | Strict runtime request parsing and type inference, preventing malformed coordinates and injection vectors. |
| **Authentication** | Credentials & JWT | bcryptjs & jsonwebtoken | Industry-standard salt-hashed password security (cost factor 12) and stateless HMAC-SHA256 bearer tokens. |

---

### 1.3 Zero-Cost Geospatial Philosophy & Operational Economics
Commercial mapping services (e.g., Google Maps JavaScript API, Places API, Geocoding API) incur steep usage-based pricing ($5.00–$30.00 per 1,000 requests). For civic and informal vendor initiatives, this model introduces unsustainable operational liability.

GaliGuide eliminates external mapping API licensing costs through a four-part zero-cost architecture:
1. **Basemap Rendering**: Uses OpenStreetMap (OSM) standard raster tile servers (`tile.openstreetmap.org`) rendered via Leaflet at $0.00 infrastructure cost.
2. **Client-Side Spatial Processing**: Marker clustering and heatmap density calculations execute on the client's GPU/Canvas thread, avoiding server-side map rendering or paid clustering services.
3. **Turn-by-Turn Routing Offloading**: Instead of paying for Google Directions or Mapbox Routing APIs, GaliGuide generates native deep links to the external Google Maps web/app client:
   $$\text{URL} = \text{https://www.google.com/maps/dir/?api=1\&destination=}\{\text{latitude}\},\{\text{longitude}\}\&\text{travelmode=walking}$$
   This delegates real-time GPS tracking, voice navigation, and pedestrian routing directly to the user's native Google Maps application without API consumption or API keys.
4. **Direct Device Telephony**: Telephone communication executes via standard `tel:` URI schemes directly activating the device's native telephony dialer (`tel:+919826011111`), eliminating commercial voice/call proxy services.

---

### 1.4 Client Interaction Architecture & State Machine

#### 1.4.1 Public Geolocation State Machine
When a citizen opens GaliGuide, the application initiates an asynchronous geolocation resolution sequence designed for graceful degradation:

```
                          +-------------------------------+
                          |    App Mount / Map Init       |
                          +---------------+---------------+
                                          |
                                          v
                          +-------------------------------+
                          | Check Cached / Stored Coords  |
                          +---------------+---------------+
                                          |
                     [Cached Valid]       |       [No Valid Cache]
                 +------------------------+------------------------+
                 |                                                 |
                 v                                                 v
  +-------------------------------+             +--------------------------------------+
  | Set userCoords from LocalStore|             | Request Navigator Geolocation API    |
  | Center Map on Cached Coords   |             +------------------+-------------------+
  +---------------+---------------+                                |
                  |                               +----------------+---------------+
                  |                               |                                |
                  |                   [Permission Granted]             [Permission Denied / Timeout]
                  |                               |                                |
                  |                               v                                v
                  |             +-----------------------------------+ +------------------------------------+
                  |             | Set userCoords = { lat, lng }     | | Activate Fallback Area Selector    |
                  |             | Cache in LocalStorage             | | Set userCoords = Rajwada (Indore)  |
                  |             | Center Map with Blue Accuracy Ring| | Fetch Area Localities (/api/areas) |
                  |             +-----------------+-----------------+ +------------------+-----------------+
                  |                               |                                      |
                  +-------------------------------+--------------------------------------+
                                                  |
                                                  v
                               +-------------------------------------+
                               | Trigger Spatial Fetch:              |
                               | GET /api/vendors?lat=...&lng=...    |
                               +------------------+------------------+
                                                  |
                                                  v
                               +-------------------------------------+
                               | Render Map Pins (Cluster Group),    |
                               | Populate Vendor List,               |
                               | Compute Haversine Distances         |
                               +------------------+------------------+
                                                  |
                       +--------------------------+--------------------------+
                       |                          |                          |
                       v                          v                          v
             [Category Chip Select]       [Text Search Input]         [Vendor Pin Click]
                       |                          |                          |
                       v                          v                          v
             Update categoryId filter    Debounce 300ms              Center & zoom pin
             Re-filter Cluster & List    Execute partial search      Open Bottom Sheet / Modal
             Update Heatmap overlay      Re-order vendor list        Display Navigation Actions
```

#### 1.4.2 Responsive Layout Strategy (Mobile Bottom Sheet vs Desktop Split-Screen)
GaliGuide adapts dynamically to viewport dimensions across standard breakpoints:
- **Mobile (< 768px Viewport)**:
  - **Full-Bleed Map**: The Leaflet map occupies 100% of the viewport height (`100dvh`).
  - **Floating Header**: Translucent floating card containing the search bar and horizontally scrolling category chips (`overflow-x-auto`).
  - **Bottom Action Drawer**: Multi-state bottom sheet (collapsed at 80px peek showing count of nearby vendors; mid-state at 40% height showing scrollable cards; full expanded at 90% height for detailed vendor profiles).
- **Desktop (>= 768px Viewport)**:
  - **Two-Column Split Layout**:
    - **Left Sidebar (Fixed 440px)**: Category selector, search input with clear trigger, active filter summary, and distance-sorted virtualized vendor cards list.
    - **Right Map Canvas (Flex-1)**: Full-bleed Leaflet map with zoom controls, cluster pins, and floating heatmap toggle switch in the top-right corner.
  - **Vendor Profile Slide-Over**: Sliding side-drawer (480px width) emerging from the right margin upon pin or card selection, preserving map context.

---

## 2. Relational Database Schema Specification (Prisma & PostgreSQL)

### 2.1 Complete, Syntactically Valid `schema.prisma`
Below is the authoritative, complete Prisma schema file for GaliGuide.

```prisma
// ============================================================================
// GaliGuide Database Schema Specification
// Location: server/prisma/schema.prisma
// Engine: PostgreSQL 15+
// ============================================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ----------------------------------------------------------------------------
// ENUMS
// ----------------------------------------------------------------------------

enum Role {
  ADMIN
  SUPER_ADMIN
}

enum VendorStatus {
  PENDING      // Newly submitted / unverified crowd or field submission
  VERIFIED     // Formally verified by an authorized administrator
  REJECTED     // Rejected due to inaccurate data or invalid trade
  SUSPENDED    // Temporarily hidden from public discovery due to dispute
}

enum OperatingStatus {
  ACTIVE       // Customarily operational
  INACTIVE     // Seasonal shutdown or temporary hiatus
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

enum AuditAction {
  CREATE
  UPDATE_DETAILS
  UPDATE_LOCATION
  VERIFY
  REJECT
  SUSPEND
  DELETE
}

// ----------------------------------------------------------------------------
// RELATIONAL MODELS
// ----------------------------------------------------------------------------

/// Administrators and field verifiers managing vendor listings and data integrity
model AdminUser {
  id           String         @id @default(uuid()) @db.Uuid
  email        String         @unique @db.VarChar(255)
  passwordHash String         @db.VarChar(255)
  name         String         @db.VarChar(100)
  role         Role           @default(ADMIN)
  isActive     Boolean        @default(true)
  lastLoginAt  DateTime?      @db.Timestamptz(6)
  createdAt    DateTime       @default(now()) @db.Timestamptz(6)
  updatedAt    DateTime       @updatedAt @db.Timestamptz(6)

  // Relations
  verifiedVendors Vendor[]    @relation("AdminVerifiedVendors")
  createdVendors  Vendor[]    @relation("AdminCreatedVendors")
  auditLogs       AuditLog[]

  @@map("admin_users")
}

/// Standardized trade categories for informal vendors (e.g. chaat, chai, cobbler)
model Category {
  id           String         @id @default(uuid()) @db.Uuid
  name         String         @unique @db.VarChar(100)
  slug         String         @unique @db.VarChar(100)
  description  String?        @db.Text
  icon         String         @db.VarChar(50)  // Lucide icon identifier (e.g., "utensils", "coffee", "scissors")
  color        String         @db.VarChar(20)  // Hex color code (e.g., "#f97316")
  displayOrder Int            @default(0)
  isActive     Boolean        @default(true)
  createdAt    DateTime       @default(now()) @db.Timestamptz(6)
  updatedAt    DateTime       @updatedAt @db.Timestamptz(6)

  // Relations
  vendors      Vendor[]

  @@index([isActive, displayOrder])
  @@map("categories")
}

/// Predefined Indore administrative areas and bazaars for manual fallback navigation
model Area {
  id           String         @id @default(uuid()) @db.Uuid
  name         String         @unique @db.VarChar(100) // e.g., "Sarafa Bazaar", "Chappan Dukan", "Rajwada"
  slug         String         @unique @db.VarChar(100)
  pincode      String?        @db.VarChar(10)
  latitude     Float          @db.DoublePrecision     // Centroid latitude
  longitude    Float          @db.DoublePrecision     // Centroid longitude
  boundsMinLat Float?         @db.DoublePrecision     // Optional bounding envelope
  boundsMaxLat Float?         @db.DoublePrecision
  boundsMinLng Float?         @db.DoublePrecision
  boundsMaxLng Float?         @db.DoublePrecision
  isActive     Boolean        @default(true)
  createdAt    DateTime       @default(now()) @db.Timestamptz(6)
  updatedAt    DateTime       @updatedAt @db.Timestamptz(6)

  // Relations
  vendors      Vendor[]

  @@index([latitude, longitude])
  @@map("areas")
}

/// Primary vendor entity representing an informal street stall or service artisan
model Vendor {
  id              String          @id @default(uuid()) @db.Uuid
  name            String          @db.VarChar(150)
  hindiName       String?         @db.VarChar(150) // Local Hindi script alias (e.g., "जॉनी हॉट डॉग")
  description     String?         @db.Text
  contactPhone    String?         @db.VarChar(20)  // Primary mobile number for device dialer
  whatsappPhone   String?         @db.VarChar(20)  // Direct messaging contact
  
  // Geospatial Coordinates (WGS84 Datum)
  latitude        Float           @db.DoublePrecision // Precise GPS latitude (-90 to +90)
  longitude       Float           @db.DoublePrecision // Precise GPS longitude (-180 to +180)
  landmark        String          @db.VarChar(255)    // Hyperlocal landmark (e.g., "Behind Gopal Mandir")
  addressLine     String?         @db.VarChar(255)    // Street or gali name
  
  // Status and Governance Flags
  status          VendorStatus    @default(PENDING)
  operatingStatus OperatingStatus @default(ACTIVE)
  isVerified      Boolean         @default(false)
  verifiedAt      DateTime?       @db.Timestamptz(6)
  
  // Privacy and Vendor Consent Safeguards
  consentObtained Boolean         @default(true)      // Vendor consented to public directory indexing
  isPhonePublic   Boolean         @default(true)      // Consent to display phone and enable direct dialer
  
  // Foreign Keys
  categoryId      String          @db.Uuid
  areaId          String?         @db.Uuid
  createdById     String?         @db.Uuid
  verifiedById    String?         @db.Uuid

  // Timestamps
  createdAt       DateTime        @default(now()) @db.Timestamptz(6)
  updatedAt       DateTime        @updatedAt @db.Timestamptz(6)

  // Relational Associations
  category        Category        @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  area            Area?           @relation(fields: [areaId], references: [id], onDelete: SetNull)
  createdBy       AdminUser?      @relation("AdminCreatedVendors", fields: [createdById], references: [id], onDelete: SetNull)
  verifiedBy      AdminUser?      @relation("AdminVerifiedVendors", fields: [verifiedById], references: [id], onDelete: SetNull)
  operatingHours  OperatingHour[]
  auditLogs       AuditLog[]

  // High Performance Spatial and Composite Indexes
  @@index([status, categoryId])
  @@index([latitude, longitude])
  @@index([areaId])
  @@index([name])
  @@map("vendors")
}

/// Day-specific weekly operating schedule for each vendor
model OperatingHour {
  id        String    @id @default(uuid()) @db.Uuid
  vendorId  String    @db.Uuid
  dayOfWeek DayOfWeek
  openTime  String    @db.VarChar(5) // 24-hr time "HH:mm" format (e.g., "11:00")
  closeTime String    @db.VarChar(5) // 24-hr time "HH:mm" format (e.g., "23:00")
  isClosed  Boolean   @default(false)

  // Relations
  vendor    Vendor    @relation(fields: [vendorId], references: [id], onDelete: Cascade)

  @@unique([vendorId, dayOfWeek])
  @@index([vendorId])
  @@map("operating_hours")
}

/// Immutable audit record capturing administrative mutations and verification history
model AuditLog {
  id         String      @id @default(uuid()) @db.Uuid
  vendorId   String      @db.Uuid
  adminId    String?     @db.Uuid
  action     AuditAction
  reason     String?     @db.Text
  snapshot   Json?       // JSON diff or state snapshot at the time of modification
  ipAddress  String?     @db.VarChar(45)
  createdAt  DateTime    @default(now()) @db.Timestamptz(6)

  // Relations
  vendor     Vendor      @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  admin      AdminUser?  @relation(fields: [adminId], references: [id], onDelete: SetNull)

  @@index([vendorId, createdAt])
  @@index([adminId])
  @@map("audit_logs")
}
```

---

### 2.2 Data Dictionary & Entity Model Breakdown

#### 2.2.1 `AdminUser` Model
Represents back-office operators, municipal ward inspectors, and platform administrators.
- `id`: UUIDv4 primary key.
- `email`: Unique login identifier, restricted to valid RFC 5322 email formatting (`VarChar(255)`).
- `passwordHash`: Bcrypt salt hash (cost factor 12) with a fixed 60-character length, stored in `VarChar(255)`.
- `name`: Full display name of the administrative user.
- `role`: Role-based privilege level (`ADMIN` or `SUPER_ADMIN`).
- `isActive`: Boolean switch enabling immediate revocation of administrative access without destroying referential links.
- `lastLoginAt`: Timestamp recording successful JWT authentication handshakes.

#### 2.2.2 `Category` Model
Standardized taxonomy for informal street trades.
- `id`: UUIDv4 primary key.
- `name`: English trade category label (e.g., "Street Food", "Cobblers & Shoe Repair", "Key Makers").
- `slug`: URL-safe kebab-case slug (e.g., `street-food`, `cobblers-repair`).
- `icon`: Identifier matching Lucide React icon components (e.g., `utensils`, `coffee`, `scissors`, `hammer`, `key`).
- `color`: Hexadecimal color string (e.g., `#f97316`) applied dynamically to Leaflet marker pins and UI badges.
- `displayOrder`: Integer controlling presentation sequence in the category navigation bar.
- `isActive`: Soft-toggle to hide obsolete categories without triggering referential foreign key violations.

#### 2.2.3 `Area` Model
Predefined administrative boundaries and cultural hubs within Indore.
- `id`: UUIDv4 primary key.
- `name`: Recognized Indore locality name (e.g., "Chappan Dukan", "Sarafa Bazaar", "Rajwada", "Vijay Nagar").
- `slug`: URL-safe identifier for routing and deep linking.
- `pincode`: Postal code for geographic alignment (e.g., `452001`, `452002`).
- `latitude` / `longitude`: Centroid coordinates of the locality used for map repositioning when GPS is unavailable.
- `boundsMinLat`, `boundsMaxLat`, `boundsMinLng`, `boundsMaxLng`: Optional rectangular bounding envelope defining the nominal boundary of the bazaar.

#### 2.2.4 `Vendor` Model
The core entity capturing informal street vendors.
- `id`: UUIDv4 primary key.
- `name`: Public trading name in English or Romanized Hindi (e.g., "Johny Hot Dog", "Ramu Mochi").
- `hindiName`: Native Devanagari script label (e.g., "जॉनी हॉट डॉग") enabling Hindi search matching.
- `latitude` / `longitude`: WGS84 coordinates in 64-bit double precision.
- `landmark`: Micro-location textual anchor indispensable for finding street carts in unaddressed alleyways (e.g., "Opposite Bada Ganpati Temple, near banyan tree").
- `status`: Verification state machine (`PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`).
- `operatingStatus`: Operational status (`ACTIVE` or `INACTIVE`).
- `consentObtained`: Boolean confirming the vendor's explicit verbal or written agreement to be publicly indexed.
- `isPhonePublic`: Safeguard allowing vendors to hide their phone number from public discovery while remaining listed.

#### 2.2.5 `OperatingHour` Model
Granular weekly schedule for vendor stalls.
- `id`: UUIDv4 primary key.
- `vendorId`: Foreign key reference to parent `Vendor`.
- `dayOfWeek`: Enum covering `MONDAY` through `SUNDAY`.
- `openTime` / `closeTime`: 5-character string in 24-hour military time (`HH:mm`, e.g., `09:30`, `23:00`). Handles late-night markets (such as Sarafa Bazaar operating from 20:00 to 02:00) by evaluating intraday open/close intervals.
- `isClosed`: Flag indicating whether the stall is closed for the entire day.

#### 2.2.6 `AuditLog` Model
Append-only tamper-evident audit ledger.
- `id`: UUIDv4 primary key.
- `vendorId`: Foreign key to affected `Vendor`.
- `adminId`: UUID of the authenticated administrator executing the action.
- `action`: State transition or modification type (`CREATE`, `UPDATE_DETAILS`, `UPDATE_LOCATION`, `VERIFY`, `REJECT`, `SUSPEND`, `DELETE`).
- `reason`: Justification note entered by the verifier (e.g., "Field verification visit conducted with local ward officer").
- `snapshot`: JSONB column capturing state diffs before and after the modification.
- `ipAddress`: Remote client IP address recorded at the time of request.

---

### 2.3 Foreign Key Cascades & Relational Integrity Matrix

| Parent Model | Child Model | Relation Field | Action on Parent Delete | Rationale |
|---|---|---|---|---|
| `Vendor` | `OperatingHour` | `operatingHours` | `Cascade` | Deleting a vendor must purge all linked weekly operating schedules to prevent orphaned rows. |
| `Vendor` | `AuditLog` | `auditLogs` | `Cascade` | Complete purge of vendor profile removes associated audit logs, maintaining relational hygiene. |
| `Category` | `Vendor` | `vendors` | `Restrict` | Prevents accidental deletion of a category that has active vendors assigned to it. Admin must reassign vendors first. |
| `Area` | `Vendor` | `vendors` | `SetNull` | Deleting an area leaves the vendor intact with `areaId = NULL`; vendor coordinates remain unchanged. |
| `AdminUser` | `Vendor` (created) | `createdVendors` | `SetNull` | Removing an administrative user preserves vendor listings created by that user. |
| `AdminUser` | `Vendor` (verified) | `verifiedVendors`| `SetNull` | Removing an administrative user preserves the vendor's verified status while setting `verifiedById = NULL`. |
| `AdminUser` | `AuditLog` | `auditLogs` | `SetNull` | Preserves audit history records even if the executing admin account is decommissioned. |

---

### 2.4 Coordinate Storage & Spatial Indexing Rationale

#### 2.4.1 IEEE 754 `Double Precision` vs `Decimal(10,8)`
In relational database design for geospatial applications, coordinates can be stored as either fixed-point `DECIMAL(10,8)` or IEEE 754 64-bit floating-point `DOUBLE PRECISION`:
- **Trigonometric Performance**: In PostgreSQL, mathematical functions (`SIN`, `COS`, `ACOS`, `RADIANS`) operate natively on 64-bit floating-point types (`float8` / `DOUBLE PRECISION`). Storing coordinates as `DECIMAL` forces PostgreSQL to execute explicit runtime type casting on every row during Haversine evaluation, incurring an estimated 35–45% computational CPU penalty.
- **Precision Guarantee**: A 64-bit float allocates 53 bits of significand precision, delivering approximately 15–17 decimal digits of precision. At the equator:
  - 5 decimal places: $\approx 1.1\text{ meters}$
  - 6 decimal places: $\approx 0.11\text{ meters}$ ($11\text{ cm}$)
  - 7 decimal places: $\approx 0.011\text{ meters}$ ($1.1\text{ cm}$)
  Standard consumer smartphone GPS accuracy operates within 3 to 5 meters. Double precision coordinates exceed GPS accuracy by four orders of magnitude while preserving native hardware floating-point execution speed.

#### 2.4.2 Composite Indexing Architecture
1. **`@@index([latitude, longitude])`**:
   - Enables PostgreSQL B-Tree index range scans for rectangular bounding-box pre-filtering:
     $$\text{latitude BETWEEN } \text{minLat} \text{ AND } \text{maxLat} \quad \text{AND} \quad \text{longitude BETWEEN } \text{minLng} \text{ AND } \text{maxLng}$$
   - This prunes 99% of non-candidate vendors before running computationally heavier trigonometric calculations.
2. **`@@index([status, categoryId])`**:
   - The primary query pattern for public users filters by `status = 'VERIFIED'` and optionally by `categoryId`. This compound index satisfies both equality predicates in a single index lookup.

---

## 3. Haversine Distance & Geospatial Query Engine

### 3.1 Mathematical Formulation & Spherical Law of Cosines
The shortest distance between two points on the surface of a sphere along a great circle is derived using spherical trigonometry.

Given two coordinates:
- User Location: $(\phi_1, \lambda_1) = (\text{lat}_{\text{user}}, \text{lng}_{\text{user}})$
- Vendor Location: $(\phi_2, \lambda_2) = (\text{lat}_{\text{vendor}}, \text{lng}_{\text{vendor}})$
- Earth's Mean Volumetric Radius: $R = 6,371.0\text{ km}$ ($6,371,000\text{ meters}$)

All latitude and longitude angles must be converted from degrees to radians:
$$\text{rad}(\theta) = \theta \times \frac{\pi}{180}$$

#### 3.1.1 Full Haversine Formula
$$\Delta\phi = \text{rad}(\text{lat}_2 - \text{lat}_1), \quad \Delta\lambda = \text{rad}(\text{lng}_2 - \text{lng}_1)$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\text{rad}(\text{lat}_1)) \cdot \cos(\text{rad}(\text{lat}_2)) \cdot \sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d = R \cdot c$$

#### 3.1.2 Spherical Law of Cosines (SQL-Optimized Formulation)
While the full Haversine formula provides high numerical stability for antipodal points, the Spherical Law of Cosines is mathematically equivalent for small distances ($d < 50\text{ km}$) and executes significantly faster in relational SQL engines due to fewer transcendental function invocations:
$$d = R \cdot \arccos\left(\sin(\phi_1)\sin(\phi_2) + \cos(\phi_1)\cos(\phi_2)\cos(\lambda_2 - \lambda_1)\right)$$

To guard against floating-point roundoff errors where the cosine argument exceeds $1.0$ or falls below $-1.0$ (which would cause PostgreSQL `acos()` to throw a `domain error` exception), the inner dot product must be clamped:
$$\text{clamped\_arg} = \min(1.0, \max(-1.0, \dots))$$

---

### 3.2 Two-Tier Spatial Optimization Pipeline
Executing trigonometric operations across an entire unindexed database table triggers full table scans ($O(N)$ CPU cost). GaliGuide implements a two-tier spatial query engine:

```
  All Database Vendors (N Rows)
               |
               v
  [ Tier 1: Indexed Bounding Box Range Scan ]
  WHERE latitude BETWEEN minLat AND maxLat
    AND longitude BETWEEN minLng AND maxLng
               |
               v
  Filtered Candidate Subset (M Rows, where M << N)
               |
               v
  [ Tier 2: Spherical Law of Cosines Evaluation ]
  Compute exact distanceKm = R * acos(clamped_dot_product)
  Filter: distanceKm <= radiusKm
  ORDER BY distanceKm ASC
  LIMIT limit OFFSET offset
               |
               v
  Final Paginated Result Set (e.g., 20 Sorted Vendors)
```

#### Mathematical Delta Equations for Bounding Box
Given user coordinates $(\text{lat}_{\text{user}}, \text{lng}_{\text{user}})$ and search radius $r$ km:
- One degree of latitude is approximately constant across the globe:
  $$1^{\circ} \text{ Latitude} \approx 111.045\text{ km} \implies \Delta\text{lat}_{\text{deg}} = \frac{r}{111.045}$$
- One degree of longitude shrinks as latitude approaches the poles:
  $$1^{\circ} \text{ Longitude} \approx 111.045 \cdot \cos(\text{rad}(\text{lat}_{\text{user}}))\text{ km} \implies \Delta\text{lng}_{\text{deg}} = \frac{r}{111.045 \cdot \cos(\text{rad}(\text{lat}_{\text{user}}))}$$
- Bounding envelope boundaries:
  $$\text{minLat} = \text{lat}_{\text{user}} - \Delta\text{lat}_{\text{deg}}, \quad \text{maxLat} = \text{lat}_{\text{user}} + \Delta\text{lat}_{\text{deg}}$$
  $$\text{minLng} = \text{lng}_{\text{user}} - \Delta\text{lng}_{\text{deg}}, \quad \text{maxLng} = \text{lng}_{\text{user}} + \Delta\text{lng}_{\text{deg}}$$

---

### 3.3 Server-Side PostgreSQL Raw SQL Engine (Prisma `$queryRaw`)
Below is the production implementation of the geospatial search service running within Express.

```typescript
// server/src/services/spatial.service.ts

import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface VendorSpatialResult {
  id: string;
  name: string;
  hindiName: string | null;
  description: string | null;
  contactPhone: string | null;
  whatsappPhone: string | null;
  latitude: number;
  longitude: number;
  landmark: string;
  addressLine: string | null;
  status: string;
  isVerified: boolean;
  isPhonePublic: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  categoryIcon: string;
  categoryColor: string;
  areaId: string | null;
  areaName: string | null;
  distanceKm: number;
}

export interface NearbyVendorsParams {
  userLat: number;
  userLng: number;
  radiusKm?: number;
  categoryId?: string;
  searchQuery?: string;
  areaId?: string;
  limit?: number;
  offset?: number;
}

export async function findNearbyVendors(params: NearbyVendorsParams): Promise<{
  vendors: VendorSpatialResult[];
  totalCount: number;
}> {
  const {
    userLat,
    userLng,
    radiusKm = 5.0,
    categoryId,
    searchQuery,
    areaId,
    limit = 20,
    offset = 0,
  } = params;

  const EARTH_RADIUS_KM = 6371.0;

  // 1. Calculate Bounding Box Deltas (Tier 1)
  const deltaLat = radiusKm / 111.045;
  const radUserLat = (userLat * Math.PI) / 180.0;
  const deltaLng = radiusKm / (111.045 * Math.cos(radUserLat));

  const minLat = userLat - deltaLat;
  const maxLat = userLat + deltaLat;
  const minLng = userLng - deltaLng;
  const maxLng = userLng + deltaLng;

  // 2. Build Dynamic Parameterized SQL Predicates
  const conditions: Prisma.Sql[] = [
    Prisma.sql`v.status = 'VERIFIED'`,
    Prisma.sql`v."consentObtained" = true`,
    Prisma.sql`v.latitude BETWEEN ${minLat} AND ${maxLat}`,
    Prisma.sql`v.longitude BETWEEN ${minLng} AND ${maxLng}`,
  ];

  if (categoryId) {
    conditions.push(Prisma.sql`v."categoryId" = ${categoryId}::uuid`);
  }

  if (areaId) {
    conditions.push(Prisma.sql`v."areaId" = ${areaId}::uuid`);
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    const term = `%${searchQuery.trim()}%`;
    conditions.push(
      Prisma.sql`(v.name ILIKE ${term} OR v."hindiName" ILIKE ${term} OR v.landmark ILIKE ${term} OR v.description ILIKE ${term})`
    );
  }

  const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;

  // 3. Formulate Parameterized Raw Query with Clamped Spherical Law of Cosines
  const vendorsQuery = Prisma.sql`
    WITH candidate_vendors AS (
      SELECT
        v.id,
        v.name,
        v."hindiName",
        v.description,
        CASE WHEN v."isPhonePublic" = true THEN v."contactPhone" ELSE NULL END AS "contactPhone",
        CASE WHEN v."isPhonePublic" = true THEN v."whatsappPhone" ELSE NULL END AS "whatsappPhone",
        v.latitude,
        v.longitude,
        v.landmark,
        v."addressLine",
        v.status,
        v."isVerified",
        v."isPhonePublic",
        v."categoryId",
        c.name AS "categoryName",
        c.slug AS "categorySlug",
        c.icon AS "categoryIcon",
        c.color AS "categoryColor",
        v."areaId",
        a.name AS "areaName",
        ROUND(
          (
            ${EARTH_RADIUS_KM} * acos(
              LEAST(1.0, GREATEST(-1.0,
                cos(radians(${userLat})) * cos(radians(v.latitude)) *
                cos(radians(v.longitude) - radians(${userLng})) +
                sin(radians(${userLat})) * sin(radians(v.latitude))
              ))
            )
          )::numeric, 3
        )::double precision AS "distanceKm"
      FROM vendors v
      INNER JOIN categories c ON v."categoryId" = c.id
      LEFT JOIN areas a ON v."areaId" = a.id
      ${whereClause}
    )
    SELECT *
    FROM candidate_vendors
    WHERE "distanceKm" <= ${radiusKm}
    ORDER BY "distanceKm" ASC
    LIMIT ${limit} OFFSET ${offset};
  `;

  // 4. Formulate Accurate Count Query
  const countQuery = Prisma.sql`
    SELECT COUNT(*)::int AS count
    FROM vendors v
    ${whereClause}
    AND (
      ${EARTH_RADIUS_KM} * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(${userLat})) * cos(radians(v.latitude)) *
          cos(radians(v.longitude) - radians(${userLng})) +
          sin(radians(${userLat})) * sin(radians(v.latitude))
        ))
      )
    ) <= ${radiusKm};
  `;

  // 5. Concurrent Query Execution
  const [vendors, countResult] = await Promise.all([
    prisma.$queryRaw<VendorSpatialResult[]>(vendorsQuery),
    prisma.$queryRaw<[{ count: number }]>(countQuery),
  ]);

  return {
    vendors,
    totalCount: countResult[0]?.count || 0,
  };
}
```

---

### 3.4 Client-Side TypeScript Calculation Utility

```typescript
// client/src/utils/haversine.ts

/**
 * Calculates straight-line great-circle distance between two geographic coordinates
 * on Earth using the Haversine trigonometric formula.
 *
 * @param lat1 Latitude of first point in decimal degrees
 * @param lon1 Longitude of first point in decimal degrees
 * @param lat2 Latitude of second point in decimal degrees
 * @param lon2 Longitude of second point in decimal degrees
 * @returns Distance in kilometers rounded to 2 decimal places
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371.0;

  const toRad = (degrees: number): number => (degrees * Math.PI) / 180.0;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0);

  const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100.0) / 100.0;
}

/**
 * Formats a numeric distance value into human-readable metric string.
 *
 * @param distanceKm Distance in kilometers
 * @returns e.g. "350 m away" if under 1km, or "2.4 km away"
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 0.05) {
    return 'Right here (< 50m)';
  }
  if (distanceKm < 1.0) {
    const meters = Math.round(distanceKm * 1000.0);
    return `${meters} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}
```

---

## 4. Exhaustive RESTful API Contracts

All GaliGuide HTTP endpoints communicate over standard JSON using explicit HTTP verbs, query parameters, request validation via Zod schemas, uniform status codes, and consistent JSON envelope wrappers.

### Standard Response Envelopes

#### Success Envelope (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalCount": 184,
    "totalPages": 10
  }
}
```

#### Error Envelope (`400`, `401`, `403`, `404`, `409`, `429`, `500`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The supplied request parameters failed schema validation",
    "details": [
      {
        "field": "latitude",
        "message": "Number must be greater than or equal to -90"
      }
    ]
  }
}
```

#### Standard Error Code Taxonomy
- `VALIDATION_ERROR` (400): Request query, params, or body failed Zod validation.
- `UNAUTHORIZED` (401): Missing, malformed, or expired Bearer token.
- `INVALID_CREDENTIALS` (401): Email or password mismatch during admin login.
- `FORBIDDEN` (403): Authenticated user lacks necessary administrative role (`SUPER_ADMIN`).
- `NOT_FOUND` (404): Target resource does not exist.
- `CONFLICT` (409): Unique constraint violation (e.g. duplicate email, slug, or category with attached vendors).
- `RATE_LIMIT_EXCEEDED` (429): Client exceeded rate limit window threshold.
- `INTERNAL_SERVER_ERROR` (500): Unhandled exception in application logic.

---

### 4.1 Public APIs

#### 4.1.1 `GET /api/categories`
- **Description**: Returns all active vendor trade categories with dynamic count of verified vendors.
- **Authentication**: Public (None).
- **Query Parameters**: None.
- **HTTP Status Codes**:
  - `200 OK`: Categories retrieved successfully.
  - `500 Internal Server Error`: Database query failure.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "c1f7b02e-4b2a-43d9-95e2-228795da0f91",
      "name": "Street Food",
      "slug": "street-food",
      "description": "Indori chaat, poha jalebi, hot dogs, dahi vada, and evening street food",
      "icon": "utensils",
      "color": "#f97316",
      "displayOrder": 1,
      "vendorCount": 42
    },
    {
      "id": "e2a3c4d5-5e6f-47a8-b9c0-112233445566",
      "name": "Chai & Beverages",
      "slug": "chai-beverages",
      "description": "Masala chai, lassi, fresh sugarcane juice, shikanji, and cold coffee",
      "icon": "coffee",
      "color": "#d97706",
      "displayOrder": 2,
      "vendorCount": 28
    },
    {
      "id": "a3b4c5d6-7e8f-49a0-b1c2-223344556677",
      "name": "Cobblers & Shoe Care",
      "slug": "cobblers-shoe-care",
      "description": "Shoe repair, leather stitching, heel replacement, and polishing artisans",
      "icon": "hammer",
      "color": "#8b5cf6",
      "displayOrder": 3,
      "vendorCount": 16
    }
  ]
}
```

---

#### 4.1.2 `GET /api/vendors`
- **Description**: Main discovery endpoint. Supports spatial proximity filtering, category filtering, text search (with bilingual Devanagari support), bounding box boundaries, and pagination.
- **Authentication**: Public (None).
- **Zod Validation Schema (`vendorsQuerySchema`)**:
```typescript
import { z } from 'zod';

export const vendorsQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().min(0.1).max(50.0).default(5.0),
  minLat: z.coerce.number().min(-90).max(90).optional(),
  maxLat: z.coerce.number().min(-90).max(90).optional(),
  minLng: z.coerce.number().min(-180).max(180).optional(),
  maxLng: z.coerce.number().min(-180).max(180).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['distance', 'name', 'createdAt']).default('distance'),
}).refine(data => {
  if ((data.lat !== undefined && data.lng === undefined) || (data.lat === undefined && data.lng !== undefined)) {
    return false;
  }
  return true;
}, {
  message: "Both 'lat' and 'lng' must be supplied simultaneously for proximity ranking",
  path: ['lat'],
});
```
- **HTTP Status Codes**:
  - `200 OK`: Vendors successfully retrieved and ranked.
  - `400 Bad Request`: Validation failure on coordinates or pagination.
  - `500 Internal Server Error`: Geospatial query execution failure.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "7b68a4e3-5c21-4f1a-b60b-8d021f14ec7b",
      "name": "Johny Hot Dog",
      "hindiName": "जॉनी हॉट डॉग",
      "description": "Indore's iconic mutton hot dog, vegetable burger, and egg banjo stall since 1978.",
      "contactPhone": "+919826011111",
      "whatsappPhone": "+919826011111",
      "latitude": 22.7248,
      "longitude": 75.8856,
      "landmark": "Shop No. 18, Chappan Dukan, New Palasia",
      "addressLine": "Chappan Dukan",
      "status": "VERIFIED",
      "isVerified": true,
      "isPhonePublic": true,
      "category": {
        "id": "c1f7b02e-4b2a-43d9-95e2-228795da0f91",
        "name": "Street Food",
        "slug": "street-food",
        "icon": "utensils",
        "color": "#f97316"
      },
      "area": {
        "id": "3b2e1a09-7f6d-4b8c-a1e2-998877665544",
        "name": "Chappan Dukan"
      },
      "distanceKm": 0.35,
      "operatingHoursToday": {
        "dayOfWeek": "TUESDAY",
        "openTime": "11:00",
        "closeTime": "23:00",
        "isClosed": false,
        "isOpenNow": true
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalCount": 1,
    "totalPages": 1,
    "userCoords": {
      "lat": 22.723,
      "lng": 75.883
    }
  }
}
```

---

#### 4.1.3 `GET /api/vendors/:id`
- **Description**: Returns complete profile of an informal vendor, including full weekly schedule, verification status, contact numbers (honoring privacy flags), and deep-link navigation URLs.
- **Authentication**: Public (None).
- **URL Parameters**:
  - `id`: UUID string of the vendor.
- **HTTP Status Codes**:
  - `200 OK`: Vendor details retrieved.
  - `400 Bad Request`: Malformed UUID.
  - `404 Not Found`: Vendor does not exist.
  - `500 Internal Server Error`: Server failure.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "7b68a4e3-5c21-4f1a-b60b-8d021f14ec7b",
    "name": "Johny Hot Dog",
    "hindiName": "जॉनी हॉट डॉग",
    "description": "Indore's legendary street hot dog cart founded by Vijay Singh Rathore. Famous for hot dogs and egg banjo.",
    "contactPhone": "+919826011111",
    "whatsappPhone": "+919826011111",
    "isPhonePublic": true,
    "latitude": 22.7248,
    "longitude": 75.8856,
    "landmark": "Shop No. 18, Chappan Dukan, New Palasia",
    "addressLine": "Chappan Dukan, Indore, MP 452001",
    "status": "VERIFIED",
    "isVerified": true,
    "verifiedAt": "2026-10-15T10:30:00.000Z",
    "category": {
      "id": "c1f7b02e-4b2a-43d9-95e2-228795da0f91",
      "name": "Street Food",
      "slug": "street-food",
      "icon": "utensils",
      "color": "#f97316"
    },
    "area": {
      "id": "3b2e1a09-7f6d-4b8c-a1e2-998877665544",
      "name": "Chappan Dukan",
      "pincode": "452001"
    },
    "operatingHours": [
      { "dayOfWeek": "MONDAY", "openTime": "11:00", "closeTime": "23:00", "isClosed": false },
      { "dayOfWeek": "TUESDAY", "openTime": "11:00", "closeTime": "23:00", "isClosed": false },
      { "dayOfWeek": "WEDNESDAY", "openTime": "11:00", "closeTime": "23:00", "isClosed": false },
      { "dayOfWeek": "THURSDAY", "openTime": "11:00", "closeTime": "23:00", "isClosed": false },
      { "dayOfWeek": "FRIDAY", "openTime": "11:00", "closeTime": "23:30", "isClosed": false },
      { "dayOfWeek": "SATURDAY", "openTime": "11:00", "closeTime": "23:30", "isClosed": false },
      { "dayOfWeek": "SUNDAY", "openTime": "11:00", "closeTime": "23:30", "isClosed": false }
    ],
    "navigation": {
      "googleMapsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.7248,75.8856&travelmode=walking",
      "telUri": "tel:+919826011111"
    }
  }
}
```

---

#### 4.1.4 `GET /api/vendors/heatmap`
- **Description**: Returns lightweight coordinate tuples `[lat, lng, intensity]` optimized for direct consumption by `L.heatLayer()`.
- **Authentication**: Public (None).
- **Query Parameters**:
  - `categoryId` (optional UUID): Filter heatmap points by specific trade.
- **HTTP Status Codes**:
  - `200 OK`: Points array returned.
  - `500 Internal Server Error`: Database query failure.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    [22.7248, 75.8856, 1.0],
    [22.7176, 75.8542, 1.0],
    [22.7196, 75.8577, 0.8],
    [22.7533, 75.8937, 0.6]
  ],
  "meta": {
    "pointCount": 4,
    "categoryId": null
  }
}
```

---

#### 4.1.5 `GET /api/areas`
- **Description**: Lists predefined Indore administrative localities and bazaar centers with centroid coordinates for manual geolocation fallback navigation.
- **Authentication**: Public (None).
- **HTTP Status Codes**:
  - `200 OK`: Areas array returned.
  - `500 Internal Server Error`: Server failure.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "3b2e1a09-7f6d-4b8c-a1e2-998877665544",
      "name": "Chappan Dukan",
      "slug": "chappan-dukan",
      "pincode": "452001",
      "latitude": 22.7245,
      "longitude": 75.8853,
      "vendorCount": 35
    },
    {
      "id": "9c8b7a65-1d2e-3f4a-5b6c-778899001122",
      "name": "Sarafa Bazaar",
      "slug": "sarafa-bazaar",
      "pincode": "452002",
      "latitude": 22.7176,
      "longitude": 75.8542,
      "vendorCount": 54
    },
    {
      "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Rajwada",
      "slug": "rajwada",
      "pincode": "452002",
      "latitude": 22.7196,
      "longitude": 75.8577,
      "vendorCount": 48
    }
  ]
}
```

---

### 4.2 Admin Authentication APIs

#### 4.2.1 `POST /api/admin/auth/login`
- **Description**: Authenticates administrator credentials using bcrypt and issues a 24-hour HMAC-SHA256 JWT access token.
- **Authentication**: Public.
- **Zod Validation Schema (`adminLoginSchema`)**:
```typescript
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must contain at least 8 characters").max(100),
});
```
- **Request Body**:
```json
{
  "email": "admin@galiguide.in",
  "password": "SecurePassword123!"
}
```
- **HTTP Status Codes**:
  - `200 OK`: Authentication successful, token generated.
  - `400 Bad Request`: Request body validation failed.
  - `401 Unauthorized`: Invalid email or incorrect password.
  - `429 Too Many Requests`: Rate limit triggered (max 5 failed attempts per 15 minutes).
  - `500 Internal Server Error`: Hashing or token generation error.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZjNhOWUyMS0wYTRiLTRjNWQtOWU2Zi03YThiOWMwZDFlMmYiLCJlbWFpbCI6ImFkbWluQGdhbGlndWlkZS5pbiIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MjE2NDAwMCwiZXhwIjoxNzYyMjUwNDAwfQ.SignatureString...",
    "admin": {
      "id": "8f3a9e21-0a4b-4c5d-9e6f-7a8b9c0d1e2f",
      "email": "admin@galiguide.in",
      "name": "Indore Municipal Ward Lead",
      "role": "SUPER_ADMIN"
    }
  }
}
```

---

#### 4.2.2 `GET /api/admin/auth/me`
- **Description**: Returns authenticated administrator session profile and permissions.
- **Authentication**: Bearer JWT (`ADMIN` or `SUPER_ADMIN`).
- **Headers**: `Authorization: Bearer <token>`
- **HTTP Status Codes**:
  - `200 OK`: Session verified.
  - `401 Unauthorized`: Missing, expired, or invalid token.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "8f3a9e21-0a4b-4c5d-9e6f-7a8b9c0d1e2f",
    "email": "admin@galiguide.in",
    "name": "Indore Municipal Ward Lead",
    "role": "SUPER_ADMIN",
    "createdAt": "2026-10-01T00:00:00.000Z"
  }
}
```

---

### 4.3 Admin Vendor Management APIs

#### 4.3.1 `GET /api/admin/vendors`
- **Description**: Paginated vendor directory for back-office administration. Supports filtering across all vendor statuses (`PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`).
- **Authentication**: Bearer JWT (`ADMIN` or `SUPER_ADMIN`).
- **Query Parameters**:
  - `status` (optional `VendorStatus`)
  - `categoryId` (optional UUID)
  - `areaId` (optional UUID)
  - `search` (optional string)
  - `page` (default 1)
  - `limit` (default 25)
- **HTTP Status Codes**:
  - `200 OK`: Directory page retrieved.
  - `401 Unauthorized`: Unauthenticated.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "7b68a4e3-5c21-4f1a-b60b-8d021f14ec7b",
      "name": "Johny Hot Dog",
      "hindiName": "जॉनी हॉट डॉग",
      "contactPhone": "+919826011111",
      "latitude": 22.7248,
      "longitude": 75.8856,
      "landmark": "Shop No. 18, Chappan Dukan",
      "status": "VERIFIED",
      "isVerified": true,
      "consentObtained": true,
      "isPhonePublic": true,
      "categoryName": "Street Food",
      "areaName": "Chappan Dukan",
      "createdAt": "2026-10-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 25,
    "totalCount": 184,
    "totalPages": 8
  }
}
```

---

#### 4.3.2 `POST /api/admin/vendors`
- **Description**: Creates a new vendor listing with coordinates selected via the interactive Leaflet map pin, category assignment, contact details, and weekly operating schedule.
- **Authentication**: Bearer JWT (`ADMIN` or `SUPER_ADMIN`).
- **Zod Validation Schema (`createVendorSchema`)**:
```typescript
export const createVendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(150),
  hindiName: z.string().max(150).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  contactPhone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone format (+91...)").optional().nullable(),
  whatsappPhone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid WhatsApp phone format").optional().nullable(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  landmark: z.string().min(3, "Landmark must be at least 3 characters").max(255),
  addressLine: z.string().max(255).optional().nullable(),
  categoryId: z.string().uuid("Invalid category ID"),
  areaId: z.string().uuid("Invalid area ID").optional().nullable(),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED']).default('VERIFIED'),
  isVerified: z.boolean().default(true),
  consentObtained: z.boolean().default(true),
  isPhonePublic: z.boolean().default(true),
  operatingHours: z.array(
    z.object({
      dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
      openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time format must be HH:mm"),
      closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time format must be HH:mm"),
      isClosed: z.boolean().default(false),
    })
  ).optional(),
});
```
- **Request Body**:
```json
{
  "name": "Ramu Mochi",
  "hindiName": "रामू मोची",
  "description": "Expert shoe cobbler and leather artisan operating outside the district court gate.",
  "contactPhone": "+919826022222",
  "latitude": 22.721542,
  "longitude": 75.861215,
  "landmark": "Near High Court Bench Gate No. 2, MG Road",
  "categoryId": "a3b4c5d6-7e8f-49a0-b1c2-223344556677",
  "areaId": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "isVerified": true,
  "consentObtained": true,
  "isPhonePublic": true,
  "operatingHours": [
    { "dayOfWeek": "MONDAY", "openTime": "09:30", "closeTime": "19:00", "isClosed": false },
    { "dayOfWeek": "TUESDAY", "openTime": "09:30", "closeTime": "19:00", "isClosed": false },
    { "dayOfWeek": "WEDNESDAY", "openTime": "09:30", "closeTime": "19:00", "isClosed": false },
    { "dayOfWeek": "THURSDAY", "openTime": "09:30", "closeTime": "19:00", "isClosed": false },
    { "dayOfWeek": "FRIDAY", "openTime": "09:30", "closeTime": "19:00", "isClosed": false },
    { "dayOfWeek": "SATURDAY", "openTime": "09:30", "closeTime": "19:00", "isClosed": false },
    { "dayOfWeek": "SUNDAY", "openTime": "10:00", "closeTime": "15:00", "isClosed": false }
  ]
}
```
- **HTTP Status Codes**:
  - `201 Created`: Vendor created successfully.
  - `400 Bad Request`: Validation failure on coordinates or phone.
  - `401 Unauthorized`: Unauthenticated.
  - `409 Conflict`: Duplicate vendor detected.
  - `500 Internal Server Error`: Database insertion error.
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
    "name": "Ramu Mochi",
    "status": "VERIFIED",
    "isVerified": true,
    "latitude": 22.721542,
    "longitude": 75.861215,
    "createdAt": "2026-11-03T10:00:00.000Z"
  }
}
```

---

#### 4.3.3 `PUT /api/admin/vendors/:id`
- **Description**: Updates an existing vendor profile, coordinates, category, or operating schedule.
- **Authentication**: Bearer JWT (`ADMIN` or `SUPER_ADMIN`).
- **URL Parameters**: `id`: UUID of vendor.
- **Zod Validation Schema (`updateVendorSchema`)**: Matches `createVendorSchema.partial()`.
- **HTTP Status Codes**:
  - `200 OK`: Vendor successfully updated.
  - `400 Bad Request`: Validation error.
  - `401 Unauthorized`: Unauthenticated.
  - `404 Not Found`: Vendor does not exist.
  - `500 Internal Server Error`: Update error.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
    "name": "Ramu Mochi",
    "updatedAt": "2026-11-03T10:15:00.000Z"
  }
}
```

---

#### 4.3.4 `PATCH /api/admin/vendors/:id/verify`
- **Description**: Transitions vendor verification status (`VERIFIED`, `REJECTED`, or `SUSPENDED`). In an ACID transaction, updates the vendor and generates an immutable record in `audit_logs`.
- **Authentication**: Bearer JWT (`ADMIN` or `SUPER_ADMIN`).
- **Zod Validation Schema (`verifyVendorSchema`)**:
```typescript
export const verifyVendorSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED', 'SUSPENDED']),
  reason: z.string().min(5, "A substantive verification reason is required").max(500),
});
```
- **Request Body**:
```json
{
  "status": "VERIFIED",
  "reason": "On-site field verification confirmed cart location and operating schedule outside High Court Bench."
}
```
- **HTTP Status Codes**:
  - `200 OK`: Vendor status transitioned and audit log recorded.
  - `400 Bad Request`: Invalid status enum or missing reason.
  - `401 Unauthorized`: Unauthenticated.
  - `404 Not Found`: Vendor does not exist.
  - `500 Internal Server Error`: Transaction failure.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
    "status": "VERIFIED",
    "isVerified": true,
    "verifiedAt": "2026-11-03T10:20:00.000Z",
    "auditLogId": "3f4e5d6c-7b8a-9012-3456-789abcdef012"
  }
}
```

---

#### 4.3.5 `DELETE /api/admin/vendors/:id`
- **Description**: Deletes a vendor record and cascades to linked schedules and audit entries.
- **Authentication**: Bearer JWT (`SUPER_ADMIN` only; regular `ADMIN` cannot delete).
- **HTTP Status Codes**:
  - `200 OK`: Vendor deleted.
  - `401 Unauthorized`: Missing or invalid token.
  - `403 Forbidden`: User has `ADMIN` role, but `SUPER_ADMIN` is required.
  - `404 Not Found`: Vendor does not exist.
  - `500 Internal Server Error`: Purge failure.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Vendor record successfully deleted"
}
```

---

### 4.4 Admin Category Management APIs

#### 4.4.1 `GET /api/admin/categories`
- **Description**: Returns all categories including inactive ones for administrative configuration.
- **Authentication**: Bearer JWT (`ADMIN` or `SUPER_ADMIN`).
- **HTTP Status Codes**: `200 OK`, `401 Unauthorized`.

#### 4.4.2 `POST /api/admin/categories`
- **Description**: Creates a new vendor category.
- **Authentication**: Bearer JWT (`SUPER_ADMIN`).
- **Zod Validation Schema (`createCategorySchema`)**:
```typescript
export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(500).optional(),
  icon: z.string().min(2).max(50),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be valid hex code (e.g. #f97316)"),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
```
- **HTTP Status Codes**: `201 Created`, `400 Bad Request`, `401 Unauthorized`, `409 Conflict`.

#### 4.4.3 `PUT /api/admin/categories/:id`
- **Description**: Updates category metadata, color, or icon.
- **Authentication**: Bearer JWT (`SUPER_ADMIN`).
- **HTTP Status Codes**: `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`.

#### 4.4.4 `DELETE /api/admin/categories/:id`
- **Description**: Deletes a category. Before deletion, validates that zero vendors are attached to this category. If vendors exist, returns `409 Conflict`.
- **Authentication**: Bearer JWT (`SUPER_ADMIN`).
- **HTTP Status Codes**:
  - `200 OK`: Category purged.
  - `409 Conflict`: Cannot delete category with assigned vendors.
  - `404 Not Found`: Category does not exist.

---

### 4.5 Security & Authentication Middleware Specification

#### 4.5.1 Express Authentication & Role-Based Access Control (RBAC)
```typescript
// server/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export interface AuthenticatedRequest extends Request {
  admin?: AuthenticatedAdmin;
}

export function authenticateAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Bearer authentication token is required',
      },
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'galiguide-production-jwt-secret-indore-2026';

  try {
    const decoded = jwt.verify(token, secret) as {
      sub: string;
      email: string;
      role: 'ADMIN' | 'SUPER_ADMIN';
    };

    req.admin = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Authentication session token has expired',
        },
      });
    }
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Authentication session token is invalid',
      },
    });
  }
}

export function requireRole(role: 'SUPER_ADMIN') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin || req.admin.role !== role) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient administrative privileges to perform this operation',
        },
      });
    }
    next();
  };
}
```

#### 4.5.2 HTTP Security & Content Security Policy (CSP)
Because Leaflet dynamically downloads map raster tiles from OpenStreetMap CDN clusters, the Express server's HTTP security headers (configured via `helmet`) must explicitly whitelist OSM tile endpoints:

```typescript
// server/src/app.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://*.tile.openstreetmap.org",
          "https://unpkg.com/leaflet@",
        ],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
```

---

## 5. Interactive Leaflet Map Architecture & Client Implementation

### 5.1 OpenStreetMap Tile Layer Configuration
Leaflet renders standard OSM raster tiles with automatic subdomain round-robin rotation, high-zoom support, and graceful network retry handlers.

```typescript
// client/src/components/map/LeafletMap.tsx

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const OSM_TILE_CONFIG = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    minZoom: 11,
    maxZoom: 19,
    tileSize: 256,
    crossOrigin: true,
  } as L.TileLayerOptions,
};

// Default center coordinates for Indore (Rajwada Palace)
export const INDORE_DEFAULT_VIEW = {
  lat: 22.7196,
  lng: 75.8577,
  zoom: 14,
};
```

---

### 5.2 Leaflet MarkerCluster Integration & Dynamic CSS Badges
`leaflet.markercluster` groups nearby vendor pins at lower zoom levels, expanding smoothly upon click or zoom. It uses custom SVG/CSS badges styled according to cluster density.

```typescript
// client/src/components/map/ClusterLayer.tsx

import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export function createMarkerClusterGroup(): L.MarkerClusterGroup {
  return L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 45,
    disableClusteringAtZoom: 18,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      let sizeClass = 'cluster-small';
      let diameter = 36;

      if (count > 50) {
        sizeClass = 'cluster-large';
        diameter = 48;
      } else if (count > 15) {
        sizeClass = 'cluster-medium';
        diameter = 42;
      }

      return L.divIcon({
        html: `
          <div class="custom-cluster-badge ${sizeClass}" style="width: ${diameter}px; height: ${diameter}px;">
            <span class="cluster-count">${count}</span>
          </div>
        `,
        className: 'custom-cluster-icon',
        iconSize: L.point(diameter, diameter),
      });
    },
  });
}
```

```css
/* client/src/styles/map.css */
.custom-cluster-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 700;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease-in-out;
}

.custom-cluster-badge:hover {
  transform: scale(1.10);
}

.cluster-small {
  background: radial-gradient(circle, #f97316 0%, #ea580c 100%);
  border: 2px solid #ffffff;
  font-size: 13px;
}

.cluster-medium {
  background: radial-gradient(circle, #e11d48 0%, #be123c 100%);
  border: 2.5px solid #ffffff;
  font-size: 14px;
}

.cluster-large {
  background: radial-gradient(circle, #7c3aed 0%, #6d28d9 100%);
  border: 3px solid #ffffff;
  font-size: 15px;
}
```

---

### 5.3 Custom SVG `DivIcon` Category Pins with Verification Overlays
Standard Leaflet default blue pins do not indicate vendor trade categories. GaliGuide renders high-DPI custom SVG pins that incorporate category-specific colors and an overlaid green verification badge.

```typescript
// client/src/components/map/CategoryMarker.ts

import L from 'leaflet';

export interface CategoryMarkerProps {
  id: string;
  name: string;
  categoryColor: string;
  isVerified: boolean;
}

export function createCategoryIcon(props: CategoryMarkerProps): L.DivIcon {
  const { categoryColor, isVerified } = props;

  const verifiedBadgeHtml = isVerified
    ? `
      <div style="position: absolute; top: -3px; right: -3px; width: 14px; height: 14px; background-color: #10b981; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    `
    : '';

  const svgPinHtml = `
    <div style="position: relative; width: 32px; height: 42px; cursor: pointer;">
      <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 27.5 16 42 16 42C16 42 32 27.5 32 16C32 7.163 24.837 0 16 0Z" fill="${categoryColor}" filter="drop-shadow(0px 3px 3px rgba(0,0,0,0.3))"/>
        <circle cx="16" cy="16" r="8" fill="#ffffff"/>
      </svg>
      ${verifiedBadgeHtml}
    </div>
  `;

  return L.divIcon({
    html: svgPinHtml,
    className: 'category-pin-divicon',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38],
  });
}
```

---

### 5.4 Leaflet Heatmap Layer (`leaflet.heat`) Integration
Visualizes high-density informal commercial hubs (e.g. Sarafa nighttime food cluster, Rajwada cloth and flower stalls) using a 5-tier density gradient.

```typescript
// client/src/components/map/HeatmapOverlay.tsx

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapOverlayProps {
  map: L.Map | null;
  points: [number, number, number][]; // [lat, lng, intensity]
  visible: boolean;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ map, points, visible }) => {
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    if (!visible) {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      return;
    }

    if (heatLayerRef.current) {
      heatLayerRef.current.setLatLngs(points);
    } else {
      heatLayerRef.current = (L as any).heatLayer(points, {
        radius: 28,
        blur: 18,
        maxZoom: 17,
        max: 1.0,
        minOpacity: 0.35,
        gradient: {
          0.2: '#3b82f6', // Low density: Blue
          0.4: '#10b981', // Moderate density: Emerald
          0.6: '#f59e0b', // High density: Amber
          0.8: '#ef4444', // Very high density: Red
          1.0: '#7c3aed', // Extreme hotspot: Purple
        },
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, points, visible]);

  return null;
};
```

---

### 5.5 Admin Interactive Coordinate Picker (Click & Draggable Marker)
Enables municipal field officers to pinpoint informal street cart locations down to ~1 meter precision:

```typescript
// client/src/components/admin/MapCoordinatePicker.tsx

import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapCoordinatePickerProps {
  initialLat: number;
  initialLng: number;
  onCoordinatesChange: (lat: number, lng: number) => void;
}

export const MapCoordinatePicker: React.FC<MapCoordinatePickerProps> = ({
  initialLat,
  initialLng,
  onCoordinatesChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
      autoPan: true,
    }).addTo(map);

    const updatePosition = (lat: number, lng: number) => {
      const roundedLat = parseFloat(lat.toFixed(6));
      const roundedLng = parseFloat(lng.toFixed(6));
      setCoords({ lat: roundedLat, lng: roundedLng });
      onCoordinatesChange(roundedLat, roundedLng);
    };

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      updatePosition(position.lat, position.lng);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      updatePosition(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium text-gray-700">
        <span>Click map or drag pin to position cart</span>
        <span className="font-mono bg-gray-100 px-2.5 py-1 rounded text-xs text-gray-900 border border-gray-200">
          {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
        </span>
      </div>
      <div
        ref={mapContainerRef}
        className="h-72 w-full rounded-lg border border-gray-300 shadow-sm"
      />
    </div>
  );
};
```

---

### 5.6 External Google Maps Directions & Direct Call Deep Links

```typescript
// client/src/utils/navigation.ts

/**
 * Generates zero-cost Google Maps turn-by-turn walking direction link.
 *
 * @param destinationLat Latitude of the vendor
 * @param destinationLng Longitude of the vendor
 * @param userLat Optional current user latitude
 * @param userLng Optional current user longitude
 * @returns Direct URL string
 */
export function getGoogleMapsNavigationUrl(
  destinationLat: number,
  destinationLng: number,
  userLat?: number,
  userLng?: number
): string {
  if (userLat !== undefined && userLng !== undefined) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}&travelmode=walking`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}&travelmode=walking`;
}

/**
 * Generates sanitized direct device telephone dialer URI.
 *
 * @param phoneNumber E.164 phone string
 * @returns tel: URI
 */
export function getTelUri(phoneNumber: string): string {
  const sanitized = phoneNumber.replace(/[^0-9+]/g, '');
  return `tel:${sanitized}`;
}
```

---

## 6. Monorepo Organization, Environment Configuration & Operational Invariants

### 6.1 Directory Organization
```
galiguide/
├── package.json                   # Root monorepo workspace configuration
├── .env.example                   # Master environment variable template
├── README.md                      # Project setup and operational documentation
├── docs/                          # Architectural and Product Specifications
│   ├── PRD.md                     # Comprehensive Refined PRD (Milestone 1)
│   ├── TECHNICAL_DESIGN.md        # Technical Architecture & API Specifications (Milestone 2)
│   ├── IMPLEMENTATION_ROADMAP.md  # Phased Execution Roadmap (Milestone 3)
│   ├── VERIFICATION_RUBRIC.md     # 14-Point Acceptance Verification Matrix (Milestone 3)
│   └── PRODUCTION_SPECIFICATION.md# Master Unified Specification (Milestone 4)
├── client/                        # React 18 + Vite Frontend Application
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx               # Client entry point
│       ├── App.tsx                # Layout scaffolding and modal coordinator
│       ├── api/                   # Axios HTTP client wrappers
│       ├── components/
│       │   ├── common/            # Header, SearchBar, CategoryChips, Modal, Badge
│       │   ├── map/               # LeafletMap, ClusterLayer, HeatmapOverlay, CategoryMarker
│       │   ├── vendor/            # VendorCard, VendorDetailDrawer, VendorList
│       │   └── admin/             # LoginForm, VendorTable, VendorForm, MapCoordinatePicker
│       ├── hooks/                 # useGeolocation, useVendors, useCategories, useAdminAuth
│       ├── pages/                 # PublicDiscoveryPage, AdminDashboardPage, AdminLoginPage
│       ├── types/                 # Shared TypeScript interfaces
│       └── utils/                 # haversine.ts, navigation.ts, formatters.ts
└── server/                        # Node.js + Express REST API Server
    ├── package.json
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma          # PostgreSQL relational schema
    │   ├── migrations/            # Generated SQL migrations
    │   └── seed.ts                # Realistic Indore vendor dataset seed script
    └── src/
        ├── app.ts                 # Express application & middleware assembly
        ├── server.ts              # HTTP listener bootstrap
        ├── config/                # Environment variables loader
        ├── controllers/           # vendor.controller.ts, category.controller.ts, admin.controller.ts
        ├── middleware/            # auth.middleware.ts, validate.middleware.ts, errorHandler.ts
        ├── routes/                # vendor.routes.ts, category.routes.ts, admin.routes.ts
        ├── schemas/               # Zod validation schemas
        ├── services/              # spatial.service.ts, vendor.service.ts, auth.service.ts
        └── types/                 # Domain and Express types
```

---

### 6.2 Environment Configuration Manifest

#### `server/.env`
```env
# Database Connection (PostgreSQL 15+)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/galiguide_db?schema=public"

# HTTP Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET="galiguide-production-jwt-token-secret-at-least-64-characters-long-indore-2026"
JWT_EXPIRES_IN="24h"

# CORS Configuration
CLIENT_ORIGIN="http://localhost:5173"
```

#### `client/.env`
```env
# API Gateway Target
VITE_API_BASE_URL="http://localhost:5000/api"

# Default Map View Center (Rajwada, Indore)
VITE_DEFAULT_MAP_LAT=22.7196
VITE_DEFAULT_MAP_LNG=75.8577
VITE_DEFAULT_MAP_ZOOM=14
```

---

### 6.3 Architectural Invariants & Non-Functional Guarantees

| Invariant | Specification Requirement | Architectural Guarantee |
|---|---|---|
| **Zero-Cost Geospatial** | No paid Google Maps / Mapbox API consumption | OpenStreetMap raster tiles + client-side Canvas clustering/heatmaps + native deep linking to `google.com/maps/dir/`. Zero API key dependencies. |
| **Micro-Location Precision** | Accurate to ~1 meter for informal carts in narrow galis | IEEE 754 64-bit `DOUBLE PRECISION` coordinates with 6-decimal-place rounding (~11 cm resolution). |
| **Bounding-Box Speed** | Sub-50ms query response under 10,000+ vendors | Two-tier query engine: B-Tree `[latitude, longitude]` range scan pruning 99% of rows before evaluating trigonometric distance. |
| **Graceful Degradation** | Zero unhandled crashes when location access is denied | Integrated fallback state machine routing to `/api/areas` with pre-indexed Indore centroids (Sarafa, Chappan Dukan, Rajwada). |
| **Vendor Privacy Safeguards**| Respect informal vendor telephone consent | Strict backend enforcement of `isPhonePublic`: phone numbers are masked to `null` unless explicit consent is recorded. |
| **Admin Audit Trail** | Tamper-evident governance | Automated append-only logging in `audit_logs` tracking administrator ID, action, state snapshot, and verification timestamp. |

---
*End of Technical Architecture, Database Schema & API Specification.*
