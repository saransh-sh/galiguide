# GaliGuide — Frontend Product Requirements Document

**Document:** Frontend PRD  
**Version:** 1.0  
**Status:** Approved & Implemented  
**Product:** GaliGuide Client Web Application  
**Primary Stack:** React 18 + TypeScript + Vite + Tailwind CSS  
**Mapping Engine:** Leaflet + OpenStreetMap + MarkerCluster + Leaflet Heat (**Zero Google Maps API cost**)  
**Design Palette:** Indore Artisanal (Terracotta `#9d3e1c`, Sage `#3d6659`, Cream `#f5fbf3`)  
**Deployment:** Bundled into `client/dist` and served statically on Vercel at `/`

---

## 1. Frontend Product Definition

The GaliGuide frontend is an ultra-fast, mobile-first progressive web interface that empowers residents, tourists, and ward coordinators in Indore to discover, explore, and navigate to informal street vendors.

The frontend is responsible for:
- Full-screen interactive Leaflet cartography with OpenStreetMap raster tiles;
- Marker clustering with spiderfying at street zoom level (zoom 18) for dense markets;
- Density heatmap overlay toggling to visualize street food corridors;
- Bilingual discovery and search in English and Devanagari Hindi;
- Vendor detail modal sheets with 7-day operating hours and landmark guidance;
- Direct external handoff for native turn-by-turn routing via universal deep links;
- Native phone dialer links with privacy badges for unconsented contacts;
- Password-protected Municipal Ward Lead administrative portal (`/admin`).

---

## 2. Core User Flows & Views

### View 1: Interactive Live Map View
- Full-height OpenStreetMap container centered on Indore (`[22.7196, 75.8577]`).
- Custom SVG marker pins representing food thelas, chai gumtis, repair artisans, and fruit vendors.
- Grouped clusters showing vendor counts, expanding smoothly upon click.
- Floating controls: Heatmap toggle, Locate Me button, Category filter pills, Bilingual search bar.

### View 2: Vendor List & Discovery Cards
- Grid and list view for browsing vendors with thumbnail photos, bilingual names, and category chips.
- Distance badge (e.g. `120 m away`) calculated relative to user position or selected landmark.
- Real-time "Open Now" / "Closed" status pill computed against current local time.
- Action triggers:
  - **Get Directions:** Opens `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` in a new tab.
  - **Call Vendor:** Activates `tel:${phone}` if consented; displays privacy badge if unconsented.
  - **Details:** Opens bottom sheet modal with weekly schedule and landmark directions.

### View 3: Municipal Ward Lead Admin Portal
- Accessible via `/admin` with email and password login.
- Interactive Leaflet map with drag-and-drop pin picker for recording exact stall coordinates.
- Form inputs for English name, Hindi name, category, area, phone, consent toggle, roaming flag, and weekly operating hours.
- Vendor verification toggle with audit reason prompt.

---

## 3. Visual Identity & Anti-Slop Rules

See `.agents/skills/saransh_custom_antislop/SKILL.md` and `.cursor/rules/react-frontend.mdc`.

### Color Palette
- **Terracotta (Primary):** `#9d3e1c` (warm, clay-tandoor inspired)
- **Sage Green (Secondary):** `#3d6659` (natural, fresh mint chutney inspired)
- **Cream (Canvas Background):** `#f5fbf3` (calm, warm paper texture)
- **Dark Slate (Typography):** `#1a201c` (high-contrast legibility)

### Anti-Slop Guidelines
- **No purple/indigo AI gradients:** Avoid generic SaaS gradients.
- **No glassmorphism mud:** Solid, crisp surfaces with subtle borders (`border-stone-200`).
- **No decorative floating blobs:** Every visual element must convey vendor state or spatial geography.
- **Mobile ergonomics:** All interactive touch targets (buttons, pills, markers) must be $\ge 48\text{ px}$.
