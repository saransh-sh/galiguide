# Zero-Cost Cartography Guardrail

Strict architectural ban on commercial mapping APIs across the GaliGuide codebase.

## Prohibited Dependencies & Patterns
- **NEVER** install or import `@googlemaps/js-api-loader`, `@react-google-maps/api`, or `mapbox-gl`.
- **NEVER** make HTTP requests to `https://maps.googleapis.com/maps/api/*` (Places, Directions, Geocoding, Distance Matrix).
- **NEVER** embed Google Maps JavaScript `<script>` tags in `index.html`.

## Permitted & Mandated Cartography
- **Rendering:** Leaflet (`leaflet`, `react-leaflet`) with OpenStreetMap raster tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Clustering:** `leaflet.markercluster` for spiderfying markers at zoom 18.
- **Heatmap:** `leaflet.heat` for vendor concentration density.
- **Navigation:** Deep link to `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`.
- **Spatial Calculations:** Mathematical Haversine calculations in `server/src/lib/haversine.ts`.
