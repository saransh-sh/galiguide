# React Frontend Architecture Rules

Authoritative rules for the GaliGuide React SPA (`client/`).

## Layer Flow
```text
pages / views -> components -> hooks -> lib/api -> Express API (/api/*)
```

## Mandatory Constraints
1. **Zero-Cost Mapping Engine:** Under NO circumstances may the frontend load Google Maps JavaScript API SDK (`maps.googleapis.com`), Mapbox, or paid tile providers.
2. **OpenStreetMap + Leaflet:** All maps must be rendered with Leaflet using OpenStreetMap raster tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
3. **Clustering & Heatmap:** Markers must spiderfy at street level (zoom 18) via `leaflet.markercluster`. Density layers must render via `leaflet.heat`.
4. **Navigation Action:** "Get Directions" must open `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` in a new tab (`target="_blank"`), launching the native device Google Maps app for free.
5. **Phone Dialer:** Dialing vendor phone numbers must use `<a href="tel:${vendor.phone}">` when valid, and show privacy badges when unconsented.
6. **Anti-Slop Color Discipline:** Adhere to the Indore Artisanal palette:
   - Terracotta Primary: `#9d3e1c`
   - Sage Secondary: `#3d6659`
   - Warm Cream Surface: `#f5fbf3`
   - Zero purple AI gradients, zero heavy glassmorphism, zero floating blobs. Minimum 48px touch targets.
