# ADR 0005: Mathematical Haversine Geodesy with Bounding Box Pre-filtering

## Context
Spatial proximity queries ("find vendors within 500m of Palasia Square") traditionally require spatial database extensions such as PostGIS. Adding PostGIS increases database complexity and hosting cost.

## Decision
We implement spherical geodesy directly in TypeScript (`server/src/lib/haversine.ts`) using the **Haversine formula**, preceded by a fast **bounding-box latitude/longitude delta filter**.

## Rationale
1. **Zero Database Extensions:** Compatible with standard PostgreSQL without requiring `CREATE EXTENSION postgis`.
2. **Predictable Performance:** Pre-filtering by latitude and longitude bounds reduces candidate vendors to a tiny subset before running trigonometric functions.
3. **High Mathematical Precision:** Delivers sub-meter accuracy within the compact Indore metropolitan bounding box (`[22.650000, 22.780000]` latitude, `[75.800000, 75.930000]` longitude).

## Consequences
- **Positive:** Zero specialized infrastructure, portable between SQLite tests and Neon PostgreSQL production.
- **Negative:** Geodesy runs on serverless compute rather than inside SQL engine (negligible for vendor counts < 10,000).
