---
title: "GaliGuide Backend Services & API Architecture Audit"
document_id: "AUDIT-02-BACKEND-2026"
version: "1.0.0"
status: "PRODUCTION_VERIFIED"
classification: "AI_INGESTIBLE_AUDIT"
last_audit_timestamp: "2026-11-15T14:58:00Z"
target_system: "Express.js REST API & Serverless Function"
entrypoints:
  - "server/src/app.ts (Express Application Configuration)"
  - "server/src/server.ts (Standalone Node HTTP Server, Port 5000)"
  - "api/index.ts (Vercel Serverless Function Wrapper)"
---

# 2. Backend Services & API Architecture Audit

## 2.1 Service Overview & Runtime Lifecycle
The GaliGuide backend is implemented in TypeScript using Express.js. It operates in a dual runtime configuration:
1. **Local Development Runtime:** Standalone HTTP listener via `server/src/server.ts` listening on port `PORT` (default: `5000`).
2. **Serverless Production Runtime:** Serverless lambda export via `api/index.ts`, wrapping `server/src/app.ts` to handle incoming `/api/*` rewrites directly on Vercel's global edge network.

```
Incoming Request -> [Helmet / Security Headers]
                 -> [CORS Guard (Single-Domain)]
                 -> [Request ID Normalizer: req_<uuid>]
                 -> [Express JSON Parser (5mb limit)]
                 -> [Express URL Encoded Parser]
                 -> [Router: /api and /api/v1]
                 -> [Auth Middleware / JWT Verify]
                 -> [Controller Handler]
                 -> [Prisma Client <-> Neon PostgreSQL]
                 -> [Standardized JSON Envelope / Error Envelope]
```

---

## 2.2 Middleware Pipeline & Error Envelope Architecture

Located in `server/src/app.ts` (lines 41–83), the Express pipeline enforces uniform security, request tracing, and structured response encapsulation:

### 1. Request ID Normalization & Context Tracing
- File: `server/src/shared/utils/request-id.ts`
- Every incoming request is inspected for `x-request-id`. If missing or invalid, a new cryptographically secure identifier is generated:
  ```typescript
  export function normalizeRequestId(incomingId?: string | string[]): string {
    if (typeof incomingId === 'string' && incomingId.trim().length > 0) {
      return incomingId.trim();
    }
    return `req_${randomUUID()}`;
  }
  ```
- The normalized ID is bound to `req.headers['x-request-id']` and returned in response headers for distributed tracing.

### 2. Standardized Error Hierarchy & Envelope
- File: `server/src/shared/errors/app-error.ts`
- Subclasses:
  - `BadRequestError` (400)
  - `ValidationError` (400)
  - `UnauthorizedError` (401)
  - `ForbiddenError` (403)
  - `NotFoundError` (404)
  - `ConflictError` (409)
  - `UnprocessableEntityError` (422)
  - `RateLimitError` (429)
  - `ServiceUnavailableError` (503)
- Global Error Handler (`server/src/app.ts:71-83`) ensures no uncaught exceptions leak stack traces in production:
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid email or password"
    },
    "requestId": "req_550e8400-e29b-41d4-a716-446655440000"
  }
  ```

---

## 2.3 REST Endpoints & Route Definitions

All routes are mounted uniformly on both `/api` and `/api/v1` via `server/src/routes/api.routes.ts`:

### Public Discovery Endpoints (Zero Authentication Required)
| Method | Endpoint | Query Parameters | Description | Status Code |
|--------|----------|------------------|-------------|-------------|
| `GET` | `/health` | none | Health check returning status and timestamp. | `200 OK` |
| `GET` | `/api/categories` | none | Lists all active categories with attached live vendor counts. | `200 OK` |
| `GET` | `/api/areas` | none | Lists 10 Indore commercial localities with geospatial bounding boxes. | `200 OK` |
| `GET` | `/api/vendors` | `category`, `search`, `areaId`, `lat`, `lng`, `radiusKm`, `page`, `limit` | Hyperlocal vendor search with bilingual matching, Haversine sorting, and privacy masking. | `200 OK` |
| `GET` | `/api/vendors/:id` | none | Full vendor profile with 7-day schedule, landmark guidance, and universal directions link. | `200 OK` / `404` |
| `GET` | `/api/vendors/heatmap` | `categoryId` (optional) | Density heatmap coordinate array `[[lat, lng, intensity], ...]` for verified vendors. | `200 OK` |

### Administrative Governance Endpoints (JWT Guarded)
| Method | Endpoint | Required Role | Description | Status Code |
|--------|----------|---------------|-------------|-------------|
| `POST` | `/api/admin/auth/login` | Public | Authenticates admin using bcrypt; returns 24-hour JWT bearer token. | `200 OK` / `401` |
| `GET` | `/api/admin/auth/me` | `ADMIN`, `SUPER_ADMIN` | Returns authenticated admin user profile from token context. | `200 OK` / `401` |
| `GET` | `/api/admin/vendors` | `ADMIN`, `SUPER_ADMIN` | Full directory with unmasked phones, audit status, and filter parameters. | `200 OK` / `401` |
| `POST` | `/api/admin/vendors` | `ADMIN`, `SUPER_ADMIN` | Onboards vendor with 7-day schedule and writes immutable `AuditLog` row. | `201 Created` / `400` |
| `PUT` | `/api/admin/vendors/:id` | `ADMIN`, `SUPER_ADMIN` | Updates vendor details and schedule with change audit logging. | `200 OK` / `404` |
| `PATCH`| `/api/admin/vendors/:id/verify`| `ADMIN`, `SUPER_ADMIN`| Transitions verification status (`VERIFIED`, `REJECTED`, `SUSPENDED`) with reason. | `200 OK` / `403` |
| `DELETE`| `/api/admin/vendors/:id`| `SUPER_ADMIN` | Deletes vendor listing with cascading removal of hours and audit records. | `200 OK` / `403` |

---

## 2.4 Mathematical Haversine Geodesy Engine

The spatial search engine (`server/src/lib/haversine.ts`) executes high-precision spherical geodesy without requiring PostGIS database extensions (ADR 0005):

### Mathematical Formulation
$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right)$$
$$d = R \cdot c \quad \text{where } R = 6371.0 \text{ km}$$

### Code Implementation (`server/src/lib/haversine.ts:25-38`)
```typescript
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_KM * c * 1000) / 1000; // Rounded to 3 decimals (1 meter)
}
```

### Bounding Box Pre-Filtering
To avoid executing full-table trigonometric calculations across thousands of vendors, queries utilize coordinate deltas (`deltaLat = radiusKm / 111.045` and `deltaLng = radiusKm / (111.045 * cos(lat))`), querying PostgreSQL via B-Tree indexes on `[latitude, longitude]`.

---

## 2.5 Privacy Protection & DPDP Phone Masking Engine

In compliance with India's DPDP Act, contact numbers for informal vendors are strictly protected (`server/src/shared/utils/redaction.ts` and `server/src/controllers/vendor.controller.ts:50-65`):

```typescript
// Double-Gate Consent Check in Vendor Controller
const hasPublicPhone = vendor.consentObtained && vendor.isPhonePublic;

return {
  ...vendor,
  contactPhone: hasPublicPhone ? vendor.contactPhone : null,
  whatsappPhone: hasPublicPhone ? vendor.whatsappPhone : null,
  phone: hasPublicPhone ? vendor.contactPhone : null,
  telUri: hasPublicPhone ? `tel:${vendor.contactPhone}` : null,
  phoneMasked: vendor.contactPhone ? maskPhoneNumber(vendor.contactPhone) : null,
  navigationUrl: `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}&travelmode=walking`,
};
```

When `hasPublicPhone` is false:
1. `contactPhone`, `whatsappPhone`, `phone`, and `telUri` are nullified.
2. `phoneMasked` outputs `+91 98XXX-XX123` via regex masking.
3. The client suppresses the dialer button and displays *"In-Person Visit Only"*.

---

## 2.6 Dynamic Schedule & Midnight Rollover Evaluation

Informal street corridors in Indore (notably Sarafa Night Food Market) operate shifts spanning midnight (e.g., 18:00 to 01:30 next morning). The backend dynamic evaluator handles midnight rollover:

```typescript
function evaluateIsOpenNow(operatingHours: OperatingHour[]): { isOpenNow: boolean; nextOpeningTime?: string } {
  const now = new Date();
  const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayHours = operatingHours.find((h) => h.dayOfWeek === dayOfWeek);
  if (!todayHours || todayHours.isClosed) return { isOpenNow: false };

  const [openH, openM] = todayHours.openTime.split(':').map(Number);
  const [closeH, closeM] = todayHours.closeTime.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (closeMinutes < openMinutes) {
    // Overnight shift: open if current time is after open OR before close
    const isOpen = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    return { isOpenNow: isOpen };
  }

  return { isOpenNow: currentMinutes >= openMinutes && currentMinutes <= closeMinutes };
}
```

---

## 2.7 Prisma Schema & Relational Models

Defined in `server/prisma/schema.prisma`, the database features 6 normalized models with foreign key cascades and composite performance indexes:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model AdminUser {
  id           String     @id @default(uuid())
  email        String     @unique
  passwordHash String
  name         String
  role         String     @default("ADMIN") // ADMIN, SUPER_ADMIN
  isActive     Boolean    @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  auditLogs    AuditLog[]

  @@map("admin_users")
}

model Category {
  id           String   @id @default(uuid())
  name         String   @unique
  slug         String   @unique
  description  String?
  icon         String   @default("Store")
  color        String   @default("#9d3e1c")
  displayOrder Int      @default(0)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  vendors      Vendor[]

  @@index([isActive, displayOrder])
  @@map("categories")
}

model Area {
  id           String   @id @default(uuid())
  name         String   @unique
  slug         String   @unique
  pincode      String?
  latitude     Float
  longitude    Float
  boundsMinLat Float?
  boundsMaxLat Float?
  boundsMinLng Float?
  boundsMaxLng Float?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  vendors      Vendor[]

  @@index([latitude, longitude])
  @@map("areas")
}

model Vendor {
  id               String          @id @default(uuid())
  name             String
  hindiName        String?
  description      String?
  contactPhone     String?
  whatsappPhone    String?
  latitude         Float
  longitude        Float
  landmark         String
  addressLine      String?
  stallType        String          @default("PUSH_CART") // PUSH_CART, KIOSK, GROUND_MAT, ROAMING
  isApproximateLoc Boolean         @default(false)
  status           String          @default("PENDING") // PENDING, VERIFIED, REJECTED, SUSPENDED
  operatingStatus  String          @default("ACTIVE")
  isVerified       Boolean         @default(false)
  verifiedAt       DateTime?
  consentObtained  Boolean         @default(false)
  isPhonePublic    Boolean         @default(false)
  categoryId       String
  category         Category        @relation(fields: [categoryId], references: [id])
  areaId           String?
  area             Area?           @relation(fields: [areaId], references: [id])
  operatingHours   OperatingHour[]
  auditLogs        AuditLog[]
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  @@index([status, categoryId])
  @@index([latitude, longitude])
  @@index([areaId])
  @@index([name])
  @@map("vendors")
}

model OperatingHour {
  id        String  @id @default(uuid())
  vendorId  String
  vendor    Vendor  @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  dayOfWeek String  // MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
  openTime  String  // HH:MM
  closeTime String  // HH:MM
  isClosed  Boolean @default(false)

  @@unique([vendorId, dayOfWeek])
  @@map("operating_hours")
}

model AuditLog {
  id        String     @id @default(uuid())
  vendorId  String?
  vendor    Vendor?    @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  adminId   String
  admin     AdminUser  @relation(fields: [adminId], references: [id])
  action    String     // CREATE, UPDATE, VERIFY, REJECT, SUSPEND, DELETE
  reason    String?
  snapshot  String?
  ipAddress String?
  createdAt DateTime   @default(now())

  @@index([vendorId, createdAt])
  @@index([adminId])
  @@map("audit_logs")
}
```

---

## 2.8 Verification Evidence & Test Execution

### 1. Backend Unit Test Suite (Pure Logic)
- Command: `npx jest --config server/jest.config.js server/__tests__/unit`
- Results: **3 Suites Passed, 23/23 Tests Passed (100% Success)**
  - `haversine.test.ts`: Palasia Square to Johny Hot Dog = 0.43km, zero distance, Sarafa to Rajwada distance, bounding box deltas, formatDistance formatting.
  - `shared-errors.test.ts`: AppError status codes, BadRequest, Unauthorized, Forbidden, NotFound, RateLimit envelopes.
  - `shared-utils.test.ts`: normalizeRequestId prefixing and validation, maskPhoneNumber formats, database connection string redaction, recursive payload scrubbing.

### 2. Live Acceptance Criteria Suite (`scripts/verify_galiguide.ps1`)
- Verified against production endpoint `https://galiguide-saranshlab.vercel.app`:
  - `TC-01`: Public categories retrieved (10) & filtered by cobbler (2) [PASS]
  - `TC-02`: Bilingual partial search matched English ('Joshi Dahi Bada') and Devanagari ('Ramu Mochi') [PASS]
  - `TC-03`: Dual view data provider verified: 22 total vendors accessible [PASS]
  - `TC-04`: Vendor detail profile verified: Babu Lal Puncture Thela with landmark & 7 schedule records [PASS]
  - `TC-05`: Device dialer protocol verified with E.164 phone (`tel:+919826012345`) [PASS]
  - `TC-06`: Zero-cost external Google Maps direction URL verified [PASS]
  - `TC-07`: Admin JWT security guard verified (401 on unauth, valid token issued on login, 200 on authorized) [PASS]
  - `TC-08`: Full CRUD lifecycle verified (Create -> Read -> Update -> Delete) [PASS]
  - `TC-09`: Coordinate picker spatial constraints verified [PASS]
  - `TC-10`: Verification toggle verified with audit log [PASS]
  - `TC-11`: Geolocation denial fallback localities verified (10 Indore areas) [PASS]
  - `TC-12`: Approximate/roaming thela safeguards verified (`isApproximateLoc=True`, `stallType=PUSH_CART`) [PASS]
  - `TC-13`: Privacy safeguard verified (Unconsented phone strictly masked/null in public API) [PASS]
  - `TC-14`: Spatial geodesy verified: Haversine distance accurate (0.431 km) & Heatmap generated (22 points) [PASS]
