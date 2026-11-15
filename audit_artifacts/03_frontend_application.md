---
title: "GaliGuide Frontend Application & Cartography Audit"
document_id: "AUDIT-03-FRONTEND-2026"
version: "1.0.0"
status: "PRODUCTION_VERIFIED"
classification: "AI_INGESTIBLE_AUDIT"
last_audit_timestamp: "2026-11-15T14:59:00Z"
target_system: "React 18 Single Page Application (SPA)"
entrypoints:
  - "client/src/main.tsx"
  - "client/src/App.tsx"
  - "client/vite.config.ts"
  - "client/tailwind.config.js"
---

# 3. Frontend Application & Cartography Audit

## 3.1 Component Architecture & Application Hierarchy
The GaliGuide client is built with React 18, TypeScript, Vite 5, Tailwind CSS 3, and Leaflet 1.9.4. It is structured around an editorial, culturally authentic Indore design language with zero dependencies on commercial Google Maps APIs.

```
[index.html]
      │
      ▼
[client/src/main.tsx] -> React StrictMode Root
      │
      ▼
[client/src/App.tsx] -> Root State Manager (Coords, Search, Modals, Tab)
      ├── [Header.tsx] -> Global Navigation, Brand Compass, GPS Toggle, Admin Trigger
      ├── [ExploreView.tsx] -> Editorial Hero, Dual Search Console, Categories Bento Grid
      ├── [MapView.tsx] -> Split Cartographic View, Leaflet Map, Cluster Group, Proximity Feed
      ├── [VendorDetailDrawer.tsx] -> Slide-Over Profile, 7-Day Hours, Tel Dialer, Universal Navigation Link
      ├── [AdminPortal.tsx] -> IMC Ward Governance Dashboard, Vendor Registry Table
      │     └── [CoordinatePicker.tsx] -> Interactive Leaflet Map for Drag-and-Drop Pin Placement
      └── [AboutModal.tsx] -> Indore Heritage, Swachh Survekshan & Civic Mission Modal
```

---

## 3.2 Anti-Slop Design System & Visual Tokens

The user interface rejects generic AI templates (banning neon purple/indigo gradients, floating glassmorphism blobs, and nested card borders) in favor of a culturally grounded palette reflecting the historic street architecture of Indore and the Malwa region:

### Color Palette Specification (`client/tailwind.config.js`)
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9d3e1c',              // Terracotta Red-Orange (Historic Indore brick/clay)
        'primary-container': '#bd5632',    // Warm Terracotta Accent
        secondary: '#3d6659',            // Deep Sage Green (Subtle leafy civic accents)
        'secondary-container': '#bce9d9',  // Light Sage Highlight
        background: '#f5fbf3',           // Warm Cream / Off-White Surface
        surface: '#f5fbf3',              // Base Background
        'surface-container': '#eaefe8',  // Soft Grey-Green Container
        'surface-container-high': '#d6dcd4',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#191c1b',         // High-Contrast Deep Charcoal
        'on-surface-variant': '#404945', // Mid-Contrast Text
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
    },
  },
};
```

### Typography System (`client/index.html:11-14`)
- **Editorial Headings:** `Playfair Display` (serif, weights 600, 700, 800) for hero headlines, modal titles, and artisan trade cards.
- **Body & Data:** `Plus Jakarta Sans` (sans-serif, weights 400, 500, 600, 700) for high-legibility street names, operating hours, coordinates, and distance badges.

---

## 3.3 Zero-Cost Cartography Engine (Leaflet 1.9.4 + OpenStreetMap)

Implemented in `client/src/components/MapView.tsx:103-146`, the cartography engine strictly adheres to Golden Rule 1 (Zero Google Maps Platform API Cost):

```typescript
// OpenStreetMap Raster Basemap Layer (Zero-cost, no Google Maps API)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | GaliGuide Indore',
}).addTo(map);
```

### 1. Marker Clustering & Street-Level Spiderfy
- Library: `leaflet.markercluster` v1.5.3
- Configuration (`client/src/components/MapView.tsx:123-136`):
  ```typescript
  const clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 45,
    spiderfyOnMaxZoom: true,
    zoomToBoundsOnClick: true,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div><span>${count}</span></div>`,
        className: 'marker-cluster-custom',
        iconSize: L.point(40, 40),
      });
    },
  });
  ```
- **Sarafa & Chappan Collision Resolution:** In high-density food corridors where multiple stalls occupy adjacent physical space, clicking the cluster at zoom 18 radially spiderfies pins in a circle so every vendor pushcart is individually selectable.

### 2. Category Hotspot Density Heatmap Overlay
- Library: `leaflet.heat` v0.2.0
- Trigger: Floating Heatmap toggle switch (`isHeatmapActive`)
- Data Pipeline: Fetches coordinate intensity tuples `[lat, lng, intensity]` from `/api/vendors/heatmap`.
- Rendering Gradient: Sage Green (`#bce9d9`) -> Amber (`#efc055`) -> Terracotta (`#9d3e1c`).

---

## 3.4 Key Interactive Views & Features

### 1. Editorial Landing Page (`client/src/components/ExploreView.tsx`)
- **Hero Console:** Dual input bar accepting trade/service keywords and an Indore locality selector.
- **Bento Grid of Everyday Informal Guilds:** 10 interactive category tiles featuring custom Lucide SVG icons (`CategoryIcon` utility in `client/src/utils/categoryIcons.tsx`), active vendor count badges, and direct navigation links.
- **Civic Heritage Metrics:** Live street registry counter displaying total verified hawkers.

### 2. Interactive Discovery Map (`client/src/components/MapView.tsx`)
- **Desktop Split Layout:** Synchronized side-by-side view with interactive map canvas on the right and distance-ordered scrollable vendor cards on the left.
- **Bilingual Live Search:** 300ms debounced input filter matching English names, Devanagari Hindi aliases, landmarks, and trade keywords.
- **Indore Area Quick Filter:** Instant zoom-to-locality dropdown (Rajwada, Sarafa, Chappan Dukan, Palasia, Vijay Nagar, etc.).

### 3. Vendor Detail Slide-Over Drawer (`client/src/components/VendorDetailDrawer.tsx`)
- Displays vendor trade name, Devanagari Hindi alias, verified artisan checkmark, and stall type (`Pushcart Thela`, `Semi-Permanent Kiosk`, `Footpath Seat`, `Roaming Thela`).
- **Approximate Location Indicator:** When `isApproximateLoc === true`, displays amber warning banner advising users to rely on topological landmark guidance for mobile hawkers.
- **Zero-Cost Universal Navigation Link (`id="btn-get-directions"`):** Deep links to `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}&travelmode=walking`.
- **Privacy-Protected Device Dialer (`id="btn-call-vendor"`):** When phone consent is granted, triggers `tel:${vendor.contactPhone}`. When unconsented, disables button and displays *"In-Person Visit Only (No Public Phone)"*.
- **7-Day Operating Hours Table:** Displays daily opening and closing hours with the active day highlighted.

### 4. IMC Civic Governance Portal (`client/src/components/AdminPortal.tsx`)
- Secure authentication via email/password or one-tap demo credentials for Ward Admins.
- Overview metric cards: Total Listings, Formally Verified, Pending Field Review, Trade Guilds.
- Vendor registry table with search, status filtering (`ALL`, `VERIFIED`, `PENDING`, `SUSPENDED`), and inline verification toggles.
- **Interactive Coordinate Picker (`client/src/components/CoordinatePicker.tsx`):**
  - Embedded Leaflet map enabling administrators to drop a pin anywhere in Indore or drag the marker to update latitude and longitude in real time.
  - Quick-jump buttons to major commercial hubs (Sarafa, Chhappan, Rajwada, Palasia).
  - Numeric inputs validated to 6 decimal places (~0.11m precision).

### 5. Indore Street Heritage Modal (`client/src/components/AboutModal.tsx`)
- Details Indore's street food legacy, the 6-time Swachh Survekshan cleanest city heritage, Sarafa Night Bazaar, and the open-source civic mission of GaliGuide.

---

## 3.5 Build & Bundle Metrics

The client application compiles via Vite Rollup bundling into static distribution assets:
- **Build Command:** `npm run build --workspace=client` (`tsc && vite build`)
- **Build Duration:** 3.75 - 5.16 seconds
- **Asset Manifest (`client/dist/`):**
  - `dist/index.html`: 1.54 kB (entry HTML with meta tags and Google Fonts links)
  - `dist/assets/index.js`: 429.2 kB (bundled React, Leaflet, Lucide icons, and application logic)
  - `dist/assets/index.css`: 31.9 kB (Tailwind CSS utility classes and Leaflet marker styling)
- **TypeScript Typecheck:** 0 compiler errors or warnings.
