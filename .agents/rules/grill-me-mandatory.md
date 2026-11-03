# Mandatory `/grill-me` (Strict)

**Do not guess requirements.** When anything is ambiguous, missing, or assumed, run `/grill-me` — do not proceed by filling gaps with assumptions.

## When `/grill-me` is Required
Run it before:
- Writing or updating feature specifications.
- Modifying architecture documents or ADRs in `docs/adr/`.
- Decomposing roadmap milestones in `.scratch/backend/issues/`.
- Writing production code for requirements that have ambiguous boundaries.

## Core GaliGuide Grilling Topics
- Spatial boundary logic (radius search vs bounding box deltas).
- Privacy boundaries (phone consent, role-based access).
- Zero-cost mapping constraints (no Google Maps Platform SDKs).
- Bilingual Devanagari indexing and normalization.
- Neon serverless connection limits and pooling strategies.
