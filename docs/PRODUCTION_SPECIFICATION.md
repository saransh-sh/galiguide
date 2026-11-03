# GaliGuide: Master Production Specification
**Hyperlocal Informal Vendor Discovery & Navigation System (Indore Pilot)**

**Document Identifier:** GALI-PROD-SPEC-2026-V1  
**Project Workspace:** `~/teamwork_projects/galiguide` (`C:\Users\saransh\teamwork_projects\galiguide`)  
**Target Pilot City:** Indore, Madhya Pradesh, India (Municipal Wards 1–85)  
**Target Technology Stack:** React 18 + Vite, Tailwind CSS, Node.js 20 LTS + Express 4.19, PostgreSQL 15+ with Prisma ORM 5.19, Leaflet.js 1.9.4 (OpenStreetMap, MarkerCluster 1.5.3, Leaflet.heat 0.2.0)  
**Status:** Authoritative Master Production Specification (Milestone 4 Synthesis)  
**Version:** 1.0.0  

---

## 1. Executive Summary & Product Vision

### 1.1 The Informal Urban Economy & The Discovery Gap
In urban India, the informal street economy forms the indispensable foundation of daily municipal life and commerce. In Indore—celebrated as India's cleanest city under Swachh Survekshan awards for consecutive years and the premier commercial and culinary capital of Central India—over 60,000 micro-entrepreneurs operate daily on sidewalks, alleyway corners (*galis*), street intersections (*chourahas*), and mobile pushcarts (*thelas*).

These micro-enterprises span essential community services and cultural heritage trades:
- **Culinary Artisans & Food Heritage:** Morning breakfast stalls serving iconic Indori poha-jalebi and usal poha, night street food masters across the jewelry alley of Sarafa Bazaar, snack creators at Chappan Dukan, and evening chaat, garadu, and bhutte ka kees thelas.
- **Everyday Utility & Repair Services:** Sidewalk cobblers (*mochis*) stitching leather sandals and repairing bag zippers, key makers (*chabiwale*) cutting duplicate brass keys on manual lathes or duplicating laser vehicle keys, mobile knife and scissor sharpeners (*dharwale*) pedaling bicycle-mounted emery stones, roadside tailors and darners (*darzis/raffu*), small electronic and watch repair kiosks, and cycle puncture mechanics.
- **Fresh Perishables & Traditional Crafts:** Pushcarts (*thelas*) distributing farm-fresh seasonal vegetables and fruits from Choithram Mandi, temple flower and garland stalls (*phool-mala*), and seasonal terracotta pottery artisans (*kumhars*) crafting cooling water matkas and festive diyas.

Despite their vital utility, informal street vendors are systematically locked out of the modern digital economy due to four structural barriers:
1. **Digital Map Invisibility:** Mainstream commercial discovery platforms (Google Maps, Zomato, Swiggy, Justdial) are designed exclusively for registered brick-and-mortar establishments with formal trade licenses, GSTIN tax identifiers, verified postal addresses, and advertising budgets. Informal street vendors remain virtually non-existent on digital maps.
2. **Non-Standard & Dynamic Topography:** Street vendors operate in narrow, centuries-old galis or sidewalk spots without formal street numbers. Their location is anchored entirely by localized physical landmarks (e.g., *"Opposite MP High Court Gate No. 2, under the peepal tree, next to the bus stop"*).
3. **Technological & Financial Asymmetry:** Operating on thin daily profit margins, informal vendors cannot afford smartphones, complex merchant applications, recurring platform subscription fees, or commission cuts.
4. **Platform Cost Prohibitions for Civic Mapping:** Municipal bodies and community initiatives attempting to map informal workers face steep usage-based pricing from proprietary map APIs (Google Maps Platform JavaScript API, Geocoding API, Places API), which scale prohibitively with civic usage.

### 1.2 System Vision & Zero-Cost Architecture Philosophy
**GaliGuide** is a lightweight, zero-commission, accessible, open-source hyperlocal discovery and navigation platform engineered specifically for informal street vendors, urban residents, and municipal field administrators.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GALIGUIDE ZERO-COST GEOSPATIAL PHILOSOPHY                │
├──────────────────────────┬──────────────────────────────────────────────────┤
│ Basemap Rendering        │ OpenStreetMap raster tiles (tile.osm.org) via    │
│                          │ Leaflet.js at $0.00 licensing cost.              │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ Spatial Processing       │ Client-side GPU clustering (Leaflet.markercluster│
│                          │ and canvas density gradients (Leaflet.heat).     │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ Turn-by-Turn Navigation  │ Universal external Google Maps routing links:     │
│                          │ https://www.google.com/maps/dir/?api=1&dest=lat,lng│
│                          │ Launches native Google Maps app at $0.00 API fee.│
├──────────────────────────┼──────────────────────────────────────────────────┤
│ Direct Telephony         │ Native URI scheme: tel:+91XXXXXXXXXX              │
│                          │ Direct mobile dialer trigger with zero telecom   │
│                          │ proxy overhead, gated by vendor privacy consent. │
└──────────────────────────┴──────────────────────────────────────────────────┘
```

The system delivers:
- **Zero Friction for Citizens:** Instant GPS-based discovery of nearby informal artisans and thelas, live open/closed statuses, landmark directions, and one-tap calling and navigation without mandatory user accounts.
- **Zero Overhead for Vendors:** Digital discoverability without requiring vendors to own smartphones, install applications, maintain inventory catalogs, or pay platform fees.
- **Empowerment for Municipalities:** A secure back-office portal for municipal urban livelihood coordinators and field staff to onboard informal workers, pinpoint coordinates via an interactive map picker, manage verifications, and audit listings.

---

## 2. Complete Functional Specifications & User Flows

### 2.1 Public Citizen User Workflows

```
                           ┌───────────────────────────────────────────────┐
                           │               PUBLIC USER FLOW                │
                           └───────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                                       ┌───────────────────────┐
                                       │   Launch GaliGuide    │
                                       │   Web App (Root /)    │
                                       └───────────┬───────────┘
                                                   │
                                                   ▼
                                       ┌───────────────────────┐
                                       │ Request HTML5 Device  │
                                       │ Geolocation Position  │
                                       └───────────┬───────────┘
                                                   │
                                     ┌─────────────┴─────────────┐
                         [Permission Granted]             [Denied / Timeout / Fail]
                                     │                           │
                                     ▼                           ▼
                        ┌────────────────────────┐  ┌────────────────────────┐
                        │ Center map on User GPS │  │ Default to Rajwada     │
                        │ Coordinate Anchor      │  │ Display Area Dropdown  │
                        └────────────┬───────────┘  └────────────┬───────────┘
                                     │                           │
                                     └─────────────┬─────────────┘
                                                   │
                                                   ▼
                                  ┌─────────────────────────────────┐
                                  │   Synchronized Map & List View  │
                                  │   - Clustered OSM Markers       │
                                  │   - Category Pill Filter Bar    │
                                  │   - Distance-Sorted Cards       │
                                  └────────────────┬────────────────┘
                                                   │
                ┌──────────────────────────────────┼──────────────────────────────────┐
                │                                  │                                  │
                ▼                                  ▼                                  ▼
   ┌─────────────────────────┐        ┌─────────────────────────┐        ┌─────────────────────────┐
   │ Category Pill Selection │        │ Partial Keyword Search  │        │  Density Heatmap Toggle │
   │ (e.g., Key Makers)      │        │ (Debounced Bilingual)   │        │  (Leaflet L.heatLayer)  │
   └────────────┬────────────┘        └────────────┬────────────┘        └────────────┬────────────┘
                │                                  │                                  │
                └──────────────────────────────────┼──────────────────────────────────┘
                                                   │
                                                   ▼
                                  ┌─────────────────────────────────┐
                                  │   Vendor Selection Trigger      │
                                  │   - Click Map Marker OR         │
                                  │   - Click List Vendor Card      │
                                  └────────────────┬────────────────┘
                                                   │
                                                   ▼
                                  ┌─────────────────────────────────┐
                                  │    Vendor Detail Drawer/Modal   │
                                  │ - Name, Hindi Alias, Category   │
                                  │ - Verified Badge, Open Status   │
                                  │ - Landmark Guide & Distance     │
                                  │ - Operating Hours & UPI Flag    │
                                  └────────────────┬────────────────┘
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                         │                                                   │
                         ▼                                                   ▼
             ┌───────────────────────┐                           ┌───────────────────────┐
             │   Click "Call Vendor" │                           │ Click "Get Directions"│
             └───────────┬───────────┘                           └───────────┬───────────┘
                         │                                                   │
             [Consent Check]                                                 ▼
             ├── Granted: Triggers native `tel:` link            Generates Universal Google
             └── Denied: Displays "In-Person Only"               Maps routing URL (?api=1)
```

#### Flow P1: Geolocation Probe & Fallback Area Selector
1. **Entry Point:** Citizen loads GaliGuide root URL (`/`).
2. **HTML5 Geolocation Probe:** Client invokes `navigator.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 })`.
3. **Branch 1A (Permission Granted):**
   - Coordinates (`lat`, `lng`, `accuracy`) captured in client state (`useGeolocation`).
   - Map smoothly animates (`map.flyTo`) to coordinates at zoom level 14.
   - Blue pulsing "You are here" marker drops at user position.
   - Spatial discovery queries `GET /api/vendors?lat={lat}&lng={lng}&radiusKm=5.0`, populating nearby vendors sorted by ascending Haversine distance.
4. **Branch 1B (Permission Denied / Hardware Timeout / Non-Indore Location):**
   - Rejection intercepted gracefully (`PERMISSION_DENIED`, `POSITION_UNAVAILABLE`, `TIMEOUT`).
   - Non-blocking notification banner renders: *"Location access disabled or unavailable. Showing street vendors near Rajwada, Indore."*
   - Coordinate anchor automatically defaults to central Indore at Rajwada Palace (`22.719600, 75.857700`).
   - Sticky **Locality Selector Dropdown** (`#select-indore-area`) renders in header, listing 10 major commercial hubs of Indore:
     1. *Rajwada (City Heritage Center)* (`22.7186, 75.8552`)
     2. *Sarafa Bazaar (Night Chaat Market)* (`22.7196, 75.8577`)
     3. *Chappan Dukan (New Palasia Food Hub)* (`22.7244, 75.8839`)
     4. *Palasia / Old Palasia (Commercial Corridor)* (`22.7220, 75.8872`)
     5. *Vijay Nagar / Scheme 54 (Northern Hub)* (`22.7533, 75.8937`)
     6. *Bhanwarkuan (Coaching & Student Hub)* (`22.6933, 75.8667`)
     7. *Annapurna (Temple & Earthenware Market)* (`22.6950, 75.8360`)
     8. *Malwa Mill (Hardware & Mechanics Corridor)* (`22.7302, 75.8710`)
     9. *Jail Road (Electronics & Tailoring Hub)* (`22.7210, 75.8630`)
     10. *MT Cloth Market (Traditional Textile Alley)* (`22.7170, 75.8505`)
   - Selecting any area immediately recenters the map, updates anchor coordinates, and re-queries vendors relative to the new locality centroid.

#### Flow P2: Real-time Partial Keyword Search with Bilingual / Hindi Matching
1. **User Action:** Citizen inputs text into the top search bar (e.g., `"chabi"`, `"dhar"`, `"garadu"`, `"मोची"`).
2. **Debounce Mechanism:** Client applies a 300 ms debounce before dispatching requests, preserving network capacity and maintaining 60 fps typing responsiveness.
3. **Execution & Backend SQL:** Client dispatches `GET /api/vendors?search={query}&lat={lat}&lng={lng}`. Backend executes parameterized multi-attribute SQL pattern matching (`ILIKE %query%`) across:
   - Vendor commercial name (e.g., `"Johny Hot Dog"`)
   - Native Devanagari Hindi alias (e.g., `"जॉनी हॉट डॉग"`, `"रामू मोची"`)
   - Category name and slug (e.g., `"Street Food & Chaat"`, `"cobbler"`)
   - Physical landmark descriptions (e.g., `"Opposite High Court Gate 2"`, `"Bholaram Marg"`)
   - Service specialties and colloquial tags (e.g., `"Khopra Patties"`, `"computerized key"`, `"puncture"`, `"raffu"`)
4. **Reactive UI Update:**
   - Leaflet map updates: non-matching pins are removed; matching pins are retained.
   - Map bounds smoothly animate (`map.fitBounds`) to encapsulate matching pins.
   - Vendor list renders matching vendor cards with highlighted search query substrings.
   - If 0 vendors match, a clean empty state displays: *"No street vendors found matching '{query}'. Try searching for 'chai', 'chabi', 'mochi', or select a category below."*

#### Flow P3: Synchronized Dual Map vs. List Views with Hotspot Overlays
1. **Responsive Viewport Layouts:**
   - **Desktop Viewport (>= 1024px):** Side-by-side split screen layout. Left pane (440px) hosts scrollable, distance-sorted vendor cards; right pane occupies full remaining viewport with interactive Leaflet map canvas.
   - **Mobile Viewport (< 1024px):** Sticky bottom navigation bar switches seamlessly between **Map View** (full bleed with active vendor bottom peek card) and **List View** (full scrollable feed of vendor cards).
2. **Bidirectional Interactive Synchronization:**
   - **List Card -> Map Pin:** Clicking or hovering over any vendor card in list view triggers `map.panTo([vendor.lat, vendor.lng])`, opens the marker's interactive popup, and applies a pulsing ring animation.
   - **Map Pin -> List Card:** Clicking any marker pin on the map opens its popup and smoothly scrolls the corresponding vendor card into full view (`element.scrollIntoView({ behavior: 'smooth', block: 'center' })`), highlighting its container with an emerald border.
3. **Marker Clustering & Spiderfication:**
   - In dense commercial zones (e.g., Sarafa Bazaar or Chappan Dukan where 20+ stalls exist within 150m), pins automatically group into `leaflet.markercluster` aggregate badges with color-coded density rings (`cluster-small` < 10, `cluster-medium` 10-25, `cluster-large` > 25).
   - Clicking a cluster zooms into the bounding box of that group.
   - At maximum zoom level (zoom 18), clicking a cluster triggers radial **spiderfication**—fanning out co-located markers in a circular or spiral formation—allowing precise selection of individual adjacent carts.
4. **Density Heatmap Mode Overlay:**
   - A floating "Heatmap" toggle on the Leaflet canvas switches the display from discrete pins to a continuous `Leaflet.heat` canvas layer (`L.heatLayer`).
   - The heatmap renders weighted density gradients representing vendor concentrations across Indore using a 5-tier color spectrum: Blue (Low) -> Emerald (Moderate) -> Amber (High) -> Red (Very High) -> Purple (Extreme Commercial Hotspot).
   - Toggling back to "Markers" restores clustered pins instantly.

#### Flow P4: Vendor Profile Inspection, Device Dialer (`tel:`), & Google Maps Navigation
1. **Activation:** User taps a map marker popup or clicks a vendor card in the list.
2. **Presentation:** Slide-up bottom sheet drawer on mobile viewports (< 768px); floating slide-over drawer on desktop viewports (>= 768px).
3. **Comprehensive Attribute Display:**
   - Business Trade Name & Local Devanagari Hindi Script Name
   - Category Badge with category color accent and Lucide icon
   - Official Verification Shield (Green checkmark shield: *"Verified GaliGuide Vendor"*; Amber outline: *"Community Listed (Unverified)"*)
   - Real-time Walking / Driving Distance from active anchor (e.g., *"180 m away • ~3 min walk"*)
   - Live Operational Status Badge:
     - `"Open Now"` in emerald green with pulsating live indicator dot
     - `"Closed • Opens at 08:30 AM"` in dark amber/red
     - Evaluated dynamically against current local time and vendor's 7-day schedule (including overnight midnight-crossing schedules)
   - Detailed Topological Landmark Guide (e.g., *"Situated on the sidewalk outside Gate No. 2, MP High Court Bench, MG Road"*).
   - Cart Mobility Type (*"Fixed Semi-Permanent Kiosk"*, *"Sidewalk Spot"*, *"Mobile Pushcart / Thela"*, *"Cycle-Mounted Cart"*).
   - Accepted Payment Modes (*Cash*, *UPI / QR Code*).
   - Specialty Items and Services notes (e.g., *"Specializes in laser key duplication, computer car keys"*).
4. **Action Trigger A: One-Touch Device Calling (`tel:`):**
   - User clicks prominent emerald **"Call Vendor"** action button.
   - **Privacy Consent Check:**
     - If `phoneConsentGiven === true`, button is hyperlinked to `tel:+91XXXXXXXXXX`. Tapping launches native phone dialer with number pre-filled.
     - If `phoneConsentGiven === false` or phone number is absent, button is disabled or replaced with notice: *"In-Person Visit Only (No Public Phone)"*.
5. **Action Trigger B: External Turn-by-Turn Navigation:**
   - User clicks prominent indigo **"Get Directions"** action button.
   - Application generates universal Google Maps routing hyperlink:
     `https://www.google.com/maps/dir/?api=1&destination=22.719600,75.857700`
   - Link opens in new tab (`target="_blank" rel="noopener noreferrer"`), triggering native Google Maps mobile application on Android/iOS or Google Maps web on desktop.
   - Zero billable Google Maps Platform API calls incurred.

---

### 2.2 Administrator Workflows

```
                           ┌───────────────────────────────────────────────┐
                           │             ADMINISTRATOR FLOW                │
                           └───────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                                       ┌───────────────────────┐
                                       │ Access /admin/login   │
                                       └───────────┬───────────┘
                                                   │
                                                   ▼
                                       ┌───────────────────────┐
                                       │ Enter Email & Pass    │
                                       │ Validate via bcrypt   │
                                       └───────────┬───────────┘
                                                   │
                                     ┌─────────────┴─────────────┐
                                  [Invalid]                   [Valid]
                                     │                           │
                                     ▼                           ▼
                        ┌────────────────────────┐  ┌────────────────────────┐
                        │ Show 401 Error Toast   │  │ Issue 24h JWT Bearer   │
                        │ Retain login form state│  │ Redirect to /admin/    │
                        └────────────────────────┘  └────────────┬───────────┘
                                                                 │
                                                                 ▼
                                                    ┌────────────────────────┐
                                                    │ Administrative Portal  │
                                                    │ - Vendor Data Table    │
                                                    │ - Search & Pagination  │
                                                    │ - Category Filters     │
                                                    └────────────┬───────────┘
                                                                 │
                                     ┌───────────────────────────┴───────────────────────────┐
                                     │                                                       │
                                     ▼                                                       ▼
                        ┌────────────────────────┐                              ┌────────────────────────┐
                        │ "+ Onboard New Vendor" │                              │  Inline Table Actions  │
                        └────────────┬───────────┘                              └────────────┬───────────┘
                                     │                                                       │
                                     ▼                                          ┌────────────┴───────────┐
                        ┌────────────────────────┐                              │                        │
                        │ Vendor Form with       │                              ▼                        ▼
                        │ Interactive Map Picker │                 ┌───────────────────────┐ ┌───────────────────────┐
                        │ - Input Name & Trade   │                 │ Toggle `isVerified`   │ │ Edit / Soft-Delete    │
                        │ - Set Phone & Consent  │                 │ Instant DB Update     │ │ Vendor Listing Record │
                        │ - Click/Drag Pin on Map│                 └───────────────────────┘ └───────────────────────┘
                        │ - Auto-sync Lat/Lng    │
                        └────────────┬───────────┘
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │ Submit -> PostgreSQL   │
                        │ Real-time Public Sync  │
                        └────────────────────────┘
```

#### Flow A1: Secure Administrator Authentication & Session Lifecycle
1. **Access Point:** Administrator navigates to `/admin/login`.
2. **Submission & Verification:** Admin inputs registered email (e.g., `admin@galiguide.in`) and password. Request dispatches `POST /api/admin/auth/login`.
3. **Backend Cryptography:** Server queries `AdminUser` record, executes `bcrypt.compare` against stored salt-hashed password (cost factor 12), and generates HMAC-SHA256 (`HS256`) JSON Web Token (JWT) with 24-hour expiration containing claims `{ id, email, role }`.
4. **Session Persistence:** Client persists token in `localStorage` (`galiguide_admin_token`). Global Axios client automatically attaches `Authorization: Bearer <token>` to administrative requests.
5. **Route Protection:** React Router `<ProtectedRoute>` guards `/admin/*` routes. Express middleware `authenticateAdmin` and `requireRole('SUPER_ADMIN')` protect server endpoints.
6. **Session Invalidation:** On HTTP 401 token expiration, response interceptor clears client storage and redirects to `/admin/login` with informational session expiration toast.

#### Flow A2: Comprehensive Vendor CRUD Lifecycle
1. **Dashboard & Moderation Queue:** Logged-in admin views `/admin/vendors` data table displaying vendors with sorting, category filtering, verification status filters (`PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED`), and search.
2. **Vendor Creation Flow:**
   - Admin clicks **"+ Onboard New Vendor"**.
   - Multi-section modal opens:
     1. *Core Identity:* Trade Name, Hindi Alias, Primary Category dropdown, Description.
     2. *Contact & Privacy:* Contact Phone, WhatsApp Phone, Phone Consent Checkbox (`phoneConsentGiven`), Consent Obtained Checkbox.
     3. *Geospatial Data:* Area dropdown, Topological Landmark Description, Street Address, Interactive Leaflet Coordinate Picker.
     4. *Operating Schedule:* Weekly Day-by-Day Opening and Closing Times (24-hour format).
     5. *Status:* Initial status dropdown (`VERIFIED` or `PENDING`).
   - Admin submits form; client dispatches `POST /api/admin/vendors`. Backend validates schema with Zod, creates `Vendor` record with UUIDv4, creates linked `OperatingHour` records, generates immutable `AuditLog` entry, and returns created entity.
3. **Vendor Edit & Deactivation:**
   - Admin clicks "Edit" to modify vendor details or adjust spatial coordinates. Dispatches `PUT /api/admin/vendors/:id`.
   - Admin can deactivate (soft-delete) or permanently delete a vendor (`DELETE /api/admin/vendors/:id`, restricted to `SUPER_ADMIN`), cascading to operating schedules while preserving audit traceability.

#### Flow A3: Interactive Map Coordinate Picker (Click & Draggable Marker)
1. **Map Picker Initialization:** Embedded Leaflet canvas initializes within the Vendor modal.
2. **Centering:** Default center aligns with selected Area centroid or previous coordinates. Quick-jump buttons allow instant centering on Sarafa, Chappan Dukan, Rajwada, Palasia, or Vijay Nagar.
3. **Click-to-Place Interaction:** Admin clicks target point on OpenStreetMap tile (e.g. sidewalk corner). An interactive red marker drops at that exact location.
4. **Draggable Refinement:**
   - Marker configured with `{ draggable: true }`.
   - Moving the pin updates the form's **Latitude** and **Longitude** numeric inputs in real time (< 50ms) formatted to 6 decimal places (~0.11 m precision).
5. **Reverse Text Input Sync:** Typing numeric coordinates directly into form fields repositions the marker pin and centers the map canvas.

#### Flow A4: Inline Verification Toggle & Audit Logging
1. **One-Tap Verification:** Admin clicks inline verification switch in the admin data table for an unverified vendor.
2. **Atomic Mutation:** Client dispatches `PATCH /api/admin/vendors/:id/verify` with `{ status: "VERIFIED", reason: "Field inspection confirmed physical pushcart spot" }`.
3. **Audit Trail Recording:** Server executes an ACID transaction updating `status` to `VERIFIED`, setting `verifiedAt = NOW()`, `verifiedById = admin.id`, and appending an immutable entry to `audit_logs` storing previous state, new state, admin ID, IP address, and justification note.
4. **Instant Public Sync:** Public queries immediately reflect the green verified shield.

---

## 3. Comprehensive Edge Cases & Defensive Safeguards

The table below catalogs all 22 specified edge cases (`EC-01` through `EC-22`), their conditions, and guaranteed system behaviors:

| Code | Feature Area | Trigger Condition | Guaranteed System Behavior & Safeguard |
|---|---|---|---|
| **EC-01** | Geolocation Prompt | User explicitly clicks "Block" or "Deny" on browser geolocation prompt. | Browser catches `PERMISSION_DENIED`. App displays non-blocking toast: *"Location permission denied. Showing street vendors near Rajwada, Indore."* Coordinate anchor defaults to Rajwada (`22.719600, 75.857700`). Sticky Locality Dropdown appears in navbar. UI does not crash or freeze. |
| **EC-02** | Geolocation Hardware | Device GPS times out (> 8000 ms) or hardware is unavailable. | Catches `TIMEOUT` or `POSITION_UNAVAILABLE`. Cancels pending promise. Defaults coordinate anchor to Rajwada center and prompts user to pick an Indore locality from the dropdown. |
| **EC-03** | User Outside City | User accesses app from another city/state (> 50 km from Indore centroid). | Distance calculated > 50 km. Displays informational banner: *"You are viewing street vendors in Indore. Pick an area below to explore."* Sets map center to Rajwada, zoom 13. Distance badges indicate distance from Indore center or selected area. |
| **EC-04** | Search Input | User enters whitespace-only, emoji, or regex special characters (`"   "`, `"@#$%^&*"`). | Client and server trim input. Regex special characters escaped safely. Empty or whitespace queries are ignored, returning standard unfiltered distance-sorted list without 500 error. |
| **EC-05** | Search Input | User types single character (e.g., `"c"` or `"म"`). | 300 ms debounce executes query. Backend evaluates `ILIKE '%c%'`. Returns valid matching vendor subset without database crash or performance lag. |
| **EC-06** | Search Input | User searches colloquial slang or misspelled term with 0 direct matches (e.g., `"chappal tuti"`). | Backend checks tag aliases; if 0 results match, UI displays helpful zero-state: *"No direct matches for '{query}'. Looking for shoe repair? Try searching 'Mochi' or select 'Cobblers' below."* |
| **EC-07** | Category Filter | User selects category with zero registered vendors in current locality (e.g., Pottery in Palasia). | Map markers for that category clear cleanly. List displays friendly empty state: *"No pottery artisans found in this immediate area. Explore Rajwada or Annapurna for traditional pottery."* |
| **EC-08** | Category Filter | Rapid multi-clicking of category pills in quick succession (< 200 ms). | Client state updates synchronously. Previous in-flight fetch requests are aborted using `AbortController`. UI renders only the final selected category without UI race conditions. |
| **EC-09** | Map Viewport | User zooms out to entire country or state level (zoom < 10). | MarkerCluster combines all Indore vendors into a single unified badge. Map displays gentle overlay pill: *"Zoom in to explore street-level vendors in Indore"*. Prevents browser DOM overloading. |
| **EC-10** | Map Viewport | Multiple vendors share identical or proximate coordinates (e.g., 6 food stalls at Chappan Dukan). | Leaflet MarkerCluster aggregates pins. When clicked at maximum zoom (zoom 18), pins spiderfy radially into a circle so every individual vendor stall can be selected without overlap. |
| **EC-11** | Heatmap Layer | User toggles Heatmap mode when active category filter yields 0 vendors. | Heatmap layer renders blank canvas without throwing uncaught exceptions. Empty-state overlay displays: *"No vendor density data to display for this filter."* |
| **EC-12** | Map-List Sync | User clicks list card for vendor located outside current visible map bounds. | Map executes smooth `flyTo([vendor.lat, vendor.lng], 16)` animation, panning and zooming directly to the vendor's location and opening its marker popup. |
| **EC-13** | Operating Hours | Vendor operates an overnight shift crossing midnight (e.g., Sarafa night stall open 19:00 to 02:00). | Live status evaluation logic handles midnight rollover: if `closeTime < openTime`, vendor is considered "Open Now" if current time is `>= openTime` OR `< closeTime`. At 01:30 AM, vendor correctly shows *"Open Now (Closes 02:00 AM)"*. |
| **EC-14** | Phone Privacy | Vendor phone number is missing or vendor withheld phone consent (`phoneConsentGiven: false`). | Public API payload sets `contactPhone: null`. Vendor detail drawer hides the phone number and replaces the "Call Vendor" button with an inactive badge: *"In-Person Visit Only (No phone listed)"*. |
| **EC-15** | Navigation Trigger | User clicks "Get Directions" on desktop browser without GPS hardware. | Browser opens Google Maps directions URL (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`). Google Maps web opens with destination locked and prompts user to enter their starting location. |
| **EC-16** | Admin Login | Admin enters incorrect password or non-existent email. | Server responds with HTTP 401 Unauthorized `{ message: "Invalid email or password" }`. Login form displays clean error banner without disclosing whether the email exists. |
| **EC-17** | Admin Session | Admin JWT token expires after 24 hours while admin is actively working. | Next API request returns HTTP 401. Response interceptor intercepts 401, clears invalid token from `localStorage`, and redirects to `/admin/login` with toast: *"Your session has expired. Please log in again."* |
| **EC-18** | Admin Form | Admin inputs invalid coordinates (e.g., Lat 120.0, Lng -200.0) manually into form fields. | Zod backend validation and HTML5 form validation reject payload: *"Latitude must be between -90 and 90; Longitude must be between -180 and 180."* Form prevents submission. |
| **EC-19** | Admin Coordinate Picker | Admin drops or drags coordinate pin outside the Indore metropolitan boundary (> 30 km from city center). | Map coordinate picker displays warning banner: *"Note: Selected coordinates appear to be outside the Indore metropolitan area. Please verify."* Does not strictly block (permits peri-urban expansion) but requires confirmation. |
| **EC-20** | Verification Toggle | Admin rapidly toggles verification switch multiple times in succession. | Switch UI uses optimistic UI updates with debounce. Backend executes atomic SQL update (`UPDATE vendors SET "isVerified" = $1 WHERE id = $2`) avoiding race conditions. |
| **EC-21** | Route Protection | Unauthenticated user navigates directly to `/admin/dashboard` or `/admin/vendors`. | React Router protected route checks auth context; detecting missing token, immediately redirects to `/admin/login`. Direct curl requests to `/api/admin/*` return HTTP 401. |
| **EC-22** | Anti-Scraping | Automated bot or malicious actor attempts rapid harvesting of vendor database. | Express `express-rate-limit` halts requests exceeding 100 requests per 15-minute window per IP, returning HTTP 429 Too Many Requests with descriptive `Retry-After` header. |

---

## 4. Technical Architecture, Data Modeling & Spatial Engine

### 4.1 System Topology & Architectural Invariants
GaliGuide follows a decoupled 3-tier architecture:
- **Client Tier:** React 18 SPA built with Vite and Tailwind CSS. Manages Leaflet mapping, marker clustering, heatmap overlays, and reactive state.
- **Application Tier:** Node.js 20 LTS with Express 4.19. Handles Helmet Content Security Policy (whitelisting OpenStreetMap tile domains), CORS, rate limiting, Zod request schema validation, JWT auth, and raw SQL spatial queries.
- **Data Persistence Tier:** PostgreSQL 15+ managed via Prisma ORM 5.19. Stores relational entities, WGS84 double-precision coordinates, weekly operating schedules, and immutable audit logs.

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

### 4.2 Complete Normalized Prisma Schema (`server/prisma/schema.prisma`)

```prisma
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
  icon         String         @db.VarChar(50)  // Lucide icon identifier
  color        String         @db.VarChar(20)  // Hex color code (e.g., "#F26522")
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
  name         String         @unique @db.VarChar(100)
  slug         String         @unique @db.VarChar(100)
  pincode      String?        @db.VarChar(10)
  latitude     Float          @db.DoublePrecision     // Centroid latitude
  longitude    Float          @db.DoublePrecision     // Centroid longitude
  boundsMinLat Float?         @db.DoublePrecision     // Bounding box
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
  hindiName       String?         @db.VarChar(150) // Local Hindi script alias
  description     String?         @db.Text
  contactPhone    String?         @db.VarChar(20)  // Primary mobile number for device dialer
  whatsappPhone   String?         @db.VarChar(20)  // Direct messaging contact
  
  // Geospatial Coordinates (WGS84 Datum)
  latitude        Float           @db.DoublePrecision // Precise GPS latitude (-90 to +90)
  longitude       Float           @db.DoublePrecision // Precise GPS longitude (-180 to +180)
  landmark        String          @db.VarChar(255)    // Hyperlocal landmark anchor
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
  snapshot   Json?       // JSON diff or state snapshot at time of modification
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

### 4.3 Coordinate Storage Rationale: IEEE 754 `Double Precision`
- **Native CPU Speed:** PostgreSQL mathematical functions (`sin`, `cos`, `acos`, `radians`) execute natively on 64-bit floating point numbers (`float8` / `Double Precision`). Storing coordinates as fixed-point `Decimal` incurs a 35–45% CPU penalty due to repeated runtime casting during spatial evaluations.
- **Precision:** 64-bit float allocates 53 bits of significand precision (~15–17 decimal digits). At 6 decimal places, geographic resolution is $\approx 0.11\text{ meters}$ ($11\text{ cm}$). This exceeds consumer GPS accuracy (3–5 meters) by two orders of magnitude while guaranteeing hardware floating-point calculation speeds.
- **Spatial B-Tree Indexing:** The composite index `@@index([latitude, longitude])` enables range scans on rectangular bounding boxes, pruning >99% of non-candidate vendors before running trigonometric equations.

### 4.4 Two-Tier Haversine & Spatial Query Engine
The distance between user $(\text{lat}_1, \text{lng}_1)$ and vendor $(\text{lat}_2, \text{lng}_2)$ on a spherical Earth ($R = 6,371.0\text{ km}$) is calculated using the clamped Spherical Law of Cosines:

$$d = R \cdot \arccos\left(\min\left(1.0, \max\left(-1.0, \sin(\phi_1)\sin(\phi_2) + \cos(\phi_1)\cos(\phi_2)\cos(\lambda_2 - \lambda_1)\right)\right)\right)$$

The two-tier query pipeline:
1. **Tier 1 (B-Tree BBox Pruning):** Computes $\Delta\text{lat} = \frac{r}{111.045}$ and $\Delta\text{lng} = \frac{r}{111.045 \cdot \cos(\text{rad}(\text{lat}))}$. Executes indexed `latitude BETWEEN minLat AND maxLat AND longitude BETWEEN minLng AND maxLng`.
2. **Tier 2 (Trigonometric Evaluation):** Calculates exact `distanceKm` on pruned candidate rows via Prisma `$queryRaw`, filters `WHERE distanceKm <= radiusKm`, and orders `ORDER BY distanceKm ASC`.

---

## 5. Complete RESTful API Contracts

All endpoints utilize standard JSON wrappers and explicit HTTP status codes.

### Standard JSON Envelopes
- **Success (`200 OK`, `201 Created`):**
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "page": 1, "limit": 20, "totalCount": 22, "totalPages": 2 }
  }
  ```
- **Error (`400`, `401`, `403`, `404`, `409`, `429`, `500`):**
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "The supplied request parameters failed schema validation",
      "details": [{ "field": "latitude", "message": "Number must be between -90 and 90" }]
    }
  }
  ```

### 5.1 Public APIs

#### 1. `GET /api/categories`
- **Method:** `GET` | **Auth:** Public
- **Description:** Returns active vendor categories with dynamic verified vendor counts.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "c1f7b02e-4b2a-43d9-95e2-228795da0f91",
        "name": "Street Food & Chaat",
        "slug": "street-food",
        "description": "Indori poha-jalebi, khopra patties, dahi bada, hot dogs, and night bazaar delicacies",
        "icon": "utensils",
        "color": "#F26522",
        "displayOrder": 1,
        "vendorCount": 5
      }
    ]
  }
  ```

#### 2. `GET /api/vendors`
- **Method:** `GET` | **Auth:** Public
- **Description:** Discovery search endpoint. Supports spatial proximity, category filter, debounced bilingual search, and bounding box queries.
- **Zod Validation Schema:**
  ```typescript
  export const vendorsQuerySchema = z.object({
    categoryId: z.string().uuid().optional(),
    category: z.string().optional(), // Slug support
    areaId: z.string().uuid().optional(),
    search: z.string().max(100).optional(),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    radiusKm: z.coerce.number().min(0.1).max(50.0).default(5.0),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  });
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "7b68a4e3-5c21-4f1a-b60b-8d021f14ec7b",
        "name": "Johny Hot Dog",
        "hindiName": "जॉनी हॉट डॉग",
        "description": "[Stall Type: SEMI_PERMANENT_KIOSK] Indore's iconic street hot dog stall founded by Vijay Singh Rathore in 1978.",
        "contactPhone": "+919826012345",
        "latitude": 22.7244,
        "longitude": 75.8839,
        "landmark": "Shop No. 27, Chappan Dukan, near central pedestrian fountain",
        "addressLine": "Chappan Dukan, New Palasia, Indore, MP 452001",
        "status": "VERIFIED",
        "isVerified": true,
        "isPhonePublic": true,
        "category": { "id": "uuid", "name": "Street Food & Chaat", "slug": "street-food", "icon": "utensils", "color": "#F26522" },
        "area": { "id": "uuid", "name": "Chappan Dukan" },
        "distanceKm": 0.43,
        "operatingHoursToday": { "dayOfWeek": "TUESDAY", "openTime": "10:00", "closeTime": "22:30", "isOpenNow": true }
      }
    ],
    "meta": { "page": 1, "limit": 20, "totalCount": 21, "totalPages": 2 }
  }
  ```

#### 3. `GET /api/vendors/:id`
- **Method:** `GET` | **Auth:** Public
- **Description:** Returns single vendor profile with weekly schedules and navigation deep links. Masks phone if `isPhonePublic === false`.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7b68a4e3-5c21-4f1a-b60b-8d021f14ec7b",
      "name": "Johny Hot Dog",
      "hindiName": "जॉनी हॉट डॉग",
      "contactPhone": "+919826012345",
      "isPhonePublic": true,
      "latitude": 22.7244,
      "longitude": 75.8839,
      "landmark": "Shop No. 27, Chappan Dukan",
      "status": "VERIFIED",
      "isVerified": true,
      "operatingHours": [
        { "dayOfWeek": "MONDAY", "openTime": "10:00", "closeTime": "22:30", "isClosed": false }
      ],
      "navigation": {
        "googleMapsUrl": "https://www.google.com/maps/dir/?api=1&destination=22.7244,75.8839",
        "telUri": "tel:+919826012345"
      }
    }
  }
  ```

#### 4. `GET /api/vendors/heatmap`
- **Method:** `GET` | **Auth:** Public
- **Description:** Returns coordinate intensity triplets `[[lat, lng, weight], ...]` for direct consumption by `L.heatLayer()`.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      [22.7244, 75.8839, 1.0],
      [22.7197, 75.8578, 1.0],
      [22.7195, 75.8576, 1.0]
    ],
    "meta": { "pointCount": 21 }
  }
  ```

#### 5. `GET /api/areas`
- **Method:** `GET` | **Auth:** Public
- **Description:** Returns 10 predefined Indore administrative localities with centroid coordinates for manual geolocation fallback navigation.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "3b2e1a09-7f6d-4b8c-a1e2-998877665544",
        "name": "Sarafa Bazaar",
        "slug": "sarafa-bazaar",
        "pincode": "452002",
        "latitude": 22.7196,
        "longitude": 75.8577,
        "vendorCount": 4
      }
    ]
  }
  ```

---

### 5.2 Admin Authentication APIs

#### 6. `POST /api/admin/auth/login`
- **Method:** `POST` | **Auth:** Public
- **Zod Schema:**
  ```typescript
  export const adminLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "admin": {
        "id": "8f3a9e21-0a4b-4c5d-9e6f-7a8b9c0d1e2f",
        "email": "admin@galiguide.in",
        "name": "Indore Municipal Ward Lead",
        "role": "SUPER_ADMIN"
      }
    }
  }
  ```

#### 7. `GET /api/admin/auth/me`
- **Method:** `GET` | **Auth:** Bearer JWT (`ADMIN` or `SUPER_ADMIN`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "8f3a9e21-0a4b-4c5d-9e6f-7a8b9c0d1e2f",
      "email": "admin@galiguide.in",
      "name": "Indore Municipal Ward Lead",
      "role": "SUPER_ADMIN"
    }
  }
  ```

---

### 5.3 Admin Vendor Management APIs

#### 8. `GET /api/admin/vendors`
- **Method:** `GET` | **Auth:** Bearer JWT (`ADMIN` or `SUPER_ADMIN`)
- **Query Params:** `status`, `categoryId`, `areaId`, `search`, `page`, `limit`
- **Response (200 OK):** Returns all vendors including `PENDING`, `REJECTED`, and unmasked contact numbers.

#### 9. `POST /api/admin/vendors`
- **Method:** `POST` | **Auth:** Bearer JWT (`ADMIN` or `SUPER_ADMIN`)
- **Zod Schema:**
  ```typescript
  export const createVendorSchema = z.object({
    name: z.string().min(2).max(150),
    hindiName: z.string().max(150).optional().nullable(),
    description: z.string().max(1000).optional().nullable(),
    contactPhone: z.string().regex(/^\+?[0-9]{10,15}$/).optional().nullable(),
    whatsappPhone: z.string().regex(/^\+?[0-9]{10,15}$/).optional().nullable(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    landmark: z.string().min(3).max(255),
    addressLine: z.string().max(255).optional().nullable(),
    categoryId: z.string().uuid(),
    areaId: z.string().uuid().optional().nullable(),
    status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED']).default('VERIFIED'),
    isVerified: z.boolean().default(true),
    consentObtained: z.boolean().default(true),
    isPhonePublic: z.boolean().default(true),
    operatingHours: z.array(z.object({
      dayOfWeek: z.enum(['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']),
      openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      isClosed: z.boolean().default(false),
    })).optional(),
  });
  ```
- **Response (201 Created):** `{ "success": true, "data": { "id": "uuid", "name": "...", "status": "VERIFIED" } }`

#### 10. `PUT /api/admin/vendors/:id`
- **Method:** `PUT` | **Auth:** Bearer JWT (`ADMIN` or `SUPER_ADMIN`)
- **Description:** Updates vendor attributes, pin coordinates, and schedules.
- **Response (200 OK):** `{ "success": true, "data": { "id": "uuid", "updatedAt": "..." } }`

#### 11. `PATCH /api/admin/vendors/:id/verify`
- **Method:** `PATCH` | **Auth:** Bearer JWT (`ADMIN` or `SUPER_ADMIN`)
- **Zod Schema:**
  ```typescript
  export const verifyVendorSchema = z.object({
    status: z.enum(['VERIFIED', 'REJECTED', 'SUSPENDED', 'PENDING']),
    reason: z.string().min(5).max(500),
  });
  ```
- **Description:** Toggles vendor verification in an ACID transaction and writes immutable `AuditLog` entry.
- **Response (200 OK):** `{ "success": true, "data": { "id": "uuid", "status": "VERIFIED", "isVerified": true, "auditLogId": "uuid" } }`

#### 12. `DELETE /api/admin/vendors/:id`
- **Method:** `DELETE` | **Auth:** Bearer JWT (`SUPER_ADMIN` only)
- **Description:** Deletes vendor record and cascades deletion to schedules and audit logs.
- **Response (200 OK):** `{ "success": true, "message": "Vendor record successfully deleted" }`

---

### 5.4 Admin Category Taxonomy APIs

#### 13. `GET /api/admin/categories`
- **Method:** `GET` | **Auth:** Bearer JWT (`ADMIN` or `SUPER_ADMIN`)
- **Description:** Returns all categories including inactive ones.

#### 14. `POST /api/admin/categories`
- **Method:** `POST` | **Auth:** Bearer JWT (`SUPER_ADMIN` only)
- **Zod Schema:**
  ```typescript
  export const createCategorySchema = z.object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
    description: z.string().max(500).optional(),
    icon: z.string().min(2).max(50),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  });
  ```
- **Response (201 Created):** Returns created category entity.

---

## 6. Interactive Leaflet Map Architecture

### 6.1 Basemap Tile Configuration
Leaflet renders free OpenStreetMap standard raster tiles with round-robin subdomains:
- **URL Template:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Subdomains:** `['a', 'b', 'c']`
- **Zoom Constraints:** `minZoom: 11`, `maxZoom: 19`, initial view at Indore (`22.719600, 75.857700`, zoom 14).
- **Attribution:** `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`.
- **Zero API Expenditure:** Incurs zero commercial mapping API licensing costs.

### 6.2 MarkerCluster Dynamic CSS Badges & Spiderfication
Pins group into `leaflet.markercluster` aggregate badges with three distinct visual tiers:
- `cluster-small` (< 10 markers): Diameter 36px, saffron gradient (`#f97316` to `#ea580c`), white border.
- `cluster-medium` (10–25 markers): Diameter 42px, rose red gradient (`#e11d48` to `#be123c`), white border.
- `cluster-large` (> 25 markers): Diameter 48px, purple gradient (`#7c3aed` to `#6d28d9`), white border.
- **Spiderfication:** At maximum zoom (zoom 18), overlapping markers fan out radially, enabling unambiguous tap target selection.

### 6.3 Density Heatmap Layer (`Leaflet.heat`)
Canvas-based density layer rendering commercial vendor intensity gradients across Indore:
- **Radius:** 28px | **Blur:** 18px | **Max Zoom:** 17 | **Min Opacity:** 0.35
- **5-Tier Color Stops:**
  - `0.2`: `#3b82f6` (Low density — Blue)
  - `0.4`: `#10b981` (Moderate density — Emerald)
  - `0.6`: `#f59e0b` (High density — Amber)
  - `0.8`: `#ef4444` (Very high density — Red)
  - `1.0`: `#7c3aed` (Extreme commercial hub — Purple)

### 6.4 Custom SVG `DivIcon` Category Pins
Pins are rendered via high-DPI custom SVG `DivIcon` components:
- **Dimensions:** 32px width × 42px height, anchor point `[16, 42]`, popup anchor `[0, -38]`.
- **Category Fill:** SVG path fill matches category hex color (`#F26522`, `#D97706`, `#8B5A2B`, `#D4AF37`, etc.).
- **Center Circle:** White circular knockout (`r=8`).
- **Verification Shield Overlay:** When `isVerified === true`, a 14×14px emerald green circular badge with white SVG checkmark overlays the top-right corner of the pin.

### 6.5 Admin Coordinate Drag & Click Picker
Embedded Leaflet canvas in administrative onboarding form:
- Clicking anywhere drops a high-visibility marker pin.
- Marker configured with `{ draggable: true }`.
- Dragging pin dynamically extracts `event.latlng` and updates form input fields in real time with 6 decimal places (~0.11 m resolution).

---

## 7. Engineering Roadmap & Monorepo Structure

### 7.1 Monorepo Layout
```
galiguide/
├── package.json                         # Root monorepo workspace configuration
├── .gitignore                           # Git ignore rules
├── .env.example                         # Master environment template
├── README.md                            # Comprehensive developer onboarding & runbook
├── TEST_INFRA.md                        # Master E2E testing infrastructure specification
├── TEST_READY.md                        # E2E test execution readiness checklist
│
├── docs/                                # Authoritative Specifications
│   ├── PRD.md                           # Product Requirements Document
│   ├── TECHNICAL_DESIGN.md              # Technical Architecture & API Specifications
│   ├── IMPLEMENTATION_ROADMAP.md        # 7-Phase Engineering Roadmap
│   ├── VERIFICATION_RUBRIC.md           # 14-Point Acceptance Criteria Test Rubric
│   └── PRODUCTION_SPECIFICATION.md      # This Master Production Specification
│
├── scripts/                             # Zero-Dependency Verification Tools
│   ├── verify_galiguide.sh              # POSIX Bash 14-PAC automated test script
│   └── verify_galiguide.ps1             # Windows PowerShell 14-PAC automated test script
│
├── client/                              # React 18 + Vite Frontend Application
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── index.html
│   ├── e2e/                             # Playwright Browser Test Suite
│   └── src/
│       ├── main.tsx                     # Entry point
│       ├── App.tsx                      # Root scaffolding
│       ├── components/                  # map/, vendor/, admin/, common/
│       ├── hooks/                       # useGeolocation, useVendors, useAdminAuth
│       └── utils/                       # haversine, navigation, formatters
│
└── server/                              # Node.js + Express + Prisma REST API
    ├── package.json
    ├── tsconfig.json
    ├── server.ts                        # HTTP server bootstrap
    ├── prisma/
    │   ├── schema.prisma                # PostgreSQL relational models
    │   └── seed.ts                      # Authentic 22 Indore vendor seed script
    ├── __tests__/                       # Jest & Supertest Integration Suite
    └── src/
        ├── app.ts                       # Express pipeline & middleware
        ├── controllers/                 # vendor, category, area, auth controllers
        ├── middleware/                  # auth, validate, rateLimiter, errorHandler
        ├── routes/                      # API endpoint definitions
        └── services/                    # spatialService, auditService
```

### 7.2 The 7 Engineering Phases
1. **Phase 1: Environment Setup & Monorepo Scaffolding:** Workspaces setup, Vite client with Tailwind Malwa palette, Express server with TypeScript.
2. **Phase 2: Database Schema & Migration Execution:** PostgreSQL schema migration, composite spatial indexes, seed script population.
3. **Phase 3: Backend RESTful API & JWT Auth Engine:** Express router pipelines, Zod validators, raw SQL Haversine query engine, bcrypt auth.
4. **Phase 4: Frontend UI & Interactive Leaflet Map:** OSM tile layer, custom SVG pins, marker clustering with spiderfy, heatmap layer toggle.
5. **Phase 5: Administrative Dashboard & Coordinate Picker:** JWT protected admin portal, vendor CRUD data table, draggable coordinate picker.
6. **Phase 6: Edge Cases & Mobile Polish:** Geolocation denial handling, area selector fallback, phone masking privacy, mobile bottom sheet.
7. **Phase 7: End-to-End Verification & Automated Test Runner:** Full regression across 14 PACs, Playwright browser tests, Supertest API tests.

---

## 8. Realistic Indore Demonstration Dataset (22 Vendors)

The dataset seeded via `server/prisma/seed.ts` features 22 authentic micro-enterprises across all 10 informal trade categories and 10 Indore localities:

```
┌────┬──────────────────────────────────────┬──────────────────────┬──────────────────┬───────────┬───────────┬──────────────┬──────────────┐
│ #  │ Vendor Trade Name                    │ Category             │ Locality / Area  │ Latitude  │ Longitude │ Status       │ Phone Public │
├────┼──────────────────────────────────────┼──────────────────────┼──────────────────┼───────────┼───────────┼──────────────┼──────────────┤
│ 1  │ Johny Hot Dog                        │ Street Food & Chaat  │ Chappan Dukan    │ 22.724400 │ 75.883900 │ VERIFIED     │ Yes (+91...) │
│ 2  │ Vijay Chaat House                    │ Street Food & Chaat  │ Sarafa Bazaar    │ 22.719700 │ 75.857800 │ VERIFIED     │ Yes (+91...) │
│ 3  │ Joshi Dahi Bada House                │ Street Food & Chaat  │ Sarafa Bazaar    │ 22.719500 │ 75.857600 │ VERIFIED     │ Yes (+91...) │
│ 4  │ Nagori Shikanji Stall                │ Street Food & Chaat  │ Sarafa Bazaar    │ 22.719400 │ 75.857900 │ VERIFIED     │ Yes (+91...) │
│ 5  │ Sanwariya Seth Sabudana Khichdi      │ Street Food & Chaat  │ Sarafa Bazaar    │ 22.719800 │ 75.857400 │ VERIFIED     │ NO (Masked)  │
│ 6  │ Sharma Chai Corner                   │ Chai & Beverages     │ Palasia          │ 22.722200 │ 75.887500 │ VERIFIED     │ Yes (+91...) │
│ 7  │ Apna Sweets Tea Counter              │ Chai & Beverages     │ Chappan Dukan    │ 22.725000 │ 75.883000 │ VERIFIED     │ Yes (+91...) │
│ 8  │ Gurukripa Student Chai Stall         │ Chai & Beverages     │ Bhanwarkuan      │ 22.693500 │ 75.866500 │ VERIFIED     │ Yes (+91...) │
│ 9  │ Ramu Mochi (Cobbler)                 │ Cobbler / Shoe Rep   │ Rajwada / Court  │ 22.720800 │ 75.875200 │ VERIFIED     │ NO (Masked)  │
│ 10 │ Shankar Shoe Repair Stall            │ Cobbler / Shoe Rep   │ Palasia Square   │ 22.721800 │ 75.886800 │ VERIFIED     │ Yes (+91...) │
│ 11 │ Mohan Chabiwala (Key Maker)          │ Key Maker / Lock     │ Rajwada          │ 22.718800 │ 75.855000 │ VERIFIED     │ Yes (+91...) │
│ 12 │ Ganesh Lock & Key Duplicators        │ Key Maker / Lock     │ Malwa Mill       │ 22.730500 │ 75.871200 │ VERIFIED     │ Yes (+91...) │
│ 13 │ Babu Dharwala (Knife Sharpener)      │ Knife Sharpener      │ MT Cloth Market  │ 22.717200 │ 75.850800 │ VERIFIED     │ NO (Masked)  │
│ 14 │ Rajesh Phal Bhandar (Fruit Thela)    │ Fruit & Veg Thelas   │ Annapurna        │ 22.695200 │ 75.836200 │ VERIFIED     │ Yes (+91...) │
│ 15 │ Ramesh Sabziwala Thela (Vegetables)  │ Fruit & Veg Thelas   │ Vijay Nagar      │ 22.753800 │ 75.894000 │ VERIFIED     │ Yes (+91...) │
│ 16 │ Munna Tailor & Alteration            │ Tailor & Alteration  │ Jail Road        │ 22.721200 │ 75.863300 │ VERIFIED     │ Yes (+91...) │
│ 17 │ Lakhan Phool Bhandar (Flowers)       │ Flower & Garland     │ Rajwada          │ 22.718400 │ 75.854800 │ VERIFIED     │ Yes (+91...) │
│ 18 │ Raju Cycle Repair & Puncher          │ Cycle & Tyre Repair  │ Bhanwarkuan      │ 22.692800 │ 75.867200 │ VERIFIED     │ NO (Masked)  │
│ 19 │ Shyamu Matka & Mitti Ke Bartan       │ Pottery & Artisans   │ Annapurna        │ 22.694500 │ 75.837500 │ VERIFIED     │ Yes (+91...) │
│ 20 │ Anand Paan Sadan                     │ Street Food & Chaat  │ Chappan Dukan    │ 22.724600 │ 75.884100 │ VERIFIED     │ Yes (+91...) │
│ 21 │ Kailash Ganne Ka Ras (Sugarcane)     │ Chai & Beverages     │ Malwa Mill       │ 22.731500 │ 75.872500 │ VERIFIED     │ NO (Masked)  │
│ 22 │ Babu Lal Puncture Thela (Test Rec)   │ Cycle & Tyre Repair  │ Vijay Nagar      │ 22.754500 │ 75.895000 │ PENDING      │ NO (Approx)  │
└────┴──────────────────────────────────────┴──────────────────────┴──────────────────┴───────────┴───────────┴──────────────┴──────────────┘
```

---

## 9. 14-Point Acceptance Criteria & Verification Test Matrix

Every feature is evaluated against the 14 baseline Prototype Acceptance Criteria (`PAC-01` through `PAC-14` / `TC-01` through `TC-14`):

| Test ID | PAC Ref | Feature Name | Layer | Pass Criteria | Verification Command |
|---|---|---|---|---|---|
| **TC-01** | `PAC-01` | Category-Based Browsing | UI & API | Filtering by category pill returns matching vendors only with zero leaked pins. | `curl -s "${BASE_URL}/vendors?category=cobbler" \| jq '.data \| length'` -> 2 |
| **TC-02** | `PAC-02` | Partial Keyword & Hindi Search | Full Stack | Debounced query (`ILIKE`) matches English names, Devanagari Hindi aliases, and specialties. | `curl -s "${BASE_URL}/vendors?search=%E0%A4%AE%E0%A5%8B%E0%A4%9A%E0%A5%80"` -> "Ramu Mochi" |
| **TC-03** | `PAC-03` | Dual Map vs. List Views | Frontend | Switching between Map and List maintains filters and triggers `invalidateSize()` with zero grey tiles. | Playwright mobile viewport toggle assertion |
| **TC-04** | `PAC-04` | Vendor Detail Drawer & Metadata | UI & API | Drawer opens with complete metadata, verified badge, landmark, and live Open/Closed badge. | `curl -s "${BASE_URL}/vendors/${ID}" \| jq '.data.isVerified'` -> true |
| **TC-05** | `PAC-05` | Device Dialer Triggering (`tel:`) | Frontend | `tel:` URI active if consent granted; disabled with privacy note if withheld. | DOM anchor check: `href="tel:+919826012345"` |
| **TC-06** | `PAC-06` | Google Maps Navigation Links | Frontend | Generates zero-cost URL (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`) in new tab. | DOM anchor check: `target="_blank" rel="noopener noreferrer"` |
| **TC-07** | `PAC-07` | Admin JWT Auth Guard | Backend | Rejects unauthenticated/tampered requests with HTTP 401; issues 24h JWT on valid login. | `curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/admin/vendors"` -> 401 |
| **TC-08** | `PAC-08` | Full Vendor CRUD Operations | Admin API | Sequential POST -> GET -> PUT -> DELETE completes with proper status codes. | Automated CRUD test sequence in `verify_galiguide.sh` |
| **TC-09** | `PAC-09` | Interactive Coordinate Picker | Admin UI | Map click and pin drag update form Latitude/Longitude to 6 decimal places (< 50ms). | Playwright canvas click and form input assertion |
| **TC-10** | `PAC-10` | Vendor Verification Toggle | Admin API | `PATCH /api/admin/vendors/:id/verify` updates status to `VERIFIED` and logs `AuditLog`. | `curl -X PATCH "${BASE_URL}/admin/vendors/${ID}/verify"` -> 200 OK |
| **TC-11** | `PAC-11` | Geolocation Denial Fallback | Full Stack | App catches GPS denial, renders non-blocking banner, anchors to Rajwada, enables Area Selector. | `curl -s "${BASE_URL}/areas" \| jq '.data \| length'` >= 10 |
| **TC-12** | `PAC-12` | Approx / Roaming Cart Indicators | Full Stack | Roaming pushcarts display amber approximate rings and emphasize landmark cues over pin. | `curl -s "${BASE_URL}/vendors/${BABU_LAL_ID}"` -> `isVerified: false` |
| **TC-13** | `PAC-13` | Vendor Privacy Safeguards | Backend | Phone number masked to `null` in public payload when consent withheld; admin audit intact. | `curl -s "${BASE_URL}/vendors/${SANWARIYA_ID}" \| jq '.data.contactPhone'` -> `null` |
| **TC-14** | `PAC-14` | Haversine Distance & Heatmap | Full Stack | Haversine distance within ±5% of spherical geodesy; heatmap endpoint returns coordinate tuples. | `curl -s "${BASE_URL}/vendors/heatmap" \| jq '.data \| length'` >= 10 |

### Automated Verification Execution
To execute the automated regression suite across all 14 criteria:
```bash
# On Linux / macOS / Git Bash:
bash scripts/verify_galiguide.sh

# On Windows PowerShell:
powershell -ExecutionPolicy Bypass -File scripts/verify_galiguide.ps1
```

---

*End of GaliGuide Master Production Specification.*
