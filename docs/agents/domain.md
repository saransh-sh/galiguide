# Domain Docs — GaliGuide

How engineering agents and developers should consume GaliGuide domain documentation when exploring the codebase.

## Before Exploring, Read These

- **`CONTEXT.md`** at the repo root — defines the authoritative ubiquitous language and terms to avoid.
- **`AGENTS.md`** at the repo root — defines the 6 Golden Rules of GaliGuide and non-negotiable coding standards.
- **`docs/adr/`** — read ADRs touching the architectural area you plan to modify.

## Directory Structure

```text
/
├── CONTEXT.md
├── AGENTS.md
├── docs/
│   ├── ARCHITECTURE_CODING_STANDARDS.md
│   ├── adr/
│   │   ├── 0001-modular-monolith-express-prisma-neon.md
│   │   ├── 0002-zero-cost-osm-leaflet-over-google-maps-api.md
│   │   ├── 0003-serverless-single-deployment-on-vercel.md
│   │   ├── 0004-privacy-first-phone-masking.md
│   │   └── 0005-haversine-geodesy-bounding-box-filtering.md
│   └── agents/
│       ├── domain.md
│       ├── issue-tracker.md
│       └── triage-labels.md
├── server/
└── client/
```

## Use the Glossary's Vocabulary

Always use the terms defined in `CONTEXT.md`:
- Use **Vendor**, never "Merchant", "Shop", or "Store".
- Use **Thela** or **Gumti**, never "Food truck" or "Kiosk".
- Use **Operating Schedule**, never "Store hours".
- Use **Universal Navigation Link**, never "Google Maps SDK".
- Use **Ward Lead**, never "Store manager".

## Flag ADR Conflicts

If a proposed architectural change contradicts an existing ADR, surface it explicitly:
> *Contradicts ADR 0002 (zero-cost OSM leaflet over google maps api) — but worth reopening because...*
