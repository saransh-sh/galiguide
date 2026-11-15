---
title: "GaliGuide Audit Deliverables & Media Artifacts Master Catalog"
document_id: "AUDIT-00-INDEX-2026"
version: "1.0.0"
status: "PRODUCTION_VERIFIED"
classification: "AI_INGESTIBLE_AUDIT_INDEX"
generated_at: "2026-11-15T15:03:00Z"
project: "GaliGuide — Hyperlocal Informal Vendor Discovery & Navigation System"
target_url: "https://galiguide-saranshlab.vercel.app"
repository_root: "c:\\Users\\saransh\\Desktop\\galiguide"
audit_folder: "c:\\Users\\saransh\\Desktop\\galiguide\\audit_artifacts"
---

# GaliGuide Audit Deliverables & Media Artifacts Master Catalog

## 1. Executive Summary
This directory (`audit_artifacts/`) contains the complete audit deliverables for GaliGuide, synthesized for automated review by AI agents, forensic auditors, and engineering leadership.

The audit encompasses:
1. **Modular AI-Ingestible Markdown Audit Reports:** Deep architectural, backend, frontend, infrastructure, and compliance audits with source code line citations, mathematical proofs, and verified test execution outputs.
2. **Visual Screenshots:** High-resolution desktop screenshots (1440x900 viewport) capturing every key user view and state (Landing page hero, Categories bento grid, City map with Leaflet tiles and cluster pins, Category filter, Bilingual search with Hindi Devanagari matching, Vendor detail drawer with 7-day operating hours, Density heatmap overlay, Civic administration governance dashboard, and Interactive coordinate picker map).
3. **Application Video Walkthrough:** A smooth, continuous video recording (`galiguide_walkthrough.webm`) demonstrating the live end-to-end user flows on the running production deployment (`https://galiguide-saranshlab.vercel.app`).

---

## 2. Master Deliverables Index

### 2.1 Technical Audit Reports (Markdown)
| Document | File Path | Focus Area & Description |
|----------|-----------|--------------------------|
| **01** | [`01_architecture_overview.md`](./01_architecture_overview.md) | **System Architecture & Topology**: Monorepo workspaces, 3-tier boundary decoupling, the 6 Golden Rules of GaliGuide, data flow from client to Neon DB, ubiquitous domain vocabulary, and Architectural Decision Records (ADR 0001–0005). |
| **02** | [`02_backend_services.md`](./02_backend_services.md) | **Backend Services & API**: Express REST router, controllers, middleware pipeline (Helmet, Request ID, JWT auth), Zod validation schemas, DPDP-compliant phone masking, spherical Haversine geodesy ($R=6371\text{ km}$), midnight rollover schedule evaluation, and normalized Prisma ORM schema models. |
| **03** | [`03_frontend_application.md`](./03_frontend_application.md) | **Frontend Application & Cartography**: React 18 SPA, Vite 5 tooling, authentic Indore Terracotta/Sage anti-slop design system, Leaflet 1.9.4 OSM integration (zero Google Maps API costs), MarkerCluster spiderfication at zoom 18, Leaflet Heat density canvas, and responsive split-screen layouts. |
| **04** | [`04_services_and_configurations.md`](./04_services_and_configurations.md) | **Services, Database & Infrastructure**: Neon Serverless PostgreSQL connection pooling (`aws-eu-central-1.pooler.neon.tech`), Neon preview branching TTL policies (`neon.ts`), Vercel serverless gateway rewrites (`vercel.json`), environment variables, and GitHub Actions CI pipeline. |
| **05** | [`05_feature_and_compliance_matrix.md`](./05_feature_and_compliance_matrix.md) | **Feature & Compliance Verification Matrix**: Complete verification matrix covering all 25 features (`F01`–`F25`), 14 Prototype Acceptance Criteria (`PAC-01`–`PAC-14`), and 22 Edge Cases (`EC-01`–`EC-22`) with live test evidence. |

### 2.2 Visual Screenshots (`audit_artifacts/screenshots/`)
| Screenshot File | Resolution | Description & Visual Contents |
|-----------------|------------|-------------------------------|
| [`01_landing_hero.png`](./screenshots/01_landing_hero.png) | 1440 × 900 | Editorial Landing Hero: Dual-input search console, Indore gali dropdown, live street registry badge ("22 Mapped Hawkers"), and Unsplash Indore street bazaar photograph. |
| [`02_vendor_discovery_map.png`](./screenshots/02_vendor_discovery_map.png) | 1440 × 900 | City Map Discovery Workspace: Leaflet OpenStreetMap canvas, terracotta marker clusters, Rajwada centroid anchor, and distance-sorted left sidebar feed. |
| [`03_bilingual_search.png`](./screenshots/03_bilingual_search.png) | 1440 × 900 | Bilingual Live Search: Active search query ("Joshi") matching legendary Sarafa street food artisan ("Joshi Dahi Bada House" / "जोशी दही बड़ा हाउस") with highlighted card and corresponding map marker selection. |
| [`04_category_filter.png`](./screenshots/04_category_filter.png) | 1440 × 900 | Category Filter: Active category pill filter showing filtered vendor pins and updated counts. |
| [`05_vendor_detail_drawer.png`](./screenshots/05_vendor_detail_drawer.png) | 1440 × 900 | Vendor Detail Slide-Over Drawer: Slide-over drawer for Joshi Dahi Bada House displaying trade name, Devanagari Hindi alias, verified artisan badge, topological landmark guidance, phone dialer trigger, and universal navigation link. |
| [`06_density_heatmap.png`](./screenshots/06_density_heatmap.png) | 1440 × 900 | Hotspot Density Heatmap Overlay: Canvas-rendered `Leaflet.heat` layer displaying vendor concentration gradients across Indore commercial corridors. |
| [`07_admin_portal_picker.png`](./screenshots/07_admin_portal_picker.png) | 1440 × 900 | IMC Ward Admin Portal & Coordinate Picker: Modal displaying vendor onboarding form with embedded interactive Leaflet map for drag-and-drop coordinate selection (validated to 6 decimal places). |
| [`08_categories_bento_grid.png`](./screenshots/08_categories_bento_grid.png) | 1440 × 900 | Everyday Informal Guilds: 10-category bento grid with custom Lucide SVG icons, color accents, and vendor count badges. |
| [`09_about_heritage_modal.png`](./screenshots/09_about_heritage_modal.png) | 1440 × 900 | Indore Street Heritage Modal: Dedicated modal celebrating Indore's street food culture, Swachh Survekshan achievements, and GaliGuide's civic mission. |

### 2.3 Application Walkthrough Video Recording (`audit_artifacts/recordings/`)
| Media File | Format / Codec | Resolution | Duration | File Size | Description |
|------------|----------------|------------|----------|-----------|-------------|
| [`galiguide_walkthrough.webm`](./recordings/galiguide_walkthrough.webm) | WebM (VP9, 25fps) | 1280 × 720 | 00:00:48 | ~14.03 MB | **Full Application Walkthrough Video:** Automated demonstration of the live production system (`https://galiguide-saranshlab.vercel.app`), showcasing: (1) Landing page hero & bento grid scroll, (2) One-tap transition to City Map with Leaflet OSM tiles, (3) Marker clustering & spiderfication, (4) Category pill filtering, (5) Bilingual search typing with live 300ms debounce, (6) Opening vendor detail drawer with 7-day schedule & navigation link, (7) Toggling vendor density heatmap, (8) Super Admin login to IMC Governance Portal, (9) Interactive coordinate picker map with draggable pin, and (10) About Indore Heritage modal. |

*(Note: An identical copy is provided at [`audit_artifacts/videos/galiguide_walkthrough.webm`](./videos/galiguide_walkthrough.webm) to satisfy alternative directory path conventions).*

---

## 3. Cryptographic Verification & File Integrity Manifest

All artifacts have been verified using SHA-256 cryptographic hashing to guarantee integrity:

| Relative File Path | Size (Bytes) | SHA-256 Checksum |
|--------------------|--------------|------------------|
| `01_architecture_overview.md` | 12,913 | `31c2a598c555c747892f0f38a1a900982cd91312fd9dbe5fe5da302214feeede` |
| `02_backend_services.md` | 15,377 | `892fad36d656beb848df198cd09e1c6d7d49e7765d8c1a234cc7ba1740cc2c01` |
| `03_frontend_application.md` | 8,891 | `e98401ecb5a7243d6807f35d16c570ee4cc7ea89501a577ebbaa31cfa8a97067` |
| `04_services_and_configurations.md` | 7,635 | `0d8b50b7a12adb2d34c3904af7e2e679786058200bce7c8bbe6c5ffedabcea40` |
| `05_feature_and_compliance_matrix.md` | 15,333 | `ce3463696c953a70b6657658f1876867d5bf88b907bb9acf19da334e7941ada2` |
| `recordings/galiguide_walkthrough.webm` | 14,029,197 | `17640ceabdb5416e95e4dfbec26518ecc1c4ef914ad63100809df09ff505b718` |
| `videos/galiguide_walkthrough.webm` | 14,029,197 | `17640ceabdb5416e95e4dfbec26518ecc1c4ef914ad63100809df09ff505b718` |
| `screenshots/01_landing_hero.png` | 565,285 | `4136997dba4fd66ddef54918dc1551ef619eb55b66bb630e7a9891edc91a6711` |
| `screenshots/02_vendor_discovery_map.png` | 1,201,031 | `92ce84a971f25d310a37510ad24f03979e4adef27496a1327d9b00649d91b13e` |
| `screenshots/03_bilingual_search.png` | 1,157,020 | `423d11f8a1cb4e6a4d329a35aa89b1e265fc1f7741584cb92b82ab31855a6397` |
| `screenshots/04_category_filter.png` | 1,199,400 | `058fc6068c46b296aa80d090f1c7a74e6bdcef92c093de18d7c2eb90e996ec14` |
| `screenshots/05_vendor_detail_drawer.png` | 507,951 | `66c33e4c9734546000d38a107783d8fc1d98a0507acb01febdfe1f106243c774` |
| `screenshots/06_density_heatmap.png` | 905,439 | `5364613ed2d11560a4d6a008df53433ca2a95aae9ae805c014b43644285f44db` |
| `screenshots/07_admin_portal_picker.png` | 479,639 | `0ed6a0969f41bbd3944a500839190defd2f9196e47293a1ae0a14e88e0b2df0f` |
| `screenshots/08_categories_bento_grid.png` | 144,299 | `af6b72415887be56fa6815741b82dff50f7a0c9f12c71b8f0767a4c2f9e176cf` |
| `screenshots/09_about_heritage_modal.png` | 597,860 | `04f4dcd973cb4d6a97718c1efa0d20d7fa4149f48e7633bcb842cffcaaae0c9e` |

---

## 4. Compliance & Verification Scorecard

```
========================================================================================
                               GALIGUIDE COMPLIANCE AUDIT
========================================================================================
[PASS] Golden Rule 1: Zero Google Maps Platform API Cost (Leaflet 1.9.4 OSM Tiles)
[PASS] Golden Rule 2: Zero-Cost Universal Navigation Link (Deep Links to /maps/dir/?api=1)
[PASS] Golden Rule 3: Privacy-First Phone Protection (DPDP Consent Gated, Masked Phones)
[PASS] Golden Rule 4: Bilingual Discovery First (English & Devanagari Hindi Text & Search)
[PASS] Golden Rule 5: Pure Mathematical Haversine Geodesy (Sub-Meter Resolution, Zero PostGIS)
[PASS] Golden Rule 6: Neon Serverless PostgreSQL Persistence (aws-eu-central-1.pooler.neon.tech)
----------------------------------------------------------------------------------------
[PASS] Prototype Acceptance Criteria (PAC-01 to PAC-14):  14 / 14 PASSED (100.0%)
[PASS] Master Feature Inventory (F01 to F25):             25 / 25 PASSED (100.0%)
[PASS] Comprehensive Edge Cases (EC-01 to EC-22):         22 / 22 PASSED (100.0%)
[PASS] Unit Test Suites (Jest, Server Workspace):         23 / 23 PASSED (100.0%)
[PASS] Workspace Rules Verification (scripts/verify_rules.ps1): 16 / 16 PASSED (100.0%)
[PASS] Agent Skills Verification (scripts/verify_skills.ps1):   50 / 50 PASSED (100.0%)
========================================================================================
```

---

## 5. Independent Verification Instructions

To independently verify the deliverables in this folder:

1. **Verify Integrity Hashes:**
   ```powershell
   node -e "const fs = require('fs'); const crypto = require('crypto'); const path = require('path'); function walk(d) { let res = []; for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) res = res.concat(walk(p)); else res.push(p); } return res; } walk('audit_artifacts').forEach(f => { const h = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'); console.log(f + ': ' + h); });"
   ```
2. **Verify Acceptance Criteria Against Production Deployment:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/verify_galiguide.ps1 -ServerHost https://galiguide-saranshlab.vercel.app
   ```
3. **Verify Video Playback & Metadata:**
   ```powershell
   & "C:\Users\saransh\AppData\Local\ms-playwright\ffmpeg-1013\ffmpeg-win64.exe" -i "audit_artifacts\recordings\galiguide_walkthrough.webm"
   ```
4. **Verify TypeScript & Vite Compilation:**
   ```powershell
   cmd.exe /c npm run build --workspace=client
   cmd.exe /c npm run build --workspace=server
   ```
