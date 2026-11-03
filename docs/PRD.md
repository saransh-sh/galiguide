# GaliGuide: Product Requirements Document (PRD)
**Hyperlocal Informal Vendor Discovery & Navigation System**  
**Document Identifier:** GALI-PRD-2026-V1  
**Project:** GaliGuide (Indore Pilot)  
**Status:** Approved for Implementation  
**Version:** 1.0.0  
**Target Pilot City:** Indore, Madhya Pradesh, India  

---

## 1. Executive Summary & Problem Space

### 1.1 Context & Background
In urban India, the informal street economy forms the lifeblood of daily municipal commerce. In Indore—celebrated as India's cleanest city under the Swachh Survekshan awards and a renowned commercial and culinary capital of Central India—tens of thousands of micro-entrepreneurs operate daily on footpaths, alleyway corners (*galis*), street intersections (*chourahas*), and mobile pushcarts (*thelas*).

These micro-enterprises span a rich spectrum of vital community services:
- **Culinary Heritage Artisans:** Famous morning breakfast vendors (poha-jalebi, samosa-kachori, usal poha), night bazaar chaat artisans at Sarafa, and street food stalls at Chappan Dukan.
- **Indispensable Daily Trades:** Cobblers (*mochis*), key makers and duplicate locksmiths (*chabiwale*), cycle puncture and tyre repair mechanics, knife and scissor sharpeners (*dharwale*), roadside tailors and darners (*darzis/raffu*), and small electronic/watch repair kiosks.
- **Perishable & Cultural Goods:** Fresh fruit and vegetable pushcarts (*fal-sabzi thelas*), temple flower and garland stalls (*phool-mala*), and seasonal clay pottery artisans (*kumhars*).

Despite their ubiquity and critical utility, these informal street vendors face severe, systemic barriers in the modern digital economy:
1. **Digital Invisibility:** Mainstream commercial discovery platforms (Google Maps, Zomato, Swiggy, Justdial) are architected exclusively for formal brick-and-mortar establishments equipped with commercial storefronts, trade licenses, Goods and Services Tax Identification Numbers (GSTIN), and high marketing or commission budgets. Informal street vendors remain completely invisible to digital map searches.
2. **Non-Standard & Dynamic Geography:** Informal vendors operate in narrow, centuries-old alleys or on roadside sidewalks lacking formal postal street addresses. Their physical presence is defined by localized topological landmarks (e.g., *"Opposite High Court Gate 2, behind the banyan tree, next to Malwa Mill police chowki"*).
3. **Technological & Financial Asymmetry:** Informal vendors typically operate on thin profit margins. They lack the capital, technical literacy, or hardware to operate complex seller dashboards, manage live digital inventory catalogs, or pay platform commissions and subscription fees.
4. **Platform Cost Prohibitions:** Municipalities and public-interest initiatives seeking to map informal vendors are often hindered by the steep usage-based pricing models of proprietary map APIs (such as Google Maps Platform JavaScript API, Geocoding API, and Places API), which scale prohibitively with public usage.

### 1.2 System Vision & Objectives
**GaliGuide** is a lightweight, zero-commission, accessible, open-source hyperlocal discovery and navigation web platform designed specifically for informal street vendors, urban citizens, and municipal administrators.

- **For Citizens & Visitors:** Provides instantaneous, friction-free discovery of nearby essential informal vendors within walking or short driving distance. Users can view operational status, localized landmark directions, initiate direct phone calls via native device dialers, and launch turn-by-turn walking or driving navigation.
- **For Informal Vendors:** Delivers dignified digital visibility and discovery without requiring vendors to own smartphones, download merchant applications, manage digital catalogs, or pay platform commissions.
- **For Municipal & Community Administrators:** Provides a secure, streamlined geospatial portal for onboarding street vendors, capturing spatial coordinates via interactive drag-and-drop map markers, verifying community listings, and monitoring street vendor density.
- **Economic & Architectural Sustainability:** GaliGuide is built entirely on open-source mapping infrastructure (OpenStreetMap, Leaflet.js, Leaflet MarkerCluster, Leaflet Heatmap) and universal URI protocols (`tel:` and external Google Maps turn-by-turn routing links). This architecture incurs **zero external mapping API costs** regardless of user traffic scale.

---

## 2. Core Target Personas

### Persona 1: Daily Urban Commuter & Resident
- **Name:** Rohit Sharma (Age 28, Software Professional / Daily Commuter)
- **Location:** Palasia / Old Palasia, Indore
- **Context & Needs:** Rohit commutes daily across Indore. On his way to work or during lunch breaks, he frequently encounters immediate, localized needs: a broken sandal strap needing an urgent cobbler (*mochi*), a bicycle puncture near an intersection, a duplicate key for his apartment, or a quick cutting chai at a hygienic tapri.
- **Pain Points:** Searching Google Maps yields distant luxury shoe stores or formal hardware shops 5 kilometers away, completely missing the skilled cobbler sitting under the tree 100 meters down the lane.
- **Platform Goals:** Wants instant, GPS-based discovery of nearby service vendors with zero login friction, accurate walking distance, landmark directions, and one-tap calling.

### Persona 2: Cultural Explorer & Tourist
- **Name:** Ananya Sen (Age 24, Travel Blogger & Culinary Tourist)
- **Location:** Visiting Rajwada and Sarafa Bazaar, Indore
- **Context & Needs:** Ananya is visiting Indore for 48 hours to explore its famed culinary culture. She wants to sample authentic regional street food: Bhutte ka Kees, Garadu, Joshi Dahi Bada, and authentic poha-jalebi.
- **Pain Points:** Mainstream apps show commercial restaurants but fail to identify specific, historic street food carts operating inside the bustling night alleys of Sarafa or early morning Rajwada. She also worries about reaching spots that may be closed during daytime hours.
- **Platform Goals:** Needs bilingual category search (e.g., searching "poha", "garadu", "chaat"), synchronized map and list views showing operating hours (distinguishing morning breakfast stalls from late-night Sarafa stalls), and one-tap Google Maps walking directions.

### Persona 3: Informal Street Vendor / Micro-Entrepreneur
- **Name:** Ramesh Kumar (Age 48, Master Cobbler & Leather Artisan)
- **Location:** Sidewalk opposite High Court Gate 2, Indore
- **Context & Needs:** Ramesh has repaired shoes, bags, and belts at the same sidewalk spot for 22 years. He uses a basic feature phone and conducts transactions via cash and a printed UPI QR standee.
- **Pain Points:** He cannot afford a smartphone or understand complex digital apps. Customers moving to the area don't know he exists. He fears harassment or spam if his personal phone number is broadcast indiscriminately without his consent.
- **Platform Goals:** Wants to be discoverable by neighborhood customers via a respectful digital profile that highlights his exact landmark location, hours of operation, accepted payment modes (Cash/UPI), and verification status, while maintaining strict privacy consent controls over his contact number.

### Persona 4: Municipal / Field Community Administrator
- **Name:** Priya Verma (Age 34, Municipal Urban Livelihood Project Coordinator)
- **Location:** Indore Municipal Corporation (IMC) / Community NGO
- **Context & Needs:** Priya oversees street vendor rehabilitation and livelihood support programs under PM SVANidhi (Pradhan Mantri Street Vendor's AtmaNirbhar Nidhi). She works with field surveyors who map informal street vending zones.
- **Pain Points:** Field mapping tools are cumbersome, proprietary GIS software is too complex for non-technical field workers, and manual paper registers become obsolete immediately.
- **Platform Goals:** Requires a clean, secure administrative portal with email/password JWT login, an intuitive Leaflet map coordinate picker (allowing field staff to click or drag a marker to the exact vendor cart location), full CRUD capabilities, and rapid verification toggling.

---

## 3. Complete End-to-End User Workflows

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

---

### 3.1 Public User Workflows

#### Flow P1: Hyperlocal Discovery & Fallback Locality Selection
1. **Entry Point:** Citizen navigates to GaliGuide root URL (`/`).
2. **Permission Probe:** The application prompts the browser HTML5 Geolocation API (`navigator.geolocation.getCurrentPosition`) requesting high accuracy.
3. **Branch 1A (Permission Granted):**
   - Coordinates (`latitude, longitude, accuracy`) are captured in client state.
   - The interactive Leaflet map centers smoothly via `flyTo` animation at zoom level 14.
   - A pulsing blue circle marker indicates the user's live position ("You are here").
   - Public vendor query triggers with `lat` and `lng` parameters to fetch vendors within a 5 km radius, ordered by ascending Haversine distance.
4. **Branch 1B (Permission Denied / Hardware Timeout / Non-Indore Location):**
   - Geolocation rejection error (`PERMISSION_DENIED`, `POSITION_UNAVAILABLE`, `TIMEOUT`) is intercepted cleanly.
   - The application does not freeze, crash, or show an unhandled modal error.
   - A gentle, dismissible notification banner alerts the user: *"Location access disabled or unavailable. Showing street vendors near Rajwada, Indore."*
   - Active coordinate anchor automatically defaults to the geographic centroid of Rajwada, Indore (`22.719600, 75.857700`).
   - A sticky, prominent **Locality Selector Dropdown** renders in the header navigation containing 10 major commercial hubs of Indore:
     1. *Rajwada (Heritage City Center & Old City)*
     2. *Sarafa Bazaar (Night Chaat & Jewelry Market)*
     3. *Chappan Dukan (New Palasia 56-Shops Food Street)*
     4. *Palasia / Old Palasia (Commercial & Residential Hub)*
     5. *Vijay Nagar / Scheme 54 (Major Northern Commercial Hub)*
     6. *Bhanwarkuan (University & Student Coaching Hub)*
     7. *Annapurna / Sudama Nagar (Western Temple & Market Area)*
     8. *Malwa Mill / Jail Road (Mechanics, Hardware & Electronics Hub)*
     9. *Geeta Bhawan / Manoramaganj (Medical & Retail Corridor)*
     10. *Khajrana (Eastern Temple & Community Market Hub)*
   - When the user selects any locality from the dropdown, the map immediately pans to that locality's centroid coordinates, sets the coordinate anchor, and recalculates distances and vendor listings.

#### Flow P2: Real-time Partial Keyword Search with Bilingual / Hindi Matching
1. **User Action:** Citizen clicks or focuses on the top persistent search bar and begins typing (e.g., `"chabi"`, `"dhar"`, `"garadu"`, `"cycle"`).
2. **Debounce Mechanism:** A 300 ms client-side debounce timer pauses query dispatch until the user pauses typing, preventing unnecessary API requests.
3. **Search Execution:** Client dispatches a query to `GET /api/vendors?search={query}&lat={lat}&lng={lng}`.
4. **Backend Matching Engine:** The backend executes a case-insensitive multi-attribute SQL query with wildcards (`ILIKE %query%`) matching against:
   - Vendor business / trade name (e.g., *"Mohan Chabiwala"*)
   - Transliterated Hindi alias name (e.g., *"मोहन चाबी वाले"*)
   - Category name and slug (e.g., *"Key Makers & Locksmiths"*)
   - Search tag keywords (e.g., *"locksmith, computerized key, laser key, tala chabi"*)
   - Physical landmark directions (e.g., *"opp High Court Gate 2"*)
5. **Colloquial & Phonetic Support:** Common Hinglish variations are mapped to vendor specialties (e.g., `"puncture"` or `"hawa"` matches bicycle repair; `"dhar"` or `"kaichi"` matches knife sharpeners; `"chappal"` or `"juta"` matches cobblers).
6. **Reactive Interface Update:**
   - The Leaflet map updates instantly: non-matching markers are cleared; matching markers are retained and re-clustered.
   - The map bounds smoothly animate (`map.fitBounds`) to encompass all matching vendor pins.
   - The vendor list displays matching vendor cards with highlighted search query substrings.
   - If zero vendors match, a clean empty state displays: *"No street vendors found matching '{query}'. Try searching for 'chai', 'chabi', 'mochi', or select a category below."*

#### Flow P3: Synchronized Dual Map vs. List Views with Hotspot Overlays
1. **Responsive Viewport Layouts:**
   - **Desktop Viewport (>= 1024px):** Renders a balanced 50/50 or 40/60 split-screen layout. The left pane hosts a scrollable, filterable list of vendor cards; the right pane hosts the full-height interactive Leaflet map canvas.
   - **Mobile Viewport (< 1024px):** Renders an intuitive sticky Bottom-Navigation toggle switching between **Map View** (featuring a peek card for the active vendor) and **List View** (full scrollable feed of vendor cards).
2. **Bidirectional Interactive Synchronization:**
   - **List Card -> Map Pin:** Clicking or hovering over any vendor card in the list view automatically triggers `map.panTo([vendor.lat, vendor.lng])`, opens the vendor's map popup, and applies a pulsing CSS ring to the marker.
   - **Map Pin -> List Card:** Clicking any marker pin on the Leaflet map opens its interactive popup and smoothly scrolls the corresponding vendor card into full view in the list pane (`element.scrollIntoView({ behavior: 'smooth', block: 'center' })`), highlighting its container border with an emerald glow.
3. **Marker Clustering & Spiderfication:**
   - In high-density vendor corridors (e.g., Sarafa Bazaar or Chappan Dukan where 25+ stalls exist within a 150-meter radius), individual pins automatically group into `Leaflet.markercluster` aggregate badges with color-coded density rings (Green: < 10 vendors, Yellow: 10-25 vendors, Red: > 25 vendors).
   - Clicking a cluster badge zooms the map directly into the bounding box of that group.
   - When a user clicks a cluster at the maximum map zoom level (zoom 18), the markers automatically *spiderfy*—fanning out in a radial circular or spiral formation—allowing precise selection of individual adjacent carts.
4. **Density Heatmap Mode Overlay:**
   - A floating "Heatmap" toggle button on the Leaflet map switches the rendering engine from discrete pins to a continuous `Leaflet.heat` density layer (`L.heatLayer`).
   - The heatmap renders weighted intensity gradients representing informal vendor concentrations across Indore using a 5-tier color spectrum: Blue (Low density) -> Emerald -> Amber -> Red -> Purple (Intense commercial hubs like Sarafa and Rajwada).
   - Toggling back to "Markers" restores standard clustered pins instantly.

#### Flow P4: Vendor Profile Inspection, Device Dialer (`tel:`), & Google Maps Navigation
1. **Detail View Activation:** A user taps on a map marker popup or clicks a vendor card in the list.
2. **Presentation:**
   - On mobile devices, a smooth, gesture-friendly slide-up Bottom Sheet drawer animates into view.
   - On desktop, a floating modal or right-hand slide-over panel opens.
3. **Comprehensive Attribute Display:**
   - Vendor Business Name and Local Hindi Name
   - Category Badge with category color accent and icon
   - Official Verification Status Badge (Green shield with checkmark: *"Verified GaliGuide Vendor"*; or Amber outline: *"Community Listed (Unverified)"*)
   - Real-time Walking / Driving Distance from active coordinate anchor (e.g., *"180 m away • ~3 min walk"*)
   - Live Operational Status Badge:
     - `"Open Now"` in emerald green with pulsating dot
     - `"Closed • Opens at 08:00 AM"` in dark amber/red
     - Evaluated dynamically against current local Indore time and the vendor's daily schedule
   - Detailed Topological Landmark Guide (e.g., *"Situated on the footpath opposite High Court Gate 2, behind the banyan tree, next to the newspaper stall"*).
   - Mobility Type Badge (*"Stationary Kiosk"*, *"Sidewalk Spot"*, or *"Roaming Pushcart"*).
   - Payment Modes Accepted (*Cash*, *UPI / QR Code*).
   - Specialty Items and Services (e.g., *"Specializes in laser key duplication, computer car keys"*).
4. **Action Trigger A: One-Touch Device Calling (`tel:`):**
   - The user clicks the prominent emerald **"Call Vendor"** button.
   - **Privacy Consent Check:**
     - If the vendor granted explicit phone consent (`phoneConsentGiven === true`), the button is hyperlinked to `tel:+91XXXXXXXXXX`. On smartphones, this instantly launches the native phone dialer with the number pre-filled.
     - If `phoneConsentGiven === false` or phone number is absent, the button is disabled or replaced with a respectful badge: *"In-Person Visit Only (No Public Phone)"*.
5. **Action Trigger B: External Turn-by-Turn Navigation:**
   - The user clicks the prominent indigo **"Get Directions"** button.
   - The application generates an external universal Google Maps routing hyperlink:
     `https://www.google.com/maps/dir/?api=1&destination=22.719600,75.857700`
   - The link opens in a new tab (`target="_blank" rel="noopener noreferrer"`), triggering the native Google Maps mobile application on iOS/Android or Google Maps web on desktop.
   - The vendor's exact latitude and longitude are passed as the destination; the user's native GPS is automatically used by Google Maps as the origin.
   - **Zero Google API Cost:** Incurs zero billable Google Maps Platform API calls.

---

### 3.2 Administrator Workflows

#### Flow A1: Secure Administrator Authentication & Session Lifecycle
1. **Access Point:** Administrator navigates to `/admin/login`.
2. **Credentials Submission:** Administrator enters registered email (e.g., `admin@galiguide.in`) and password.
3. **Authentication API:** Client dispatches `POST /api/admin/auth/login` with JSON payload `{ email, password }`.
4. **Backend Security Validation:**
   - Server queries `AdminUser` table by unique email.
   - If not found or inactive, returns generic HTTP 401 Unauthorized (`{ message: "Invalid email or password" }`) to prevent user enumeration.
   - Validates provided plaintext password against the stored bcrypt hash using `bcrypt.compare`.
   - Generates a signed JSON Web Token (JWT) using HMAC-SHA256 (`HS256`) containing `{ id, email, role, exp }` with a 24-hour expiration lifetime.
5. **Session Persistence:**
   - Client receives `{ token, admin: { id, email, name, role } }`.
   - Token is persisted in browser `localStorage` under `galiguide_admin_token`.
   - Global API client (Axios/Fetch) automatically attaches `Authorization: Bearer <token>` to all subsequent requests.
   - User is redirected to `/admin/dashboard`.
6. **Session Expiration & Unauthorized Interception:**
   - If any API request returns HTTP 401 Unauthorized, an HTTP response interceptor clears `localStorage` and smoothly redirects the administrator back to `/admin/login` with an informative session expiration toast.

#### Flow A2: Comprehensive Vendor CRUD Lifecycle
1. **Dashboard Overview:** Logged-in admin views the `/admin/vendors` data table displaying all registered vendors with column sorting, category filtering, verification status filters, and search capabilities.
2. **Vendor Creation Flow:**
   - Admin clicks the **"+ Onboard New Vendor"** action button.
   - A multi-section modal/page opens containing form groups:
     1. *Core Identity:* Business Trade Name, Hindi Alias Name, Primary Category dropdown, Description, Specialty Tags.
     2. *Contact & Privacy:* Contact Phone Number, Explicit Phone Consent Checkbox (`phoneConsentGiven`), Accepted Payment Modes (Cash, UPI).
     3. *Geospatial & Location:* Locality dropdown, Detailed Landmark Description, Approximate Location Checkbox (`isApproximateLocation`), Mobility Type dropdown (*STATIONARY*, *SIDEWALK*, *ROAMING_THELA*), Interactive Leaflet Map Coordinate Picker.
     4. *Operating Schedule:* Daily Opening Time, Closing Time, Operating Days (Monday–Sunday).
     5. *Governance:* Verification Toggle Checkbox (`isVerified`).
   - Admin submits the validated form; client dispatches `POST /api/admin/vendors`.
   - Backend validates the schema using Zod, creates the `Vendor` record in PostgreSQL with an auto-generated UUIDv4, creates linked `OperatingHour` records, logs an immutable `AuditLog` entry, and returns the created vendor entity.
   - Public view updates immediately upon subsequent user query.
3. **Vendor Edit & Deactivation (Soft Delete):**
   - Admin clicks "Edit" on any vendor row to open the populated form, adjust details, or relocate the spatial pin.
   - Admin clicks "Deactivate" (or "Archive") to soft-delete the vendor by setting `isActive: false`.
   - Inactive vendors are immediately excluded from all public search and map queries (`WHERE isActive = true`), while remaining accessible in the admin portal for audit and reinstatement.

#### Flow A3: Interactive Map Coordinate Picker (Click / Drag Pin)
1. **Map Picker Initialization:** Inside the Vendor Creation/Edit modal, an embedded Leaflet map canvas initializes.
2. **Default Centering:** If onboarding a new vendor, selecting an Area (e.g., *"Sarafa Bazaar"*) automatically pans the map to that locality's centroid. If editing an existing vendor, the map centers on the vendor's saved coordinates.
3. **Click-to-Place Interaction:**
   - The admin clicks on the exact physical spot on the OpenStreetMap tile (e.g., on a specific sidewalk corner).
   - An interactive, high-visibility red marker pin is dropped at that exact point.
4. **Draggable Pin Refinement:**
   - The dropped pin has the Leaflet property `{ draggable: true }`.
   - The admin can click and drag the pin to make micro-adjustments down to street-level accuracy.
   - On the `dragend` and `click` events, the latitude and longitude are extracted:
     `const { lat, lng } = event.latlng;`
   - The numeric **Latitude** and **Longitude** form inputs automatically update in real time, formatted to 6 decimal places (providing sub-meter ~0.11 m precision).
5. **Bidirectional Coordinate Input Sync:**
   - If an admin types coordinates directly into the Latitude or Longitude numeric inputs (e.g., pasted from GPS device logs), the embedded Leaflet map automatically pans to those coordinates and repositions the marker pin.

---

## 4. Comprehensive Functional Requirements (FR-01 through FR-12)

### FR-01: Hyperlocal Discovery Engine & Spatial Proximity
- **FR-01.1 Geolocation Detection:** The web client attempts to acquire user coordinates via browser `navigator.geolocation.getCurrentPosition`.
- **FR-01.2 Spherical Haversine Distance Calculation:** The backend and frontend compute exact straight-line distance using the spherical Haversine formula:
  $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta\text{lng}}{2}\right)}\right)$$
  where $r = 6371 \text{ km}$ (mean radius of Earth).
- **FR-01.3 Spatial Proximity Ordering:** Discovery query results must default to ascending distance order relative to the active coordinate anchor.
- **FR-01.4 Bounding Box Viewport Queries:** The backend supports bounding box coordinate queries (`minLat`, `maxLat`, `minLng`, `maxLng`) to efficiently return only vendors visible within the current map viewport when requested.
- **FR-01.5 Formatted Distance Presentation:** Distances are rendered in human-readable metrics: `< 1000 m` displayed as meters (e.g., `"250 m away"`), `>= 1.0 km` displayed in kilometers with one decimal place (e.g., `"1.8 km away"`).

### FR-02: Partial Keyword Search & Multilingual Phonetics
- **FR-02.1 Multi-Attribute Matching:** Search queries match against vendor trade name, operator name, category name, Hindi transliterated alias, tags, and landmark text.
- **FR-02.2 Partial Substring Matching:** Case-insensitive substring searches (e.g., `"bada"` matches `"Joshi Dahi Bada"`, `"puncture"` matches `"Cycle Puncture Repair"`).
- **FR-02.3 Colloquial & Transliterated Hinglish Dictionary:** Search maps common colloquial Hindi/Hinglish terms to formal vendor services:
  - *Chabi / Chaabi / Chabiwala / Duplicate Key / Locksmith* -> Key Makers
  - *Mochi / Cobbler / Shoe Repair / Juta Polish / Chappal* -> Cobbler & Shoe Repair
  - *Dhar / Dharwala / Kaichi / Knife Sharpener* -> Knife Sharpeners
  - *Chai / Tapri / Tea / Cutting / Kulhad* -> Chai & Beverages
  - *Poha / Jalebi / Sev / Samosa / Kachori / Chaat / Garadu* -> Street Food & Chaat
  - *Silai / Darzi / Alteration / Raffu / Tailor* -> Tailors & Alterations
  - *Cycle / Puncture / Hawa / Tyre Repair* -> Bicycle & Puncture Repair
  - *Thela / Sabzi / Fal / Mandi* -> Fruit & Vegetable Thelas
- **FR-02.4 Debounced Client Input:** Search input executes a 300 ms debounce to optimize network overhead and maintain fluid 60 fps typing responsiveness.

### FR-03: Category Hierarchy & Multi-Faceted Filtering
- **FR-03.1 Two-Tier Category Taxonomy:** Structured hierarchy consisting of 4 Primary Parent Sectors (Food & Refreshments, Everyday Utility Services, Fresh Produce, Traditional Artisans) and 12+ granular informal vendor categories.
- **FR-03.2 Responsive Category Pill Bar:** A horizontal scrolling bar of category chips with icons, category color accents, localized titles, and live vendor count badges.
- **FR-03.3 Filter Concurrency:** Supports combining category filters with search text queries, locality boundaries, and open-now operational filters.
- **FR-03.4 Clear Filter Reset:** Single-tap reset to "All Categories" restoring full directory view.

### FR-04: Dual Synchronized Interface Modes (Map & List)
- **FR-04.1 Viewport Adaptive Layout:** Split-screen layout on desktop viewports (>= 1024px); toggleable full-screen Map vs. full-screen List on mobile viewports (< 1024px).
- **FR-04.2 Bidirectional Selection Sync:**
  - Selecting a vendor card in the list centers and zooms the Leaflet map to that vendor's marker pin and opens its popup.
  - Clicking a marker pin on the map smoothly scrolls the corresponding vendor card into view in the list and highlights its border.
- **FR-04.3 Active Selection Highlighting:** Selected vendor receives distinct visual emphasis (pulsing emerald border and animated marker pin).

### FR-05: Marker Clustering & Density Heatmap Overlays
- **FR-05.1 MarkerCluster Aggregation:** Utilizes `leaflet.markercluster` to group proximate markers into aggregate count badges with three tiered visual classes (`cluster-small` < 10, `cluster-medium` 10-25, `cluster-large` > 25).
- **FR-05.2 Spiderfication at Max Zoom:** Clicking a cluster badge at maximum zoom level (zoom 18) radially spiderfies overlapping or co-located markers into a distinct ring.
- **FR-05.3 Density Heatmap Layer:** Provides a toggleable `Leaflet.heat` canvas layer (`L.heatLayer`) visualizing commercial informal vendor concentrations across Indore using a 5-tier color spectrum (Blue -> Emerald -> Amber -> Red -> Purple).

### FR-06: Rich Vendor Profile & Micro-Detail Presentation
- **FR-06.1 Responsive Detail Presentation:** Slide-up bottom sheet drawer on mobile viewports; floating modal or slide-over drawer on desktop viewports.
- **FR-06.2 Complete Attribute Display:**
  - Trade Name and Local Hindi Alias Name
  - Category Badge with category color accent
  - Verification Status Badge (Green shield for Verified, Amber badge for Community Listed)
  - Distance from active anchor and estimated walking time
  - Detailed Topological Landmark Directions
  - Live Operational Status Badge (Open Now / Closed)
  - Operating Hours schedule display
  - Accepted Payment Modes (Cash, UPI / QR Code)
  - Cart Mobility Type (*Stationary Kiosk*, *Sidewalk Spot*, *Roaming Pushcart*)
  - Descriptive notes, specialties, and seasonal availability notes.

### FR-07: One-Touch Action Triggers (Dialer & Navigation)
- **FR-07.1 Direct Device Dialer Trigger (`tel:`):**
  - "Call Vendor" action button formatted as `tel:+91XXXXXXXXXX`.
  - Tapping opens the native mobile phone dialer on Android/iOS with zero server call-log tracking.
  - **Privacy Enforcement:** Active only if `phoneConsentGiven === true`. If consent is false or phone is missing, button is disabled or hidden with an *"In-Person Visit Only"* notice.
- **FR-07.2 External Google Maps Navigation (`https://www.google.com/maps/dir/`):**
  - "Get Directions" action button generates universal Google Maps URL:
    `https://www.google.com/maps/dir/?api=1&destination={latitude},{longitude}`
  - Opens native Google Maps app on mobile or browser on desktop with turn-by-turn routing pre-configured.
  - **Zero Billable Google API Keys Required.**

### FR-08: Administrator Authentication & Authorization
- **FR-08.1 Email & Password Authentication:** Secure login for municipal staff and community administrators at `/admin/login`.
- **FR-08.2 Password Hashing:** All administrator passwords hashed using `bcrypt` with salt rounds >= 10.
- **FR-08.3 Stateless JWT Sessions:** Issues HMAC-SHA256 (`HS256`) JSON Web Tokens containing admin ID and role, valid for 24 hours.
- **FR-08.4 Route Protection:** Express middleware guards `/api/admin/*` endpoints verifying `Authorization: Bearer <token>`; React router guards `/admin/*` views, redirecting unauthenticated users to `/admin/login`.

### FR-09: Complete Vendor Lifecycle Management (Admin CRUD)
- **FR-09.1 Vendor Creation:** Validated multi-section form for onboarding vendors with all schema attributes.
- **FR-09.2 Vendor Directory Querying:** Paginated, filterable, and searchable administrative data table.
- **FR-09.3 Vendor Updates:** Full editing capabilities for vendor details, phone consent, operating hours, and location pins.
- **FR-09.4 Soft-Delete & Archival:** Ability to deactivate vendors (`isActive: false`), immediately excluding them from public discovery while preserving records for municipal audit.

### FR-10: Interactive Spatial Coordinate Picker for Admins
- **FR-10.1 Click-to-Pin Canvas:** Embedded Leaflet map in admin form allows clicking anywhere on the map to drop a marker pin.
- **FR-10.2 Draggable Pin:** Marker has draggable capability; moving the pin dynamically updates the form's Latitude and Longitude fields in real time.
- **FR-10.3 Precision & Validation:** Coordinates captured to 6 decimal places (~0.11 m precision), constrained within valid geographical bounds (-90 to +90 lat, -180 to +180 lng).
- **FR-10.4 Manual Coordinate Sync:** Editing numeric Latitude or Longitude input fields immediately repositions the marker pin and centers the map.

### FR-11: Verification & Trust Framework
- **FR-11.1 Fast Verification Toggle:** Administrators can toggle vendor verification status via an inline switch in the table or edit modal.
- **FR-11.2 Public Trust Badges:** Verified vendors receive a prominent green verification shield; unverified vendors display a clear disclaimer badge.
- **FR-11.3 Audit Logging:** All verification state changes automatically record an immutable `AuditLog` entry storing admin ID, vendor ID, previous state, new state, and timestamp.

### FR-12: Informal Vendor Safeguards & Privacy Management
- **FR-12.1 Explicit Phone Consent Safeguard:** Phone numbers are only stored and publicly exposed if explicit vendor consent is documented (`phoneConsentGiven === true`).
- **FR-12.2 Strict Non-Residential Mapping:** System policy and form validation strictly restrict mapping to commercial street vending spots; residential home addresses of informal workers are forbidden.
- **FR-12.3 Rapid De-listing Protocol:** Integrated reporting mechanism allowing vendors or citizens to flag outdated or incorrect listings for immediate admin review or de-listing.
- **FR-12.4 Anti-Scraping Rate Limiting:** Express API implements IP rate limiting (100 requests per 15-minute window) on public endpoints to prevent commercial harvesting of informal vendor directories.

---

## 5. Exhaustive Edge Cases & Safeguards (EC-01 through EC-22)

| Code | Feature / Area | Trigger / Condition | Specified System Behavior & Safeguard |
| :--- | :--- | :--- | :--- |
| **EC-01** | Geolocation Prompt | User explicitly clicks "Block" or "Deny" on browser geolocation prompt. | Browser catches `GeolocationPositionError.PERMISSION_DENIED`. App renders non-blocking toast: *"Location permission denied. Showing vendors near Rajwada, Indore."* Coordinate anchor defaults to Rajwada (`22.719600, 75.857700`). Sticky Locality Selector dropdown appears in navbar. UI does not crash or freeze. |
| **EC-02** | Geolocation Hardware | Device GPS times out (> 8000 ms) or location hardware disabled. | Intercepts `TIMEOUT` or `POSITION_UNAVAILABLE`. Cancels pending promise. Defaults coordinate anchor to Rajwada center and prompts user to pick an Indore locality from the dropdown. |
| **EC-03** | User Outside City | User accesses app from another city/state (e.g., Delhi, lat 28.61, lng 77.20), > 50 km from Indore. | App calculates distance from user to Indore centroid > 50 km. Displays informational banner: *"You are viewing street vendors in Indore. Pick an area below to explore."* Sets map center to Rajwada, zoom 13. Distance badges indicate distance from Indore center or selected area. |
| **EC-04** | Search Input | User enters whitespace-only, emoji, or regex special characters (`"   "`, `"@#$%^&*"`). | Client and server trim input. Regex special characters are escaped safely. Empty or whitespace-only queries are ignored, returning standard unfiltered distance-sorted list without 500 error. |
| **EC-05** | Search Input | User types single character (e.g., `"c"` or `"म"`). | 300 ms debounce executes query. Backend evaluates `ILIKE '%c%'`. Returns valid matching vendor subset without database crash or lag. |
| **EC-06** | Search Input | User searches colloquial slang or misspelled term with 0 direct matches (e.g., `"chappal tuti"`). | Backend checks tag aliases; if 0 results match, UI displays helpful zero-state: *"No direct matches for '{query}'. Looking for shoe repair? Try searching 'Mochi' or select 'Cobblers' below."* |
| **EC-07** | Category Filter | User selects category with zero registered vendors in current locality (e.g., Pottery in Palasia). | Map markers for that category clear cleanly. List displays friendly empty state: *"No pottery artisans found in this immediate area. Explore Rajwada or Sarafa for traditional pottery."* |
| **EC-08** | Category Filter | Rapid multi-clicking of category pills in rapid succession (< 200 ms). | Client state updates synchronously. Previous in-flight fetch requests are aborted using `AbortController`. UI renders only the final selected category without UI race conditions. |
| **EC-09** | Map Viewport | User zooms out to entire country / state level (zoom < 10). | MarkerCluster combines all Indore vendors into a single unified badge. Map displays gentle overlay pill: *"Zoom in to explore street-level vendors in Indore"*. Prevents browser DOM overloading. |
| **EC-10** | Map Viewport | Multiple vendors share identical or nearly identical coordinates (e.g., 6 food stalls at Chappan Dukan). | Leaflet MarkerCluster aggregates pins. When clicked at maximum zoom (zoom 18), pins spiderfy radially into a circle so every individual vendor stall can be selected without overlap. |
| **EC-11** | Heatmap Layer | User toggles Heatmap mode when active category filter yields 0 vendors. | Heatmap layer renders blank canvas without throw or uncaught exception. Empty-state overlay displays: *"No vendor density data to display for this filter."* |
| **EC-12** | Map-List Sync | User clicks list card for vendor located outside current visible map bounds. | Map executes smooth `flyTo([vendor.lat, vendor.lng], 16)` animation, panning and zooming directly to the vendor's location and opening its marker popup. |
| **EC-13** | Operating Hours | Vendor operates an overnight shift crossing midnight (e.g., Sarafa night stall open 08:00 PM to 03:00 AM). | Live status evaluation logic handles midnight rollover: if `closeTime < openTime`, vendor is considered "Open Now" if current time is `>= openTime` OR `< closeTime`. At 01:30 AM, vendor correctly shows *"Open Now (Closes 3:00 AM)"*. |
| **EC-14** | Phone Privacy | Vendor phone number is missing or vendor withheld phone consent (`phoneConsentGiven: false`). | Public API payload sets `phone: null`. Vendor detail drawer hides the phone number and replaces the "Call Vendor" button with an inactive badge: *"In-Person Visit Only (No phone listed)"*. |
| **EC-15** | Navigation Trigger | User clicks "Get Directions" on desktop browser without GPS hardware. | Browser opens Google Maps directions URL (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`). Google Maps web interface opens with destination locked and prompts user to enter their starting location. |
| **EC-16** | Admin Login | Admin enters incorrect password or non-existent email. | Server responds with HTTP 401 Unauthorized `{ message: "Invalid email or password" }`. Login form displays clean error banner without disclosing whether the email exists. |
| **EC-17** | Admin Session | Admin JWT token expires after 24 hours while admin is actively working. | Next API request returns HTTP 401. Axios/fetch response interceptor intercepts 401, clears invalid token from `localStorage`, and redirects to `/admin/login` with toast: *"Your session has expired. Please log in again."* |
| **EC-18** | Admin Form | Admin inputs invalid coordinates (e.g., Lat 120.0, Lng -200.0) manually into form fields. | Zod backend validation and HTML5 form validation reject payload: *"Latitude must be between -90 and 90; Longitude must be between -180 and 180."* Form prevents submission. |
| **EC-19** | Admin Coordinate Picker | Admin drops or drags coordinate pin outside the Indore metropolitan boundary (> 30 km from city center). | Map coordinate picker displays warning banner: *"Note: Selected coordinates appear to be outside the Indore metropolitan area. Please verify."* Does not strictly block (permits peri-urban expansion) but requires confirmation. |
| **EC-20** | Verification Toggle | Admin rapidly toggles verification switch multiple times in succession. | Switch UI uses optimistic UI updates with debounce. Backend executes atomic SQL update (`UPDATE "Vendor" SET "isVerified" = $1 WHERE id = $2`) avoiding race conditions. |
| **EC-21** | Route Protection | Unauthenticated user navigates directly to `/admin/dashboard` or `/admin/vendors`. | React Router protected route checks auth context; detecting missing token, immediately redirects to `/admin/login`. Direct curl requests to `/api/admin/*` return HTTP 401. |
| **EC-22** | Anti-Scraping | Automated bot or malicious actor attempts rapid harvesting of vendor database. | Express `express-rate-limit` halts requests exceeding 100 requests per 15-minute window per IP, returning HTTP 429 Too Many Requests with descriptive `Retry-After` header. |

---

## 6. Comprehensive Category Taxonomy & Hierarchy

GaliGuide defines an exhaustive 12-category informal vendor taxonomy, structured under 4 Primary Sectors, culturally and commercially tailored to Indore's urban landscape.

### 6.1 Category Master Specification Table

| # | Slug / ID | Primary English Title | Local Hindi Title | Parent Sector | Color Accent | Lucide Icon | Hinglish / Hindi Keywords & Tags | Specialized Attributes & Services |
|---|-----------|----------------------|-------------------|---------------|--------------|-------------|----------------------------------|-----------------------------------|
| 1 | `street-food` | Street Food & Chaat | स्ट्रीट फूड / चाट / नाश्ता | Food & Refreshments | `#EA580C` (Orange-600) | `UtensilsCrossed` | poha, jalebi, sev, chaat, bhutte ka kees, garadu, dahi bada, samosa, kachori, sarafa, chappan, usal poha, khopra pattis | Morning/Evening shifts, Seating Available, UPI Accepted, Pure Vegetarian |
| 2 | `chai-beverages` | Chai & Beverages | चाय / शिकंजी / पेय | Food & Refreshments | `#B45309` (Amber-700) | `Coffee` | chai, tea, cutting, kulhad, cold coffee, shikanji, lassi, ganne ka ras, sugarcane juice, tapri, nimbu pani | Kulhad serving, Take-away, Quick stop, Open early morning |
| 3 | `cobbler-shoes` | Cobblers & Shoe Repair | मोची / जूता चप्पल रिपेयर | Everyday Services | `#4F46E5` (Indigo-600) | `Footprints` | mochi, cobbler, shoe repair, juta silai, sole pasting, polish, bag chain repair, sandal repair, belt punch | Sidewalk spot, Bag/Luggage repair, Umbrella repair, Fast service |
| 4 | `key-makers` | Key Makers & Locksmiths | चाबी वाले / डुप्लीकेट चाबी | Everyday Services | `#0284C7` (Sky-600) | `Key` | chabi, chaabi, key maker, duplicate key, lock opening, bike key, computerized key, tala chabi, laser key | Machine cutting, Laser key, Home emergency visit, Lock repair |
| 5 | `tailor-alter` | Tailors & Quick Alterations | दर्जी / सिलाई / रफू | Everyday Services | `#9333EA` (Purple-600) | `Scissors` | tailor, darzi, silai, alteration, raffu, pant folding, zip change, fitting, button stitch, fall piko | Portable sewing machine, Rapid alteration, Dry cleaning tie-up |
| 6 | `knife-sharpener` | Knife & Tool Sharpeners | धार वाले / कैंची धार | Everyday Services | `#DC2626` (Red-600) | `Flame` | dhar, dharwala, knife sharpener, kaichi dhar, cycle dhar, blade sharpening, butcher knife, grass cutter | Mobile bicycle-mounted grinding wheel, Roaming cart |
| 7 | `fruit-veg-thela` | Fruit & Vegetable Thelas | फल एवं सब्जी ठेला | Fresh Produce | `#16A34A` (Green-600) | `Apple` | thela, sabzi, fal, fruit, seasonal, kela, aam, seb, aloo, tamatar, fresh greens, mandi, pushcart | Electronic/beam scale, Daily fresh farm stock, Morning/evening shifts |
| 8 | `flower-vendors` | Flower & Garland Vendors | फूल माला / गजरा विक्रेता | Fresh Produce | `#DB2777` (Pink-600) | `Flower2` | phool, phoolmala, garland, gajara, gulab, marigold, genda, puja flowers, mandir stall, rajwada | Daily temple flowers, Fresh fragrant gajras, Festive puja sets |
| 9 | `bicycle-repair` | Bicycle & Puncture Repair | साइकिल मिस्त्री / पंचर | Everyday Services | `#0D9488` (Teal-600) | `Bike` | cycle, bicycle, puncture, hawa, air pump, chain repair, tyre, tube vulcanizing, mistri, cycle repair | Air pressure gauge, Tyre patch vulcanizing, Immediate assistance |
| 10 | `pottery-artisans` | Pottery & Clay Artisans | कुम्हार / मिट्टी के बर्तन | Artisans & Culture | `#C2410C` (Rust-700) | `Shapes` | kumhar, matka, mitti, clay pots, diya, kulhad, festive idols, gullak, handcrafted, diwali | Seasonal surge (Summer matkas, Diwali diyas), Handcrafted |
| 11 | `newspaper-books` | Newspaper & Book Stalls | अखबार / पुरानी किताबें | Information & Culture | `#475569` (Slate-600) | `BookOpen` | newspaper, raddi, book stall, competitive exam books, magazines, old books, jail road, stationary | Second-hand book buying/selling, Daily regional newspapers |
| 12 | `watch-mobile-rep` | Small Electronics & Watch | घड़ी व मोबाइल रिपेयर | Everyday Services | `#2563EB` (Blue-600) | `Watch` | watch repair, ghadi, mobile screen guard, charger, cable, battery replacement, strap, earphone | Micro-kiosk, Precision micro-tools, Budget mobile accessories |

### 6.2 Parent Sector Hierarchy & Filter Concurrency
The 12 granular categories map into 4 logical Parent Sectors:
1. **Food & Refreshments (`food-refreshments`):** Street Food & Chaat (`street-food`), Chai & Beverages (`chai-beverages`).
2. **Everyday Utility Services (`everyday-services`):** Cobblers & Shoe Repair (`cobbler-shoes`), Key Makers & Locksmiths (`key-makers`), Tailors & Alterations (`tailor-alter`), Knife Sharpeners (`knife-sharpener`), Bicycle & Puncture Repair (`bicycle-repair`), Small Electronics & Watch (`watch-mobile-rep`).
3. **Fresh Produce (`fresh-produce`):** Fruit & Vegetable Thelas (`fruit-veg-thela`), Flower & Garland Vendors (`flower-vendors`).
4. **Artisans & Culture (`artisans-culture`):** Pottery & Clay Artisans (`pottery-artisans`), Newspaper & Book Stalls (`newspaper-books`).

Users can filter by specific granular category pills or query across sectors.

---

## 7. The 14 Baseline Prototype Acceptance Criteria (PAC-01 through PAC-14)

The implementation and verification of GaliGuide are evaluated strictly against the 14 baseline Prototype Acceptance Criteria codified below:

### PAC-01: Leaflet Map Core Rendering & Indore Centering
- **Requirement:** System initializes and renders an interactive Leaflet map canvas utilizing free OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Pass Criteria:**
  - Map container occupies designated viewport height/width without gray missing tile seams or broken canvas layers.
  - Initial map center is positioned at Indore coordinates (`22.719600, 75.857700`, Rajwada) at zoom level 13.
  - Supports fluid zoom, drag, and pan interactions on touch and desktop devices.
  - OpenStreetMap attribution is cleanly rendered in the bottom right corner.

### PAC-02: Geolocation Request & Graceful Fallback Locality Selector
- **Requirement:** System prompts for HTML5 browser geolocation and handles both grant and denial states gracefully.
- **Pass Criteria:**
  - If geolocation is granted, map pans (`flyTo`) to user coordinates and drops a distinctive "You are here" marker.
  - If geolocation is blocked, denied, or times out, the application does not throw uncaught errors or render a blank screen.
  - Displays a clear notification banner and exposes a persistent **Locality Selector Dropdown** with at least 8 predefined Indore commercial hubs (Rajwada, Sarafa, Chappan Dukan, Palasia, Vijay Nagar, Bhanwarkuan, Annapurna, Malwa Mill).
  - Selecting an area instantly re-centers the map and updates vendor distances.

### PAC-03: Category Hierarchy Browsing & Filter Pills
- **Requirement:** Users can filter vendors by informal vendor categories via visual chips/pills.
- **Pass Criteria:**
  - Displays a responsive horizontal scrolling category pill bar containing all 12+ categories with icons, color accents, and titles.
  - Tapping any category chip filters map markers and vendor list cards to matching vendors in < 100 ms client latency.
  - The active vendor count indicator updates dynamically (e.g., *"Showing 8 Chai & Beverage spots nearby"*).
  - Tapping "All" or re-tapping the active chip resets the category filter.

### PAC-04: Real-time Partial Keyword Search with Debounce
- **Requirement:** Search bar allows typing queries to discover vendors by name, Hindi alias, category, or landmark.
- **Pass Criteria:**
  - Typing in search input is debounced by 300 ms before executing backend or client query.
  - Supports partial substring matching (e.g., `"chabi"`, `"dhar"`, `"garadu"`, `"puncture"`).
  - Case-insensitive matching functions across English and Hindi transliterated strings.
  - Matching pins are updated on map; non-matching pins are removed.
  - Displays a friendly, formatted zero-state when no vendors match the query.

### PAC-05: Leaflet MarkerCluster Grouping & Spiderfy
- **Requirement:** High-density clusters of nearby vendor markers aggregate into cluster badges with spiderfy behavior.
- **Pass Criteria:**
  - In areas with multiple vendors (e.g., Sarafa Bazaar or Chappan Dukan), markers combine into `Leaflet.markercluster` badges displaying the aggregate vendor count.
  - Clicking a cluster badge zooms the map smoothly to the cluster's bounding box.
  - Clicking a cluster at maximum zoom level (zoom 18) radially spiderfies co-located markers into a circular ring, enabling individual cart selection.

### PAC-06: Density Heatmap Layer Overlay
- **Requirement:** Toggleable Leaflet Heatmap layer visualizes commercial street vendor concentrations across the city.
- **Pass Criteria:**
  - A persistent, floating "Heatmap" toggle button is available on the map interface.
  - Toggling to Heatmap replaces individual markers with a continuous `Leaflet.heat` canvas layer (`L.heatLayer`).
  - Renders a multi-tier color intensity gradient (Blue -> Emerald -> Amber -> Red -> Purple) reflecting vendor density.
  - Toggling back to Markers immediately restores clustered marker pins.

### PAC-07: Dual Synchronized Map and List View
- **Requirement:** Map and list views maintain seamless, bidirectional real-time synchronization.
- **Pass Criteria:**
  - On desktop (>= 1024px), map and list render side-by-side.
  - On mobile (< 1024px), a sticky toggle switches between full Map View and full List View without resetting active filters.
  - Clicking a vendor card in the list centers and zooms the map to its pin and opens its popup.
  - Clicking a marker on the map automatically scrolls the corresponding vendor card into full view in the list pane and highlights its border.

### PAC-08: Comprehensive Vendor Profile Drawer / Modal
- **Requirement:** Selecting a vendor opens an exhaustive, culturally grounded micro-detail profile.
- **Pass Criteria:**
  - Opens a mobile bottom sheet drawer or desktop modal upon selection.
  - Displays: Trade Name, Local Hindi Name, Category Badge, Verification Shield, Distance from Anchor, Detailed Landmark Directions, Live Operating Status (Open Now / Closed), Operating Hours, Payment Modes (Cash/UPI), and Cart Mobility Type.
  - Live open/closed calculation handles overnight operating schedules (e.g., 08:00 PM – 03:00 AM) accurately.

### PAC-09: Click-to-Call Dialer Action
- **Requirement:** One-tap calling via native device dialer with strict privacy safeguards.
- **Pass Criteria:**
  - "Call Vendor" button triggers a standard `tel:+91XXXXXXXXXX` hyperlink, launching the native phone dialer on mobile devices.
  - If vendor phone consent is withheld (`phoneConsentGiven === false`) or phone number is absent, the phone number is suppressed and the call button is disabled or replaced with *"In-Person Visit Only"*.

### PAC-10: Zero-Cost Google Maps Navigation Link
- **Requirement:** Turn-by-turn navigation via external universal Google Maps deep-links without paid API dependencies.
- **Pass Criteria:**
  - Clicking "Get Directions" opens a new browser window/app tab linking to:
    `https://www.google.com/maps/dir/?api=1&destination={latitude},{longitude}`
  - Pre-fills the vendor's exact coordinates as the navigation destination.
  - Incurs zero billable Google Maps Platform API calls.

### PAC-11: Admin Authentication with JWT & Protected Routes
- **Requirement:** Secure email/password login, bcrypt hashing, and route protection for administrative operations.
- **Pass Criteria:**
  - Admin login form validates credentials against bcrypt hash via `POST /api/admin/auth/login`.
  - On success, issues a signed JWT token with 24-hour expiration stored in client storage.
  - Unauthenticated access to `/admin/*` views redirects immediately to `/admin/login`.
  - Backend rejects unauthenticated requests to `/api/admin/*` with HTTP 401 Unauthorized.

### PAC-12: Full Vendor CRUD in Admin Portal
- **Requirement:** Comprehensive management portal for creating, querying, updating, and deactivating vendor records.
- **Pass Criteria:**
  - Admin can create new vendors with complete form attributes (name, category, phone, consent, landmark, hours, location).
  - Admin dashboard displays a paginated, filterable, searchable data table of all vendors.
  - Admin can edit any existing vendor's attributes and persist updates.
  - Admin can deactivate (soft-delete) a vendor, immediately removing them from public discovery.

### PAC-13: Interactive Map Pin Drag & Click Coordinate Picker
- **Requirement:** Embedded spatial coordinate picker within admin vendor creation and edit workflows.
- **Pass Criteria:**
  - Inside the admin form, an embedded Leaflet map canvas allows clicking anywhere to drop a marker pin.
  - The pin is draggable; dragging the pin updates the form's Latitude and Longitude input fields in real time with 6 decimal places of precision.
  - Manually typing numeric coordinates into Latitude/Longitude inputs repositions the pin and centers the map.

### PAC-14: Verification Status Toggle & Safeguards Enforcement
- **Requirement:** Rapid verification status toggling and informal vendor safeguard enforcement.
- **Pass Criteria:**
  - Admin can toggle `isVerified` on any vendor with a single inline switch.
  - Toggling status instantly updates the database and creates an `AuditLog` record.
  - The public interface immediately reflects the updated verification badge (Green Shield for Verified, Amber for Community Listed).
  - Informal vendor safeguards (phone consent masking, non-residential mapping restrictions) are strictly enforced.

---

## 8. Data Architecture & Relational Schema Linkage

To ensure seamless alignment between this Product Requirements Document and the technical implementation, all functional requirements and entities correspond directly to normalized data models:

1. **`AdminUser` Model:** Manages administrative identity, bcrypt password hashes, and system roles (`SUPER_ADMIN`, `MUNICIPAL_ADMIN`, `FIELD_SURVEYOR`).
2. **`Category` Model:** Manages the 12+ informal vendor categories, slugs, Hindi titles, color hex codes, and Lucide icon keys.
3. **`Area` Model:** Manages predefined Indore municipal zones and commercial hubs with centroid coordinates and bounding radii.
4. **`Vendor` Model:** Core directory model storing business name, Hindi alias, category relation, area relation, 64-bit IEEE 754 floating point coordinates (`latitude`, `longitude`), landmark description, phone number, `phoneConsentGiven` flag, `isVerified` flag, `isActive` flag, mobility type enum (`STATIONARY`, `SIDEWALK`, `ROAMING_THELA`), and payment mode flags (`acceptsCash`, `acceptsUpi`).
5. **`OperatingHour` Model:** 7-day operating schedule records storing day of week (0–6), open time, close time, and overnight indicator.
6. **`AuditLog` Model:** Immutable governance records tracking administrative actions (`CREATE`, `UPDATE`, `VERIFY`, `DEACTIVATE`).

*(For full column types, foreign key constraints, indexes, and API endpoint contracts, refer to `docs/TECHNICAL_DESIGN.md`.)*

---

## 9. Implementation & Verification Mapping

Every feature and requirement defined in this PRD maps directly to the implementation phases and the 14-point acceptance verification test rubric:

| PRD Section | Functional Module | Acceptance Criteria | Target Milestone | Verification Method |
| :--- | :--- | :--- | :--- | :--- |
| **Section 4 (FR-01, FR-04)** | Map Canvas & Geolocation | PAC-01, PAC-02 | M1 / M2 / M3 | Visual verification, browser geolocation simulation, fallback locality selection test |
| **Section 4 (FR-02, FR-03)** | Category Filter & Bilingual Search | PAC-03, PAC-04 | M1 / M2 / M3 | 300 ms debounce testing, Hindi alias substring query assertions, pill click latency check |
| **Section 4 (FR-05)** | Clustering & Density Heatmap | PAC-05, PAC-06 | M2 / M3 | Cluster badge count assertions, spiderfy trigger at zoom 18, `L.heatLayer` canvas toggle test |
| **Section 4 (FR-06, FR-07)** | Vendor Profile & Action Triggers | PAC-07, PAC-08, PAC-09, PAC-10 | M1 / M2 / M3 | Drawer opening test, overnight hours logic test, `tel:` dialer link test, Google Maps routing link test |
| **Section 4 (FR-08, FR-09)** | Admin Auth & Vendor CRUD | PAC-11, PAC-12 | M2 / M3 | JWT issuance and 401 guard verification, Vendor CRUD lifecycle validation |
| **Section 4 (FR-10, FR-11)** | Map Pin Picker & Verification | PAC-13, PAC-14 | M2 / M3 | Map click/drag coordinate sync test, inline verification toggle and audit log test |
| **Section 5 (EC-01..EC-22)** | Edge Cases & Safeguards | PAC-02, PAC-09, PAC-14 | M1 / M2 / M3 | Error simulation testing (permission denial, timeout, phone masking, invalid bounds) |

---

## 10. Summary & Sign-off
This Product Requirements Document establishes the comprehensive, unambiguous, and production-grade baseline for the GaliGuide platform. All user journeys, edge cases, category taxonomies, informal vendor safeguards, and 14 prototype acceptance criteria are authoritatively defined to guide engineering implementation and forensic testing.
