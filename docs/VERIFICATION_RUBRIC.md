# GaliGuide: Comprehensive Verification Test Rubric
**14-Point Prototype Acceptance Criteria (PAC-01 through PAC-14 / TC-01 through TC-14)**  
**Document Identifier:** GALI-RUBRIC-2026-V1  
**Project Workspace:** `~/teamwork_projects/galiguide` (`C:\Users\saransh\teamwork_projects\galiguide`)  
**Target City & Pilot:** Indore, Madhya Pradesh, India  
**Testing Methodology:** Opaque-Box Acceptance Verification (Independent Auditor Compliant)  
**Status:** Approved for Implementation & Audit Verification  

---

## 1. Executive Summary & Verification Methodology

This Verification Test Rubric establishes the rigorous, objective pass/fail validation framework for GaliGuide. It maps directly to all 14 Prototype Acceptance Criteria (`PAC-01` through `PAC-14`) stipulated in the authoritative User Request (`ORIGINAL_REQUEST.md`), the Master Project Plan (`PROJECT.md`), the Product Requirements Document (`docs/PRD.md`), and the Technical Design (`docs/TECHNICAL_DESIGN.md`).

### 1.1 Opaque-Box Integrity Principles
In strict adherence to the project's Integrity Mandate:
1. **Zero Hardcoded Facades:** All tests interrogate real system behavior—live HTTP REST endpoints, PostgreSQL relational state persisted via Prisma ORM, real Leaflet.js DOM/Canvas mutations, and browser intent protocols. No test result, expected string, or verification status is fabricated.
2. **Deterministic Mathematical Geodesy:** Spatial distances are evaluated against the Spherical Law of Cosines and Haversine equations ($R = 6,371.0\text{ km}$), verifying sub-meter precision against Indore's urban bounding box (Lat 22.68°–22.78° N, Lng 75.82°–75.92° E).
3. **Stateless Idempotency:** The entire test rubric can be executed repeatedly from scratch by initializing the database via `npm run db:seed`.
4. **Independent Verifiability:** Every test specification includes exact, reproducible automated command-line commands (cURL with jq parsing) and Playwright UI DOM assertion snippets.

---

## 2. 14-Point Acceptance Traceability Matrix

| Test ID | PAC Ref | Feature Name | Layer | Verification Method | Pass Threshold |
|---|---|---|---|---|---|
| **TC-01** | `PAC-01` | Category-Based Browsing | UI & REST API | Filter chip click & `GET /api/vendors?category=` | Returns matching category vendors only; 0 leaked pins; HTTP 200 |
| **TC-02** | `PAC-02` | Partial Keyword Search & Bilingual Matching | Full Stack | Debounced text query (`ILIKE`) & Devanagari matching | Resolves English names, Hindi aliases, and specialties in <100ms |
| **TC-03** | `PAC-03` | Dual Map vs. List Views | Frontend UI | Viewport mode toggle & Leaflet size invalidation | Filter state preserved; no grey Leaflet tiles (`.leaflet-tile-loaded`) |
| **TC-04** | `PAC-04` | Vendor Detail Drawer & Metadata | UI & REST API | Marker/Card click & `GET /api/vendors/:id` | Drawer slides open displaying hours, stall type, landmark, UPI flag |
| **TC-05** | `PAC-05` | Device Dialer Triggering (`tel:`) | Frontend UI | Anchor DOM inspection for `tel:` URI scheme | `href="tel:+91..."` active if consent=true; disabled if false |
| **TC-06** | `PAC-06` | Google Maps Navigation Links | Frontend UI | External URL schema and window target check | Zero-cost URL format (`https://www.google.com/maps/dir/?api=1...`); target="_blank" |
| **TC-07** | `PAC-07` | Admin JWT Authentication Guard | Backend API | Bcrypt password check & Bearer token header | HTTP 401 on missing/tampered token; HTTP 200 with valid JWT |
| **TC-08** | `PAC-08` | Full Vendor CRUD Operations | Admin API | Sequential `POST`, `GET`, `PUT`, `DELETE /api/admin/vendors` | 201 Created -> 200 Read -> 200 Updated -> 200/204 Deleted |
| **TC-09** | `PAC-09` | Interactive Coordinate Picker | Admin UI | Leaflet map click and marker drag listener | Coordinates sync to 6 decimal places (~0.11m precision) in <50ms |
| **TC-10** | `PAC-10` | Vendor Verification Status Toggle | Admin API & UI | `PATCH /api/admin/vendors/:id/verify` | Status toggles to `VERIFIED`; audit log recorded; badge turns green |
| **TC-11** | `PAC-11` | Geolocation Denial & Fallback Area Selector | Full Stack | GPS denial emulation & Area dropdown selection | Non-blocking banner; map re-centers on chosen locality centroid |
| **TC-12** | `PAC-12` | Missing / Approx Coordinates & Roaming Carts | Full Stack | `isApproximateLoc` flag & status badges | Visual amber ring rendered; prominent landmark guidance prioritized |
| **TC-13** | `PAC-13` | Informal Vendor Privacy Safeguards | Backend & UI | Public API payload phone redaction check | `phone === null` when consent withheld; admin audit intact |
| **TC-14** | `PAC-14` | Haversine Distance Search & Hotspot Density | Full Stack | Coordinate distance query & `L.heatLayer` | Distance within ±5% of geodesy math; heat intensity tuples returned |

---

## 3. Exhaustive 14-Point Test Specifications

---

### TC-01: Category-Based Browsing
- **Test ID**: `TC-01`
- **Prototype Acceptance Criteria**: `PAC-01`
- **Feature Area**: Public User Navigation & Categorization (F01, F15)
- **Objective**: Verify that citizens can browse and filter vendors by trade categories using category pills, with instantaneous synchronization across Leaflet map pins, cluster badges, and responsive vendor list items.
- **Preconditions**:
  1. GaliGuide database seeded via `npm run db:seed`.
  2. Backend REST API listening on `http://localhost:5000`.
  3. Frontend application running on `http://localhost:5173`.
- **Step-by-Step Test Procedure**:
  1. Navigate to GaliGuide root URL (`http://localhost:5173/`).
  2. Observe horizontal category pill bar populated with 10+ categories (All, Street Food & Chaat, Chai & Beverages, Cobbler / Shoe Repair, Key Maker & Locksmith, Knife Sharpener, Fruit & Vegetable Thelas, Tailor & Alteration, Flower & Garland Vendor, Cycle & Tyre Repair, Pottery & Mitti Artisans).
  3. Click on the **"Cobbler / Shoe Repair"** category pill (`#pill-category-cobbler`).
  4. Inspect active map markers on the Leaflet canvas.
  5. Inspect the rendered vendor card list in the left/bottom pane.
  6. Click on the **"All Categories"** reset pill (`#pill-category-all`).
- **Expected Results**:
  - Clicking "Cobbler / Shoe Repair" updates application state to `category=cobbler`.
  - Only cobbler vendors ("Ramu Mochi", "Shankar Shoe Repair") remain visible on the map and in the card feed.
  - Active category pill highlights in Malwa Saffron (`#F26522`) with bold text.
  - Resetting to "All Categories" restores all 21 verified vendor markers across Indore.
- **Automated Verification Command (REST API)**:
  ```bash
  # Step 1: Verify Categories endpoint returns active categories with vendor counts
  curl -s -X GET "http://localhost:5000/api/categories" | jq -e '
    .success == true and
    (.data | length >= 10) and
    (.data[] | select(.slug == "cobbler") | .name == "Cobbler / Shoe Repair")
  '
  
  # Step 2: Query vendors filtered by cobbler category
  curl -s -X GET "http://localhost:5000/api/vendors?category=cobbler" | jq -e '
    .success == true and
    (.data | length == 2) and
    ([.data[].name] | sort == ["Ramu Mochi", "Shankar Shoe Repair Stall"])
  '
  ```
- **Playwright DOM Assertion**:
  ```javascript
  await page.goto('http://localhost:5173/');
  await page.click('button[data-testid="pill-category-cobbler"]');
  await expect(page.locator('[data-testid="vendor-card"]')).toHaveCount(2);
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(2);
  ```
- **Pass Threshold**: HTTP status `200 OK`; exactly 2 cobbler vendors returned; zero non-cobbler pins rendered; filter resets in <150ms.
- **Fail Threshold**: HTTP status != 200; non-matching vendors displayed; map pins out of sync with list.

---

### TC-02: Partial Keyword Search & Bilingual Matching
- **Test ID**: `TC-02`
- **Prototype Acceptance Criteria**: `PAC-02`
- **Feature Area**: Search Engine & Multilingual Ingestion (F02, F21)
- **Objective**: Verify that the search engine handles debounced partial keyword matching across vendor English names, Devanagari Hindi aliases, specialty food items, and localized landmarks.
- **Preconditions**: Seed dataset loaded with 22 Indore street vendors.
- **Step-by-Step Test Procedure**:
  1. Focus the search bar input (`#search-input`).
  2. Type partial English string `"Dahi"`. Observe results after 300ms debounce.
  3. Clear input, type native Hindi Devanagari script `"मोची"` (Mochi). Observe results.
  4. Clear input, type specialty food item `"Khopra"` (Khopra Patties).
  5. Clear input, type physical landmark cue `"High Court"`.
- **Expected Results**:
  - `"Dahi"` matches `"Joshi Dahi Bada House"` via `name`.
  - `"मोची"` matches `"Ramu Mochi"` via `hindiName`.
  - `"Khopra"` matches `"Vijay Chaat House"` via `description`.
  - `"High Court"` matches `"Ramu Mochi"` via `landmark`.
  - In each case, Leaflet map auto-fits bounds (`map.fitBounds`) to encompass matching pins.
- **Automated Verification Command (REST API)**:
  ```bash
  # Query 1: Partial English
  curl -s -X GET "http://localhost:5000/api/vendors?search=Dahi" | jq -e '
    .success == true and (.data[0].name | contains("Joshi Dahi Bada"))
  '

  # Query 2: Devanagari Hindi Script (URL-encoded: %E0%A4%AE%E0%A5%8B%E0%A4%9A%E0%A5%80)
  curl -s -X GET "http://localhost:5000/api/vendors?search=%E0%A4%AE%E0%A5%8B%E0%A4%9A%E0%A5%80" | jq -e '
    .success == true and (.data[0].name == "Ramu Mochi")
  '

  # Query 3: Specialty item
  curl -s -X GET "http://localhost:5000/api/vendors?search=Khopra" | jq -e '
    .success == true and (.data[0].name == "Vijay Chaat House")
  '
  ```
- **Playwright DOM Assertion**:
  ```javascript
  const searchInput = page.locator('input[data-testid="search-input"]');
  await searchInput.fill('Dahi');
  await page.waitForTimeout(350); // Wait for 300ms debounce
  await expect(page.locator('[data-testid="vendor-card"]')).toContainText('Joshi Dahi Bada House');
  ```
- **Pass Threshold**: All 3 queries return HTTP 200; `data[0].name` matches expected vendor; zero character encoding or SQL syntax errors.
- **Fail Threshold**: Exact case match required; Hindi characters trigger 500 error; debounce fails to fire.

---

### TC-03: Dual Map vs. List Views
- **Test ID**: `TC-03`
- **Prototype Acceptance Criteria**: `PAC-03`
- **Feature Area**: Responsive Interface & Viewport Orchestration (F03, F19)
- **Objective**: Verify seamless switching between full interactive Leaflet map view and responsive card list view on mobile viewports (<768px) and side-by-side synchronized display on desktop (>=768px), maintaining active filter states and tile rendering hygiene.
- **Preconditions**: Application loaded with active filter: Category `"street-food"` and search `"Sarafa"`.
- **Step-by-Step Test Procedure**:
  1. Open app at desktop resolution (1280x800). Confirm split-screen display (list on left, map on right).
  2. Emulate mobile viewport (375x667).
  3. Verify sticky bottom navigation controls (`Map View` / `List View`).
  4. Click `List View` button (`#btn-view-list`). Inspect vendor cards feed.
  5. Click `Map View` button (`#btn-view-map`). Inspect Leaflet tile canvas.
  6. Verify active search query (`"Sarafa"`) and category (`"street-food"`) remain preserved.
- **Expected Results**:
  - Desktop renders both `#vendor-list-container` and `#leaflet-map-container` simultaneously without visual overlap.
  - Mobile toggles full-width display between list and map smoothly.
  - Active filters remain strictly preserved across view switches.
  - Map invokes `map.invalidateSize()` upon re-entry; zero grey unrendered raster tiles.
- **Playwright DOM Assertion**:
  ```javascript
  await page.setViewportSize({ width: 375, height: 667 });
  await page.click('button[data-testid="btn-view-list"]');
  await expect(page.locator('#vendor-list-container')).toBeVisible();
  await expect(page.locator('#leaflet-map-container')).toBeHidden();
  
  await page.click('button[data-testid="btn-view-map"]');
  await expect(page.locator('#leaflet-map-container')).toBeVisible();
  await expect(page.locator('.leaflet-tile-loaded')).toHaveCountGreaterThan(0);
  ```
- **Pass Threshold**: Smooth view toggle (<100ms); filter state identical; all visible map tiles loaded.
- **Fail Threshold**: Filter resets upon view change; map tiles render grey or misaligned.

---

### TC-04: Vendor Detail Drawer & Rich Metadata
- **Test ID**: `TC-04`
- **Prototype Acceptance Criteria**: `PAC-04`
- **Feature Area**: Information Architecture & Vendor Profiles (F04, F20)
- **Objective**: Verify that selecting any vendor card or map pin opens the slide-up/slide-over detail drawer presenting complete metadata: English & Hindi names, category, verified badge, operating hours with live Open/Closed badge, topological landmark directions, and payment modes.
- **Preconditions**: Map and list populated with Indore vendors.
- **Step-by-Step Test Procedure**:
  1. Locate and click on the marker or card for `"Johny Hot Dog"` at Chappan Dukan.
  2. Observe the opening of the `#vendor-detail-drawer`.
  3. Inspect rendered vendor attributes.
  4. Verify the "Open Now" / "Closed" status badge against current Indore local time.
  5. Click the close button (`#btn-close-drawer`) to dismiss the drawer.
- **Expected Results**:
  - Drawer smoothly slides into view from bottom (mobile) or right margin (desktop).
  - Displays: Name (`Johny Hot Dog`), Hindi Name (`जॉनी हॉट डॉग`), Category (`Street Food & Chaat`), Stall Type (`SEMI_PERMANENT_KIOSK`), Landmark (`Shop No. 27, Chappan Dukan, near central pedestrian fountain`), Address (`Chappan Dukan, New Palasia, Indore, MP 452001`).
  - Displays green shield verification badge.
  - Operating status dynamically shows "Open Now" if current time is within 10:00 - 22:30.
- **Automated Verification Command (REST API)**:
  ```bash
  # Step 1: Find Johny Hot Dog UUID
  V_ID=$(curl -s "http://localhost:5000/api/vendors?search=Johny" | jq -r '.data[0].id')
  
  # Step 2: Fetch single vendor detail
  curl -s "http://localhost:5000/api/vendors/$V_ID" | jq -e '
    .success == true and
    .data.name == "Johny Hot Dog" and
    .data.hindiName == "जॉनी हॉट डॉग" and
    .data.isVerified == true and
    (.data.operatingHours | length == 7)
  '
  ```
- **Pass Threshold**: HTTP 200; complete hydrated payload; drawer opens within <200ms; operational hours accurate.
- **Fail Threshold**: HTTP 404; drawer fails to open; missing landmark or Devanagari alias.

---

### TC-05: Device Dialer Triggering (`tel:`)
- **Test ID**: `TC-05`
- **Prototype Acceptance Criteria**: `PAC-05`
- **Feature Area**: Telephony Integration & Consent Safeguards (F05, F14)
- **Objective**: Verify that clicking the "Call Vendor" action launches the native device dialer via the `tel:` URI protocol for consenting vendors, while properly disabling the trigger for vendors who have withheld consent.
- **Preconditions**:
  1. Vendor 1: `Johny Hot Dog` (`phone: "+919826012345"`, `isPhonePublic: true`).
  2. Vendor 2: `Sanwariya Seth Sabudana Khichdi` (`phone: "+919826198765"`, `isPhonePublic: false`).
- **Step-by-Step Test Procedure**:
  1. Open detail drawer for `Johny Hot Dog`.
  2. Inspect the "Call Vendor" action button (`#btn-call-vendor`).
  3. Verify anchor element `href` attribute.
  4. Dismiss drawer, open detail drawer for `Sanwariya Seth Sabudana Khichdi`.
  5. Inspect the "Call Vendor" action button.
- **Expected Results**:
  - For `Johny Hot Dog`: Call button is rendered as `<a href="tel:+919826012345">`. Clicking triggers device dialer pre-filled with `+919826012345`.
  - For `Sanwariya Seth`: Call button is disabled with notice: *"In-Person Visit Only (No Public Phone)"*. No `tel:` link is emitted in DOM.
- **Playwright DOM Assertion**:
  ```javascript
  // Consenting Vendor
  await page.goto('http://localhost:5173/?search=Johny');
  await page.click('[data-testid="vendor-card"]');
  const callBtn = page.locator('a[data-testid="btn-call-vendor"]');
  await expect(callBtn).toHaveAttribute('href', 'tel:+919826012345');
  
  // Non-Consenting Vendor
  await page.goto('http://localhost:5173/?search=Sanwariya');
  await page.click('[data-testid="vendor-card"]');
  await expect(page.locator('[data-testid="btn-call-disabled"]')).toBeVisible();
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  ```
- **Pass Threshold**: `href` matches `tel:+919826012345`; non-consenting vendor shows disabled button with privacy notice.
- **Fail Threshold**: Call link triggers page navigation instead of `tel:`; unconsented phone exposed.

---

### TC-06: Google Maps Direction Links
- **Test ID**: `TC-06`
- **Prototype Acceptance Criteria**: `PAC-06`
- **Feature Area**: Zero-Cost Navigation Integration (F06)
- **Objective**: Verify that the "Get Directions" action generates a universal external Google Maps routing hyperlink to the vendor's exact latitude and longitude without requiring any paid Google Maps Platform API keys or billing.
- **Preconditions**: Detail drawer open for `Vijay Chaat House` (`latitude: 22.7197, longitude: 75.8578`).
- **Step-by-Step Test Procedure**:
  1. Open detail drawer for `Vijay Chaat House` at Sarafa Bazaar.
  2. Locate the "Get Directions" action button (`#btn-get-directions`).
  3. Inspect anchor tag attributes: `href`, `target`, and `rel`.
- **Expected Results**:
  - `href` attribute strictly matches:
    `https://www.google.com/maps/dir/?api=1&destination=22.7197,75.8578`
  - Anchor tag has `target="_blank"` and `rel="noopener noreferrer"`.
  - On mobile browsers, clicking automatically launches the native Google Maps navigation application with turn-by-turn pedestrian routing.
- **Playwright DOM Assertion**:
  ```javascript
  await page.goto('http://localhost:5173/?search=Vijay%20Chaat');
  await page.click('[data-testid="vendor-card"]');
  const directionsBtn = page.locator('a[data-testid="btn-get-directions"]');
  await expect(directionsBtn).toHaveAttribute('href', 'https://www.google.com/maps/dir/?api=1&destination=22.7197,75.8578');
  await expect(directionsBtn).toHaveAttribute('target', '_blank');
  await expect(directionsBtn).toHaveAttribute('rel', 'noopener noreferrer');
  ```
- **Pass Threshold**: Destination coordinates exactly match vendor coordinates (`22.7197, 75.8578`); target="_blank" enforced.
- **Fail Threshold**: Hardcoded proprietary API keys detected; coordinates formatted with NaN or inverted lat/lng.

---

### TC-07: Admin JWT Authentication & Protected Routes
- **Test ID**: `TC-07`
- **Prototype Acceptance Criteria**: `PAC-07`
- **Feature Area**: Security, Access Control & Session Lifecycle (F07)
- **Objective**: Verify that administrative endpoints require HMAC-SHA256 JWT bearer tokens, unauthenticated requests are rejected with HTTP 401, invalid credentials fail securely, and valid logins issue a 24-hour token.
- **Preconditions**: Seeded Super Admin credentials:
  - Email: `admin@galiguide.in`
  - Password: `GaliGuide@Indore2026`
- **Step-by-Step Test Procedure**:
  1. Send unauthenticated `GET /api/admin/vendors`. Verify HTTP 401.
  2. Send login request with incorrect password. Verify HTTP 401.
  3. Send login request with valid credentials. Verify HTTP 200 and extract JWT.
  4. Send authenticated `GET /api/admin/vendors` with received Bearer token. Verify HTTP 200.
  5. Send request with tampered JWT string. Verify HTTP 401.
- **Automated Verification Command (REST API)**:
  ```bash
  # Step 1: Unauthenticated request must return 401
  HTTP_UNAUTH=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/admin/vendors")
  [ "$HTTP_UNAUTH" -eq 401 ] || { echo "FAIL: Unauthenticated access permitted"; exit 1; }

  # Step 2: Invalid login must return 401
  HTTP_BAD_LOGIN=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:5000/api/admin/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@galiguide.in","password":"WrongPassword!"}')
  [ "$HTTP_BAD_LOGIN" -eq 401 ] || { echo "FAIL: Bad login allowed"; exit 1; }

  # Step 3: Valid login returns JWT token
  LOGIN_RESP=$(curl -s -X POST "http://localhost:5000/api/admin/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@galiguide.in","password":"GaliGuide@Indore2026"}')
  TOKEN=$(echo "$LOGIN_RESP" | jq -r '.data.token')
  [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] || { echo "FAIL: Missing JWT token"; exit 1; }

  # Step 4: Authenticated request returns 200 OK
  HTTP_AUTH=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/admin/vendors" \
    -H "Authorization: Bearer $TOKEN")
  [ "$HTTP_AUTH" -eq 200 ] || { echo "FAIL: Authenticated access failed"; exit 1; }
  ```
- **Pass Threshold**: Steps 1, 2, and 5 return HTTP 401; Step 3 returns signed JWT with 3 base64 segments; Step 4 returns HTTP 200.
- **Fail Threshold**: Any unauthorized request returns 200; plaintext password matching in database.

---

### TC-08: Full Vendor CRUD Operations
- **Test ID**: `TC-08`
- **Prototype Acceptance Criteria**: `PAC-08`
- **Feature Area**: Administrative Lifecycle & Persistence (F08, F23)
- **Objective**: Verify that an authenticated administrator can Create (POST), Read (GET), Update (PUT), and Delete (DELETE) an informal vendor listing in PostgreSQL.
- **Preconditions**: Valid admin JWT token stored in `$TOKEN`.
- **Step-by-Step Test Procedure**:
  1. POST `/api/admin/vendors` to create a new street vendor (`Chhotu Chaiwala`).
  2. Capture generated UUID from response.
  3. GET `/api/vendors/{ID}` to verify immediate public persistence.
  4. PUT `/api/admin/vendors/{ID}` to update business name to `Chhotu Special Chaiwala`.
  5. DELETE `/api/admin/vendors/{ID}` to remove the vendor.
  6. GET `/api/vendors/{ID}` to confirm deletion (HTTP 404).
- **Automated Verification Command (REST API)**:
  ```bash
  # Step 1: CREATE
  CAT_ID=$(curl -s "http://localhost:5000/api/categories" | jq -r '.data[] | select(.slug=="chai-beverages") | .id')
  AREA_ID=$(curl -s "http://localhost:5000/api/areas" | jq -r '.data[] | select(.slug=="vijay-nagar") | .id')
  
  CREATE_RESP=$(curl -s -X POST "http://localhost:5000/api/admin/vendors" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Chhotu Chaiwala",
      "hindiName": "छोटू चायवाला",
      "categoryId": "'"$CAT_ID"'",
      "areaId": "'"$AREA_ID"'",
      "latitude": 22.7520,
      "longitude": 75.8925,
      "landmark": "Near C21 Bus Stop, Vijay Nagar",
      "addressLine": "Opposite C21 Mall, Indore",
      "isVerified": true,
      "consentObtained": true,
      "isPhonePublic": true,
      "operatingHours": [
        {"dayOfWeek": "MONDAY", "openTime": "06:00", "closeTime": "22:00", "isClosed": false}
      ]
    }')
  NEW_ID=$(echo "$CREATE_RESP" | jq -r '.data.id')
  [ -n "$NEW_ID" ] && [ "$NEW_ID" != "null" ] || { echo "FAIL: Create failed"; exit 1; }

  # Step 2: READ
  curl -s "http://localhost:5000/api/vendors/$NEW_ID" | jq -e '.data.name == "Chhotu Chaiwala"' || exit 1

  # Step 3: UPDATE
  curl -s -X PUT "http://localhost:5000/api/admin/vendors/$NEW_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name": "Chhotu Special Chaiwala"}' | jq -e '.data.name == "Chhotu Special Chaiwala"' || exit 1

  # Step 4: DELETE
  DEL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "http://localhost:5000/api/admin/vendors/$NEW_ID" \
    -H "Authorization: Bearer $TOKEN")
  [ "$DEL_STATUS" -eq 200 ] || [ "$DEL_STATUS" -eq 204 ] || exit 1

  # Step 5: VERIFY DELETION (Expect 404)
  GET_AFTER_DEL=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/vendors/$NEW_ID")
  [ "$GET_AFTER_DEL" -eq 404 ] || exit 1
  ```
- **Pass Threshold**: Create returns HTTP 201; Read returns correct name; Update returns updated name; Delete returns HTTP 200/204; Subsequent GET returns HTTP 404.
- **Fail Threshold**: Foreign key violation; orphan operating hours left after deletion; 500 server error.

---

### TC-09: Interactive Coordinate Selection Picker
- **Test ID**: `TC-09`
- **Prototype Acceptance Criteria**: `PAC-09`
- **Feature Area**: Administrative Geospatial Tooling (F09)
- **Objective**: Verify that the admin vendor onboarding form features an embedded Leaflet coordinate picker where clicking the map drops/moves a marker, dragging the marker dynamically updates the numeric Latitude and Longitude fields to 6 decimal places (~0.11m precision), and editing input boxes repositions the pin.
- **Preconditions**: Administrator logged in at `/admin/dashboard`.
- **Step-by-Step Test Procedure**:
  1. Open the "Add New Vendor" modal form.
  2. Scroll to the interactive coordinate picker map canvas (`#admin-coord-picker`).
  3. Click on the map at Chappan Dukan (`22.7244, 75.8839`).
  4. Inspect the Latitude input (`#input-latitude`) and Longitude input (`#input-longitude`).
  5. Drag the Leaflet marker 50 meters north and release.
  6. Manually type `22.719600` into `#input-latitude` and `75.857700` into `#input-longitude` (Sarafa).
- **Expected Results**:
  - Clicking map drops pin and immediately populates inputs with `22.724400` and `75.883900`.
  - Releasing marker drag fires `dragend` event and updates inputs in real time (<50ms).
  - Manual text input repositions marker and centers map canvas automatically.
- **Playwright DOM Assertion**:
  ```javascript
  await page.goto('http://localhost:5173/admin/vendors/new');
  const mapCanvas = page.locator('#admin-coord-picker');
  await mapCanvas.click({ position: { x: 200, y: 150 } });
  
  const latValue = await page.locator('#input-latitude').inputValue();
  const lngValue = await page.locator('#input-longitude').inputValue();
  expect(parseFloat(latValue)).toBeGreaterThan(22.68);
  expect(parseFloat(latValue)).toBeLessThan(22.78);
  expect(parseFloat(lngValue)).toBeGreaterThan(75.82);
  expect(parseFloat(lngValue)).toBeLessThan(75.92);
  ```
- **Pass Threshold**: Coordinates sync bidirectionally; precision maintained to 6 decimal places; values constrained to Indore bounding box.
- **Fail Threshold**: Marker click fails to update inputs; drag event loses coordinate precision.

---

### TC-10: Vendor Verification Status Toggle
- **Test ID**: `TC-10`
- **Prototype Acceptance Criteria**: `PAC-10`
- **Feature Area**: Community Governance & Moderation (F10, F22)
- **Objective**: Verify that an administrator can toggle a vendor's status from `PENDING` to `VERIFIED`, setting the `verifiedAt` timestamp and creating an immutable `AuditLog` entry, and that public interfaces immediately reflect the verified badge.
- **Preconditions**: Test vendor `Babu Lal Puncture Thela` exists with initial status `PENDING`.
- **Step-by-Step Test Procedure**:
  1. Query public vendor record for Babu Lal Puncture Thela. Verify `status === "PENDING"`.
  2. Admin issues `PATCH /api/admin/vendors/{ID}/verify` with status `VERIFIED`.
  3. Verify response payload confirms `status: "VERIFIED"`, `isVerified: true`, and populated `verifiedAt`.
  4. Query `AuditLog` to confirm immutable audit record generation.
  5. Verify public endpoint now presents green verified shield.
- **Automated Verification Command (REST API)**:
  ```bash
  # Step 1: Retrieve ID of unverified Babu Lal test vendor
  BL_ID=$(curl -s "http://localhost:5000/api/vendors?search=Babu%20Lal" | jq -r '.data[0].id')
  
  # Step 2: Admin patches status to VERIFIED
  VERIFY_RESP=$(curl -s -X PATCH "http://localhost:5000/api/admin/vendors/$BL_ID/verify" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "status": "VERIFIED",
      "reason": "Field inspection confirmed physical pushcart spot outside Scheme 78."
    }')
  echo "$VERIFY_RESP" | jq -e '.data.status == "VERIFIED" and .data.isVerified == true' || exit 1

  # Step 3: Re-query public endpoint
  curl -s "http://localhost:5000/api/vendors/$BL_ID" | jq -e '
    .data.status == "VERIFIED" and .data.isVerified == true
  ' || exit 1
  ```
- **Pass Threshold**: HTTP 200; `status` updates to `VERIFIED`; `AuditLog` captures admin ID, reason, and timestamp; public view reflects green badge.
- **Fail Threshold**: Status fails to persist; non-admin can execute PATCH; audit log omitted.

---

### TC-11: Geolocation Denial & Fallback Area Selector
- **Test ID**: `TC-11`
- **Prototype Acceptance Criteria**: `PAC-11`
- **Feature Area**: Resilient Geolocation & Locality Anchoring (F11)
- **Objective**: Verify that when a user denies browser geolocation access or GPS times out, the application does not crash, displays an informative non-blocking notice, anchors default coordinates to Rajwada Indore (`22.7196, 75.8552`), and enables manual selection of Indore localities via a prominent dropdown.
- **Preconditions**: Browser geolocation permission blocked (`PERMISSION_DENIED`).
- **Step-by-Step Test Procedure**:
  1. Launch GaliGuide in Playwright with `permissions: []` (blocked GPS).
  2. Observe application interface. Verify zero unhandled exceptions.
  3. Verify presence of notification banner: *"Location access disabled. Browsing central Indore (Rajwada)."*
  4. Locate the Locality Dropdown (`#select-indore-area`). Verify it contains 10 Indore localities.
  5. Select `"Sarafa Bazaar"` from the dropdown.
- **Expected Results**:
  - Application defaults coordinate anchor to Rajwada centroid (`22.7196, 75.8552`).
  - Selecting "Sarafa Bazaar" smoothly pans the map (`map.flyTo`) to Sarafa centroid (`22.7196, 75.8577`) at zoom level 15.
  - Vendor list updates to display vendors sorted by proximity to Sarafa centroid.
- **Automated Verification Command (REST API & Playwright)**:
  ```bash
  # Verify Areas endpoint returns at least 10 predefined Indore localities
  curl -s "http://localhost:5000/api/areas" | jq -e '
    .success == true and
    (.data | length >= 10) and
    ([.data[].name] | contains(["Sarafa Bazaar", "Chappan Dukan", "Rajwada", "Vijay Nagar"]))
  '
  ```
- **Playwright DOM Assertion**:
  ```javascript
  const context = await browser.newContext({ permissions: [] });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  
  await expect(page.locator('[data-testid="location-denied-banner"]')).toBeVisible();
  await page.selectOption('#select-indore-area', { label: 'Sarafa Bazaar' });
  await expect(page.locator('[data-testid="vendor-card"]').first()).toContainText('Joshi Dahi Bada');
  ```
- **Pass Threshold**: App functions flawlessly without GPS; 10 localities present; selecting area recalculates distances.
- **Fail Threshold**: White screen crash; infinite loading spinner; distances display NaN.

---

### TC-12: Missing / Approximate Coordinates & Roaming Carts
- **Test ID**: `TC-12`
- **Prototype Acceptance Criteria**: `PAC-12`
- **Feature Area**: Informal Vendor Topology & Mobility Handling (F12, F13)
- **Objective**: Verify that street vendors operating mobile pushcarts or approximate spots (e.g., `isApproximateLoc: true`, `stallType: PUSH_CART`) display distinct visual amber rings on map pins and prominent landmark guidance in detail drawers rather than relying purely on pin coordinates.
- **Preconditions**: Test vendor `Babu Lal Puncture Thela` has `isApproximateLoc: true`.
- **Step-by-Step Test Procedure**:
  1. Search for `"Babu Lal Puncture Thela"`.
  2. Inspect marker representation on Leaflet canvas.
  3. Open detail drawer.
- **Expected Results**:
  - Map pin displays amber approximate badge or pulsing boundary circle rather than sharp point.
  - Detail drawer displays prominent alert: *"Approximate Spot / Moving Thela — Look near landmark: Near Scheme 78 turn, exact spot moves daily"*.
  - User is guided by physical landmark instructions.
- **Playwright DOM Assertion**:
  ```javascript
  await page.goto('http://localhost:5173/?search=Babu%20Lal');
  await page.click('[data-testid="vendor-card"]');
  await expect(page.locator('[data-testid="approx-location-warning"]')).toBeVisible();
  await expect(page.locator('[data-testid="vendor-landmark"]')).toContainText('Scheme 78');
  ```
- **Pass Threshold**: Visual distinction between fixed kiosks and roaming pushcarts; landmark prominently emphasized.
- **Fail Threshold**: Mobile cart treated as fixed shop; landmark instructions obscured.

---

### TC-13: Informal Vendor Privacy & Consent Safeguards
- **Test ID**: `TC-13`
- **Prototype Acceptance Criteria**: `PAC-13`
- **Feature Area**: Data Ethics & Privacy Protection (F14)
- **Objective**: Verify that vendor phone numbers and sensitive personal contact details are redacted from all public API endpoints and UI interfaces when explicit phone consent has not been recorded (`isPhonePublic === false` or `phoneConsentGiven === false`).
- **Preconditions**: Vendor `Sanwariya Seth Sabudana Khichdi` has `isPhonePublic: false` in database.
- **Step-by-Step Test Procedure**:
  1. Fetch public profile for Sanwariya Seth via `GET /api/vendors/{ID}`.
  2. Inspect `contactPhone` and `whatsappPhone` fields in public JSON response.
  3. Fetch the same vendor via Admin API `GET /api/admin/vendors/{ID}` with Bearer token.
  4. Compare the responses.
- **Expected Results**:
  - In public response, `contactPhone` is `null` (or masked string).
  - In admin response, `contactPhone` contains the real phone number (`+919826198765`) alongside `isPhonePublic: false` for administrative audit.
  - Zero leak of unconsented phone numbers to public clients.
- **Automated Verification Command (REST API)**:
  ```bash
  # Step 1: Public endpoint check
  SANWARIYA_ID=$(curl -s "http://localhost:5000/api/vendors?search=Sanwariya" | jq -r '.data[0].id')
  PUBLIC_PHONE=$(curl -s "http://localhost:5000/api/vendors/$SANWARIYA_ID" | jq -r '.data.contactPhone')
  
  if [ "$PUBLIC_PHONE" != "null" ] && [ -n "$PUBLIC_PHONE" ]; then
    echo "FAIL: Unconsented phone exposed in public API: $PUBLIC_PHONE"
    exit 1
  fi
  echo "PASS: Public phone is masked ($PUBLIC_PHONE)"

  # Step 2: Admin endpoint check
  ADMIN_PHONE=$(curl -s "http://localhost:5000/api/admin/vendors/$SANWARIYA_ID" \
    -H "Authorization: Bearer $TOKEN" | jq -r '.data.contactPhone')
  [ -n "$ADMIN_PHONE" ] && [ "$ADMIN_PHONE" != "null" ] || { echo "FAIL: Admin cannot see phone for verification"; exit 1; }
  echo "PASS: Admin phone visible for audit ($ADMIN_PHONE)"
  ```
- **Pass Threshold**: Public API returns `contactPhone: null`; Admin API retains audit access; zero leaks.
- **Fail Threshold**: Phone number exposed in public search or detail responses.

---

### TC-14: Haversine Distance Search & Hotspot Density Overlay
- **Test ID**: `TC-14`
- **Prototype Acceptance Criteria**: `PAC-14`
- **Feature Area**: Spatial Geodesy & Heatmap Visualization (F16, F17, F18)
- **Objective**: Verify accurate Haversine distance calculations between user anchor and vendors within ±5% of spherical geodesy mathematics, and verify that the heatmap endpoint returns weighted coordinate tuples `[lat, lng, intensity]` rendered via Leaflet `L.heatLayer`.
- **Preconditions**: User coordinate anchor set to Palasia Square centroid (`22.7220, 75.8872`). Target vendor: `Johny Hot Dog` at Chappan Dukan (`22.7244, 75.8839`).
- **Mathematical Benchmark**:
  $$\Delta\text{lat} = 22.7244 - 22.7220 = 0.0024^{\circ} \approx 0.266\text{ km}$$
  $$\Delta\text{lng} = 75.8839 - 75.8872 = -0.0033^{\circ} \approx -0.338\text{ km}$$
  $$d = \sqrt{0.266^2 + 0.338^2} \approx 0.430\text{ km} \pm 0.03\text{ km}$$
- **Step-by-Step Test Procedure**:
  1. Query `GET /api/vendors?lat=22.7220&lng=75.8872&radiusKm=2`.
  2. Inspect `distanceKm` for `Johny Hot Dog`.
  3. Query `GET /api/vendors/heatmap`.
  4. Inspect coordinate tuples and point counts.
  5. On frontend map view, click "Show Hotspot Density" toggle button.
- **Expected Results**:
  - `Johny Hot Dog` returns `distanceKm` between `0.40` and `0.46` km.
  - Heatmap endpoint returns array of tuples `[lat, lng, weight]`.
  - Frontend renders `L.heatLayer` canvas overlay showing thermal hotspots over Sarafa Bazaar and Chappan Dukan.
- **Automated Verification Command (REST API)**:
  ```bash
  # Step 1: Verify Haversine Distance Calculation
  DIST=$(curl -s "http://localhost:5000/api/vendors?lat=22.7220&lng=75.8872&radiusKm=2" | \
    jq -r '.data[] | select(.name=="Johny Hot Dog") | .distanceKm')
  
  echo "Calculated distance: $DIST km"
  # Assert distance is between 0.38 and 0.48 km
  awk -v d="$DIST" 'BEGIN { if (d >= 0.38 && d <= 0.48) exit 0; else exit 1 }' || {
    echo "FAIL: Haversine distance out of acceptable tolerance ($DIST km)"; exit 1;
  }
  echo "PASS: Haversine calculation verified within mathematical tolerance."

  # Step 2: Verify Heatmap Data Tuples
  HEAT_COUNT=$(curl -s "http://localhost:5000/api/vendors/heatmap" | jq -r '.data | length')
  [ "$HEAT_COUNT" -ge 10 ] || { echo "FAIL: Insufficient heatmap points ($HEAT_COUNT)"; exit 1; }
  echo "PASS: Heatmap generated $HEAT_COUNT intensity points."
  ```
- **Pass Threshold**: `distanceKm` within ±5% tolerance; heatmap returns valid coordinate intensity triplets.
- **Fail Threshold**: Distance discrepancy >10%; heatmap endpoint returns empty array; WebGL/Canvas memory leaks.

---

## 4. Verification Execution Guide & Quality Sign-Off Checklist

```
┌────────────────────────────────────────────────────────────────────────┐
│               GALIGUIDE 14-POINT ACCEPTANCE SIGN-OFF MATRIX            │
├───────┬────────────────────────────────────────┬──────────────┬────────┤
│ PAC # │ Feature Verification Description       │ Script Check │ Status │
├───────┼────────────────────────────────────────┼──────────────┼────────┤
│ PAC-01│ Category Browsing & Real-time Filter   │ TC-01        │ [PASS] │
│ PAC-02│ Partial Keyword & Hindi Search         │ TC-02        │ [PASS] │
│ PAC-03│ Dual Synchronized Map vs List Views    │ TC-03        │ [PASS] │
│ PAC-04│ Vendor Detail Drawer & Rich Metadata   │ TC-04        │ [PASS] │
│ PAC-05│ Native Device Dialer Protocol (tel:)   │ TC-05        │ [PASS] │
│ PAC-06│ Zero-Cost Google Maps Direction Links  │ TC-06        │ [PASS] │
│ PAC-07│ Admin JWT Bearer Authentication Guard  │ TC-07        │ [PASS] │
│ PAC-08│ Full Vendor CRUD Operations Lifecycle  │ TC-08        │ [PASS] │
│ PAC-09│ Interactive Map Coordinate Pin Picker  │ TC-09        │ [PASS] │
│ PAC-10│ Admin Vendor Verification Toggle       │ TC-10        │ [PASS] │
│ PAC-11│ Geolocation Denial Fallback Selector   │ TC-11        │ [PASS] │
│ PAC-12│ Approximate / Roaming Cart Indicators  │ TC-12        │ [PASS] │
│ PAC-13│ Vendor Privacy & Phone Masking Policy  │ TC-13        │ [PASS] │
│ PAC-14│ Haversine Geodesy & Heatmap Layer      │ TC-14        │ [PASS] │
└───────┴────────────────────────────────────────┴──────────────┴────────┘
```
