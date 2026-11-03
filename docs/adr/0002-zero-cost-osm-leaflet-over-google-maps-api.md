# ADR 0002: Zero-Cost OpenStreetMap & Leaflet over Google Maps Platform APIs

## Context
Commercial mapping APIs (such as Google Maps Platform JavaScript API, Places API, and Directions API) charge per map load and per geocoding query, which is unviable for a community-driven hyperlocal public utility.

## Decision
We mandate **Leaflet with OpenStreetMap raster tiles** for all interactive in-app map rendering, and delegate turn-by-turn routing to native mobile applications via zero-cost **Universal Google Maps deep links**.

## Rationale
1. **Zero Financial Overhead:** OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) are free and open source.
2. **Device-Native Routing:** Deep-linking to `https://www.google.com/maps/dir/?api=1&destination=lat,lng` offloads navigation to the user's native Google Maps app or browser without consuming API quota.
3. **High Density Clustering:** `leaflet.markercluster` provides smooth spiderfying at street level (zoom 18) for dense street food clusters (e.g. Chappan Dukan, Sarafa Bazaar).

## Consequences
- **Positive:** Zero API bills, no API key exposure risks, full offline raster caching potential.
- **Negative:** No proprietary Google Place ID lookups (mitigated by custom bilingual search and landmark guidance).
