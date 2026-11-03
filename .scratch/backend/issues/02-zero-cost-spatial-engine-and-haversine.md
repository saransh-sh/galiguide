# Ticket 02: Spatial Geodesy Engine & Bounding Boxes

## Goal
Implement mathematical spherical geodesy using the Haversine formula without external geocoding APIs or PostGIS extensions.

## Scope
- Implement `calculateHaversineDistance(lat1, lon1, lat2, lon2)` returning kilometers.
- Implement `calculateBoundingBox(lat, lon, radiusKm)` returning `[minLat, maxLat, minLon, maxLon]`.
- Enforce 6-decimal-place coordinate precision.
- Bound coordinates to Indore metropolitan limits (`[22.650000, 22.780000]` lat, `[75.800000, 75.930000]` lon).

## Acceptance Criteria
- [x] Tested against known Indore distances (Palasia Square to 56 Dukan = ~1.34 km).
- [x] Zero distance for identical coordinates.
- [x] Pre-filtering by bounding box before computing spherical trigonometry.
- [x] Meets PAC-09 and PAC-14.
