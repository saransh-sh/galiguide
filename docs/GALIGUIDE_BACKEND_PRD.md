# GaliGuide — Backend Product Requirements Document

**Document:** Backend PRD  
**Version:** 1.0  
**Status:** Approved & Implemented  
**Product:** GaliGuide (Hyperlocal Informal Vendor Discovery & Navigation System)  
**Target Region:** Indore, Madhya Pradesh  
**Target Scale:** 10,000+ informal vendors across 85 municipal wards  
**Zero-Cost Constraint:** Strict 0 paid Google Maps API consumption  
**Primary Backend Stack:** Node.js + Express + TypeScript  
**Database:** Neon Serverless PostgreSQL (aws-eu-central-1, pooled)  
**ORM:** Prisma ORM  
**Architecture:** Modular Monolith (Vercel Serverless Functions)  
**Frontend Contract:** React Single Page Application (`client/`)

---

## 1. Backend Product Definition

The GaliGuide backend is the authoritative discovery, geospatial, and administration API for Indore's informal vendor economy.

The backend is responsible for:
- Vendor profile lifecycle (thelas, gumtis, phads, roaming vendors);
- 7-day operating schedule computation and real-time open/closed status;
- Pure mathematical spatial geodesy (Haversine formula & bounding-box filtering);
- Bilingual search indexing across English and Devanagari Hindi;
- Privacy-first phone masking for vendors without explicit publication consent;
- Municipal Ward Lead and Super Admin authentication via JWT and bcrypt;
- Append-only administrative audit logging for all mutations;
- Zero-cost universal navigation URL generation (`/maps/dir/?api=1&destination=lat,lng`);
- REST API contracts consumed by the public explorer and administrative portal.

---

## 2. Core Functional Requirements

### FR-01: Hyperlocal Discovery & Filtering
- `GET /api/vendors`: Paginated list of vendors supporting filters by `category`, `areaId`, `search` (bilingual query `q`), and `status`.
- Response includes `id`, `name`, `hindiName`, `description`, `lat`, `lng`, `landmark`, `popularItems`, `category`, `area`, `operatingSchedules`, and `isOpenNow` indicator.

### FR-02: Spatial Proximity & Heatmap Calculation
- `GET /api/vendors/nearby`: Proximity search accepting `lat`, `lng`, and `radius` (in kilometers).
- Filters candidates within coordinate bounding box, then calculates exact Haversine distance.
- Returns results sorted in ascending distance order with formatted distance string (e.g. `250 m` or `1.4 km`).
- Returns raw coordinate pairs for heatmap density rendering.

### FR-03: Bilingual Search Engine
- Evaluates queries against `name`, `hindiName`, `description`, and `popularItems`.
- Handles Devanagari script seamlessly without requiring external translation microservices.

### FR-04: Privacy Phone Protection
- If `hasConsentForPhone = false`, public responses mask phone numbers as `+91 98XXX-XX123`.
- Unmasked numbers are strictly restricted to authenticated `ADMIN` and `SUPER_ADMIN` sessions.

### FR-05: Administrative Management & Audit
- `POST /api/admin/auth/login`: Issue signed JWT access tokens for municipal ward leads.
- Full CRUD for vendor records (`POST`, `PUT`, `DELETE`).
- `PATCH /api/admin/vendors/:id/status`: Toggle `isVerified` status with mandatory `verificationReason`.
- Every mutation creates a row in `AuditLog` capturing `action`, `entityId`, `userId`, `details`.

---

## 3. Data Contracts & Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Vendor {
  id                 String              @id @default(uuid())
  name               String
  hindiName          String
  slug               String              @unique
  description        String?
  lat                Float
  lng                Float
  landmark           String?
  phone              String?
  hasConsentForPhone Boolean             @default(false)
  isApproximateLoc   Boolean             @default(false)
  isVerified         Boolean             @default(false)
  verificationReason String?
  categoryId         String
  category           Category            @relation(fields: [categoryId], references: [id])
  areaId             String?
  area               Area?               @relation(fields: [areaId], references: [id])
  popularItems       String?
  operatingSchedules OperatingSchedule[]
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
}
```

---

## 4. Non-Functional Requirements

- **Latency:** Spatial proximity queries must resolve in $< 80\text{ ms}$ under pooled Neon connections.
- **Precision:** Coordinates must maintain 6-decimal-place float precision ($\approx 0.11\text{ meter}$ accuracy).
- **Security:** Passwords salted and hashed with bcrypt (salt rounds $\ge 10$); JWT access tokens validated on every admin route.
- **Zero Google Maps Cost:** Zero calls to Google Maps Platform APIs; all spatial math executed natively.
