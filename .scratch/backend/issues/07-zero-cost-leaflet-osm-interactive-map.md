# Ticket 07: OpenStreetMap & Leaflet Integration

## Goal
Provide a responsive, high-framerate interactive map using OpenStreetMap raster tiles and Leaflet with zero paid API consumption.

## Scope
- Integrate `leaflet` and `react-leaflet`.
- Use free raster tile endpoint: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`.
- Custom artisanal SVG map pins for food, chai, repairs, and seasonal vendors.
- Responsive touch gesture support for mobile pinch, pan, and tap.

## Acceptance Criteria
- [x] Zero network requests to `maps.googleapis.com` or Mapbox.
- [x] Initial center set to Indore city center (Rajwada Palace / Palasia).
- [x] Smooth rendering across mobile and desktop browsers.
