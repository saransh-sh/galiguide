# GaliGuide V2 — Product, Frontend, Backend & AI Asset Implementation Plan

**Document:** `plan1.md`  
**Project:** GaliGuide — Hyperlocal Informal Vendor Discovery & Navigation  
**Plan version:** 3.0 — Consolidated master plan  
**Prepared:** 15 November 2026  
**Status:** Proposed implementation blueprint  
**Source of truth:** The supplied `audit_artifacts.zip`, the original `plan1.md`, the updated `galiguide_v2_prd_implementation_plan.md`, and the six audit-alignment corrections. The current repository remains authoritative where audits are stale; discrepancies must be reported.

---

## Consolidation note

This master plan retains the original plan's detailed workstreams, component guidance, phased roadmap, test matrix and agent instructions. It incorporates the updated PRD's screen-level requirements and the audit-alignment corrections. It supersedes the two separate planning files for implementation; keep the source audit files available as evidence.

Where the two earlier plans conflicted, this version resolves the known conflicts explicitly:
- Audit history: `onDelete: SetNull` is preferred over adding soft-delete fields, preserving PAC-08 physical deletion.
- Ice Silver is an active muted surface token.
- Vercel proxy trust is verified before configuration rather than blindly assumed.
- Existing CI `prisma db push` behaviour is reconciled before introducing migrations/extensions.
- AI asset production includes actual generation and frontend integration, not prompt documentation alone.

---

## 0. Executive direction

GaliGuide V2 is a **product-quality redesign and engineering refinement**, not a rewrite.

The product should become a distinctive, mobile-first platform for discovering the people, skills and services around Indore's streets. Its identity is **Contemporary Street Culture**: locally grounded, human, confident, useful and recognisable.

### Confirmed design decisions

- **Visual personality:** Contemporary Street Culture.
- **Density:** Balanced — information-rich without feeling crowded.
- **Responsive priority:** Mobile-first, then tablet and desktop.
- **Brand palette:**
  - Ice Silver: `#DDE3E8`
  - Deep Aubergine: `#3A0F34`
  - Marigold: `#EAAA00`
- **Supporting palette:**
  - App background: `#F5F6F7`
  - Surface: `#FFFFFF`
  - Muted surface: `#E9EDF0`
  - Main text: `#241D25`
  - Secondary text: `#69717A`
  - Border: `#CDD4DB`
  - Success: `#287A55`
  - Warning: `#A66A00`
  - Danger: `#B33B43`
- **Typography proposal:** Manrope for display/headings, Inter for interface/body, Noto Sans Devanagari for Hindi. Confirm actual font loading, licensing and rendering before release.

### Product outcome

A user should be able to open GaliGuide on a phone, understand what it does immediately, search in English or Hindi, discover a nearby vendor, understand the vendor's location and operating information, and navigate to them with minimal friction.

An administrator should be able to safely onboard, locate, review, verify, update and manage vendors without using a consumer-facing layout.

### Core principle

**Use AI and automation where they create real value. Do not add AI features, dependencies, infrastructure or recurring costs merely to make the product appear more advanced.**

---

## 1. Source audit baseline and constraints

The supplied audit describes the following architecture:

| Layer | Existing audited implementation |
|---|---|
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS 3 |
| Mapping | Leaflet 1.9.4, OpenStreetMap, MarkerCluster, Leaflet.heat |
| Backend | Express + TypeScript |
| Validation | Zod |
| ORM | Prisma |
| Database | Neon Serverless PostgreSQL |
| Authentication | bcrypt + JWT for administrators |
| Deployment | Unified Vercel deployment; SPA and `/api` |
| Tests | Jest backend tests and PowerShell acceptance/regression script |

The audit reports 25/25 feature checks, 14/14 prototype acceptance criteria and 22/22 edge-case checks as passing. It also reports 23 backend unit tests passing. Treat these as the **reported baseline**, not as proof that every behaviour remains correct today. Re-run the checks against the current repository before making changes.

### Existing product capabilities to preserve

- Bilingual English/Devanagari names and search.
- Category and locality discovery.
- GPS discovery and locality fallback.
- Haversine proximity calculation.
- Leaflet/OSM map.
- Marker clustering and spiderfication.
- Vendor list/map synchronisation.
- Heatmap overlay.
- Vendor profiles and landmark guidance.
- Approximate-location warnings.
- Operating schedules, including overnight trading.
- Privacy-gated public phone information.
- External walking directions link.
- Admin login and role-protected operations.
- Vendor CRUD and verification states.
- Coordinate picker and coordinate validation.
- Audit history.
- Single-domain Vercel deployment.

### Non-negotiable constraints

1. Do not replace Leaflet/OSM with Google Maps or a paid mapping SDK.
2. Do not rewrite the backend in another framework.
3. Do not migrate the database provider without a demonstrated need.
4. Do not change public API contracts casually to suit a component.
5. Do not expose database credentials, JWT secrets or Gemini keys in browser code.
6. Do not weaken vendor phone consent, admin authentication or role checks.
7. Do not remove approximate-location safeguards.
8. Do not fabricate vendor names, locations, contact details, opening hours, verification or photos.
9. Do not make generated images appear to be documentary photographs of real registered vendors.
10. Keep the application useful when AI services are unavailable.

---

## 2. Workstream A — Product UX and frontend redesign

### A1. Brand and design system

Create one shared design system before redesigning individual pages.

#### Colour usage

- Deep Aubergine is the primary brand colour for navigation, headings, important actions and selected states.
- Marigold is a restrained accent for active selections, important highlights and selected map markers.
- Ice Silver is an actively used secondary surface, not a decorative or unused token. Apply it to search/input wells, discovery-list backdrops, filter bars, inactive filter pills and landmark callouts; keep #F5F6F7 as the page canvas and #FFFFFF for elevated cards.
- White and near-white surfaces carry most content.
- Status colours must remain semantically distinct: green for verified/open, amber for approximate/warning, red for errors/destructive actions.

Do not turn every card, button, icon or category into a marigold element. Do not use aubergine as a large background behind every section.

#### Design tokens

Create semantic CSS variables and map Tailwind theme tokens to them. Components must consume semantic tokens instead of scattering raw hex values.

Suggested tokens:

```css
:root {
  --color-brand: #3A0F34;
  --color-accent: #EAAA00;
  --color-ice-silver: #DDE3E8;

  --color-background: #F5F6F7;
  --color-surface: #FFFFFF;
  --color-surface-muted: #DDE3E8; /* Ice Silver: active secondary canvas */

  --color-text: #241D25;
  --color-text-muted: #69717A;
  --color-border: #CDD4DB;

  --color-success: #287A55;
  --color-warning: #A66A00;
  --color-danger: #B33B43;

  --radius-control: 10px;
  --radius-card: 14px;
  --radius-panel: 18px;
}
```

Define spacing, typography scale, shadows, focus rings, z-index layers, motion durations and breakpoints centrally. Keep motion subtle and respect `prefers-reduced-motion`.

#### Visual language

- Contemporary Indian street-culture identity.
- Authentic, consented street/vendor photography where available.
- Strong editorial composition, clear information hierarchy and restrained graphic motifs.
- Lucide icons used consistently.
- No generic SaaS dashboard appearance.
- No excessive pills, nested cards, glassmorphism or gradient decoration.
- Avoid ornamental Indian motifs that do not communicate anything about the actual place or service.

### A2. Landing page / Explore

**Priority: P0**

Rebuild the landing page around the primary task: discovering people and services.

Recommended hierarchy:

1. Compact brand/navigation header.
2. Clear introductory headline and concise explanation.
3. One prominent search experience.
4. Locality selector integrated into or immediately beside search.
5. Popular/trending search suggestions based on real supported categories or queries.
6. Category directory.
7. Nearby vendors or discovery preview when location permission/data allows.
8. Short explanation of GaliGuide's mission.
9. Footer with project/about information.

Suggested copy direction:

> The streets have more to offer.  
> Find the people behind your neighbourhood.

Requirements:

- Search should be the most prominent action.
- Do not use a large hero photograph that pushes the search below the fold on mobile. Remove the unrelated tropical beach/resort visual visible in the audited landing screenshot; replace it with a locally grounded Indore street-culture visual or clearly illustrative editorial composition. Keep the dual search/locality action visible above the fold.
- Use real/consented local photographs or clearly illustrative generated imagery.
- Do not invent a live vendor count. Use the API and show a loading/empty state.
- Keep location permission contextual and optional.
- Ensure the landing page works if GPS is denied.

### A3. Discovery map

**Priority: P0 — highest UX importance**

Retain the existing Leaflet map and discovery data flow.

#### Desktop

- Compact global header.
- Search and locality controls.
- Grouped category/filter controls.
- Balanced split layout: approximately 35–40% vendor results and 60–65% map, adjustable after testing.
- Scrollable vendor list with clear selected state.
- Map toolbar for locate-me, zoom, heatmap and relevant map actions.
- Small legend when heatmap is active.
- Avoid covering map attribution or essential map controls.

#### Mobile

Do not shrink the desktop split layout. Implement a map-first experience.

- Map occupies the usable viewport.
- Search is accessible near the top.
- Category chips scroll horizontally.
- Vendor results use a draggable bottom sheet.
- Bottom sheet supports collapsed, half-expanded and expanded states.
- Selecting a list item highlights/centres the corresponding map marker.
- Selecting a marker opens the matching vendor preview.
- Provide an obvious way to return to the full map.
- Keep GPS, zoom and heatmap controls reachable without covering the selected vendor.
- Coordinate gestures between the sheet and Leaflet; avoid accidental page scrolling.

#### Map requirements

- Keep OpenStreetMap attribution.
- Preserve marker clustering and spiderfication.
- Use aubergine for normal vendor markers and marigold for selected markers.
- Clearly distinguish approximate locations.
- Do not imply GPS-level accuracy for approximate vendor coordinates.
- Keep heatmap colour scale readable and explain what it represents.
- Ensure the map has a useful fallback when tile loading fails.
- Preserve `.marker-cluster-custom` as a stable DOM/class selector during any cluster redesign.
- Use the approved heatmap gradient `0.3: #DDE3E8`, `0.65: #EAAA00`, `1.0: #3A0F34`, and show a compact legend only while the heatmap is active.
- A subtle `.leaflet-tile-pane` treatment may be tested (`saturate(0.74) contrast(1.04) brightness(0.99)`), but retain map-label, road and attribution legibility; remove the filter if it reduces usability.
- Preserve marker spiderfication at maximum zoom (audited configuration uses zoom 18) and verify it after styling changes.

### A4. Search and filters

**Priority: P0/P1**

- Preserve English and Devanagari matching.
- Search vendor names, Hindi aliases, category terms and landmarks where supported.
- Preserve debouncing and request cancellation.
- Keep category, locality and distance filters understandable.
- Display active filter count and provide a clear reset action.
- Provide loading, empty, error and retry states.
- Do not make the interface imply that fuzzy/semantic search exists until it is implemented and tested.
- Preserve pagination and result limits.

### A5. Vendor card and profile

**Priority: P1**

Vendor card should prioritise:

1. Vendor name.
2. Hindi name where available.
3. Category/stall type.
4. Verification status.
5. Open/closed state only when backed by valid schedule evaluation.
6. Locality and landmark.
7. Distance when a valid user location is available.

Profile should be structured into:

- Identity and category.
- Verified status.
- Open/closed status and next opening information.
- Landmark guidance.
- Stall type and description.
- Operating schedule.
- Contact action only when consent permits.
- Directions action.
- Approximate-location warning where applicable.

Use the domain labels consistently:
- `PUSH_CART` → Thela / Pushcart.
- `KIOSK` → Gumti / Semi-Permanent Stall.
- `GROUND_MAT` → Phad / Ground Setup.
- `ROAMING` or `isApproximateLoc === true` → Roaming Vendor / Mobile Hawker.

Do not show placeholder or fabricated ratings, reviews, photographs, prices or business claims. Do not show a call action if the API has withheld the number.

Preserve the automated selectors `id="btn-get-directions"` and `id="btn-call-vendor"` when splitting `VendorDetailDrawer` into smaller components. Keep the directions action visually primary (Marigold with Aubergine text) and the consented call action secondary (Aubergine with Ice Silver text). When contact is withheld, preserve the call selector on the disabled privacy-state control and communicate “In-Person Visit Only”.
Strip legacy description prefixes matching `/^\\[Stall Type:[^\\]]+\\]\\s*/i` in the UI formatter as a defensive fallback; the database and API cleanup is also required. Display the stall type as a separate human-readable badge, not embedded metadata.

### A6. Category directory

**Priority: P1**

Use a distinctive directory layout rather than ten identical bento cards.

Each category can show:

- Icon/illustration.
- English and Hindi labels.
- Short description.
- Live vendor count.
- Explore action.

Counts and labels must be API-backed. Category colours should be semantic and accessible, not hardcoded as the old Terracotta/Sage palette.

### A7. About and heritage

**Priority: P2**

Keep the local/civic story, but review every factual claim. Use source-backed statements about Indore and GaliGuide. Avoid unsupported superlatives, stale statistics or claims of municipal endorsement unless formally authorised.

### A8. Admin portal

**Priority: P1/P2**

Use a dedicated admin layout, not a consumer navigation layout with tables added.

Navigation:

- Overview
- Vendor Registry
- Add Vendor
- Verification Queue
- Categories
- Areas / Localities
- Audit Logs
- Settings (only if implemented)

Overview:

- Total vendors.
- Verified vendors.
- Pending verification.
- Active categories.
- Recent activity.
- Useful actions.

Vendor registry:

- Search.
- Status/category/locality filters.
- Pagination.
- Clear verification state.
- Edit and review actions.
- Confirmation for destructive actions.
- Responsive table or mobile record cards.

Vendor onboarding should be grouped into logical steps:

1. Basic identity.
2. Category and stall type.
3. Locality and landmark.
4. Map coordinates.
5. Contact details and consent.
6. Operating hours.
7. Review and submit.

Coordinate picker must retain Leaflet, coordinate bounds validation, Indore-area advisory and clear distinction between exact and approximate location.

---

## 3. Workstream B — Backend and data improvements

The backend should be refined, not rewritten.

### B1. P0 — Operating-hours correctness and timezone

The backend audit shows the schedule evaluator uses JavaScript `Date` local-time methods and checks the current day's schedule. This is a risk in a serverless deployment whose runtime timezone should not be assumed to be India.

Implement explicit `Asia/Kolkata` evaluation.

Requirements:

- Use a timezone-aware date/time library or a well-tested `Intl`-based implementation.
- Never rely on the server machine's local timezone.
- Evaluate today's schedule.
- Also evaluate the previous day's schedule for overnight shifts.
- Correctly handle overnight windows such as 18:00–01:30.
- Correctly handle closed days and missing schedules.
- Return a consistent status and next-opening information.
- Define whether opening and closing boundaries are inclusive.
- Keep one authoritative server-side evaluation for public API status.

Tests must include:
- Normal daytime shift.
- Overnight shift across weekday boundary.
- Monday 00:30 for a Sunday 18:00–Monday 01:30 shift.
- Closed today but previous day overnight shift still active.
- Closed previous day.
- No schedule.
- Exact opening and closing boundary.
- Server process running in UTC while business timezone is Asia/Kolkata.

### B2. P0 — Audit log retention and deletion semantics

The supplied Prisma schema shows `AuditLog.vendorId` is already nullable (`String?`), while the `AuditLog.vendor` relation uses `onDelete: Cascade`. Physical vendor deletion can therefore erase audit history even though the foreign key can support a null relation. The existing PowerShell regression suite (`scripts/verify_galiguide.ps1`, PAC-08) expects a full Create → Read → Update → Delete lifecycle and verifies that the deleted test vendor disappears from public discovery.

**Preferred V2 approach: preserve physical deletion and change the audit relation to `SetNull`.**

```prisma
vendorId String?
vendor   Vendor? @relation(
  fields: [vendorId],
  references: [id],
  onDelete: SetNull
)
```

Implementation requirements:

- Change only `AuditLog.vendor` to `onDelete: SetNull`; `vendorId` is already nullable.
- Keep `OperatingHour.vendor` on `onDelete: Cascade` so dependent schedule rows are cleaned up with the vendor.
- Before or within the transaction that physically deletes a vendor, write the final DELETE audit row with actor/admin ID, action, timestamp, reason and a JSON snapshot of the vendor.
- When the vendor row is deleted, prior audit rows must remain, with `vendorId` set to `NULL`; preserve their action, admin ID, reason, snapshot and timestamp.
- Keep public `GET /api/vendors` and `GET /api/vendors/:id` behaviour compatible with PAC-08: physically deleted records must no longer appear in discovery and detail must return 404.
- Do not weaken or delete PAC-08 to make a soft-delete implementation pass.

**Optional future alternative:** if product requirements later justify soft deletion, introduce `deletedAt`/`deletedBy` only through a separately reviewed design. Public list and detail endpoints must filter deleted records; `GET /api/vendors/:id` must return 404 for a deleted vendor, and the PAC lifecycle must be deliberately updated and revalidated. Do not add these columns merely to solve the current audit-log cascade issue.

If legal/data-retention requirements demand removal of personal data, separate personal-data retention from the minimum audit evidence. Do not retain unnecessary personal information indefinitely.

### B3. P0 — Prisma serverless lifecycle and Vercel proxy trust

The audited deployment runs the Express API through Vercel serverless infrastructure. Confirm the actual wrapper and forwarded-header path before changing proxy trust.

Requirements:

- Reuse a Prisma client singleton across warm serverless invocations and local development reloads where appropriate, using a `globalThis` guard that is safe for the project's runtime and TypeScript setup.
- Avoid creating a new Prisma connection pool for every request or handler invocation.
- Review Neon pooled connection settings and verify connection reuse under repeated requests.
- Configure Express `trust proxy` before rate-limiting middleware only after verifying the number and behaviour of trusted Vercel proxy hops.
- The audit-alignment proposal uses `app.set('trust proxy', 1)`, but do not blindly trust arbitrary forwarded headers or assume one hop without checking the deployed request path.
- Verify that rate limiting keys on the actual client IP and does not collapse all users onto a shared Vercel edge address.
- Add staging checks for multiple client IPs, spoofed `X-Forwarded-For` headers and rate-limit behaviour.

### B4. P1 — Database seed and legacy string cleanup

The vendor-detail screenshot shows a raw metadata prefix such as `[Stall Type: SEMI_PERMANENT_KIOSK]` inside the human-readable description. Treat this as a data-quality defect, not merely a styling issue.

Requirements:

- Inspect all existing vendor descriptions before cleanup and identify the exact prefix variants present.
- Perform a controlled, idempotent SQL cleanup in a disposable Neon branch first. The known prefix pattern is `/^\\[Stall Type:[^\\]]+\\]\\s*/i`.
- Apply the cleanup to existing records only after previewing affected rows and obtaining approval.
- Add defensive API serialization so the prefix is stripped from responses even if a legacy record remains.
- Update `server/prisma/seed.ts` so future seeds never prepend stall-type metadata to `description`.
- Keep stall type as a structured enum and render it separately using Thela, Gumti, Phad and Roaming Vendor terminology.
- Review `Category.color` defaults and seed values; remove old Terracotta/Sage brand coupling and align defaults with the V2 palette without treating category colours as the source of brand identity.
- Re-run seed idempotency and vendor profile regression checks.

### B5. P1 — Search performance

Current audit describes case-insensitive substring search (`ILIKE`) and a small current dataset. Keep PostgreSQL as the search platform for now.

Investigate:

- PostgreSQL `pg_trgm` extension and GIN/GiST indexes for substring matching.
- Indexes matching real filter combinations.
- Query plans using `EXPLAIN (ANALYZE, BUFFERS)` on representative data.
- Case-insensitive and Devanagari matching behaviour.
- Escaping wildcard/regex-like input safely.
- Avoiding unnecessary joins and schedule hydration in list queries.
- Search request cancellation and stale-response prevention on the client.

Do not add Elasticsearch or a vector database without measured need. If considering `pg_trgm`, first verify the extension is available in local, preview and CI PostgreSQL environments and use `CREATE EXTENSION IF NOT EXISTS pg_trgm` in a reviewed, reproducible setup.

### B6. P1 — Pagination and API contract

Review `GET /api/vendors`:

- Enforce a maximum `limit`.
- Validate page/limit and all query parameters with Zod.
- Escape wildcard/special search characters (`%`, `_`, `\\`) safely for the intended ILIKE semantics.
- Use deterministic ordering (distance plus stable tie-breaker, or another documented sort).
- Return consistent pagination metadata.
- Keep response envelope stable.
- Ensure filters are applied server-side.
- Ensure deleted, rejected and suspended vendors are excluded from public results according to policy.
- Avoid returning unnecessary private/admin fields.

Document endpoint request/response examples and error codes.

### B7. P1 — Database indexes and query efficiency

Review the current indexes against actual query patterns.

Potential areas to investigate:

- Vendor status + category.
- Vendor area.
- Latitude/longitude bounding box query.
- Name search and trigram index.
- Operating hours unique vendor/day lookup.
- Audit log vendor/admin/time queries.

Do not add indexes blindly. Validate with query plans and migration tests. Measure query latency before and after.

### B8. P1 — Security review

Review and test:

- Admin login rate limiting and lockout/abuse controls.
- JWT expiry, issuer/audience, signing algorithm and secret strength.
- Token storage and logout behaviour.
- Role checks on every administrative endpoint.
- Whether a 24-hour token lifetime is appropriate.
- Input validation on all write endpoints.
- Mass assignment protection.
- CORS policy.
- Helmet/security headers.
- Request body limits.
- Rate limiting on public search and heatmap endpoints.
- Sensitive data in logs and error messages.
- Admin phone access and consent policy.
- Destructive action authorisation.

The audit states that admin JWTs are stored in localStorage and expire after 24 hours. Review the XSS exposure and token lifecycle before changing the mechanism. Do not silently alter auth contracts during a visual redesign.

### B9. P1 — Heatmap and public data controls

- Ensure heatmap includes only eligible public/verified vendors according to the documented policy.
- Avoid exposing exact coordinates for vendors whose location should be approximate.
- Validate category filter.
- Cap result size.
- Cache only where invalidation and privacy rules are clear.
- Return a clear empty state when there is no density data.

### B10. P2 — Category metadata and theme separation

The existing Category model has a colour field with an old Terracotta default.

Do not let backend category colour dictate brand identity.

Preferred approach:

- Backend supplies category identity, slug, icon key, labels and description.
- Frontend design system maps category keys to semantic presentation tokens.
- If custom category colours remain supported, validate them and ensure accessible contrast.
- Update seed data/migrations carefully.
- Keep category ordering and active status API-driven.

### B11. P2 — Data quality and vendor trust

Add admin-side validation and review guidance for:

- Duplicate vendor records.
- Invalid/implausible coordinates.
- Missing landmarks.
- Missing Hindi aliases where available.
- Incomplete operating hours.
- Phone consent state.
- Exact versus approximate coordinates.
- Suspended/rejected/soft-deleted records.

Do not automatically invent missing vendor information using AI.

---

## 4. Workstream C — Database and API migration discipline

Before changing the database:

1. Inspect the current Prisma schema and migrations.
2. Inspect live schema state and migration history.
3. Take/verify a backup or Neon branch.
4. Create a migration plan.
5. Test migration against a disposable branch/database.
6. Verify rollback or recovery path.
7. Apply to production only after approval.

Rules:

- Do not run `prisma db push` against production as a shortcut for a structural change.
- Prefer reviewed, versioned migrations for schema changes, but first reconcile this with the audited `.github/workflows/ci.yml`, which currently runs `npx prisma db push --schema=server/prisma/schema.prisma`. Do not introduce a migrations directory or extension dependency without updating and testing the CI workflow deliberately.
- Preserve existing data.
- Add nullable fields or backfill in safe stages where appropriate.
- Do not rename/remove columns until all readers/writers have migrated.
- Update Prisma client and generated types.
- Test migration with existing production-like data. Confirm the CI PostgreSQL service can apply the same schema and any required extensions; if `pg_trgm` is introduced, enable it explicitly in the test database before schema/index creation.
- Keep secrets out of migration logs and screenshots.

Potential schema changes include soft-delete metadata and any audit-log relationship change. The final schema must be derived from the actual repository, not copied blindly from this plan.

---

## 5. Workstream D — Gemini API, Antigravity skill and generated assets

### D1. What `gemini-api-dev` is for

The `gemini-api-dev` Antigravity skill is a developer skill for writing code that uses the Gemini API. The official skill description covers text generation, multi-turn chat, multimodal understanding, image generation/editing, video generation, speech generation, streaming, function calling, structured output, agents and related SDK practices.

It is **not itself an image generator UI** and does not automatically create a polished asset library merely by being installed. It teaches/steers the coding agent to use the current Gemini API and SDK correctly when implementing those workflows.

Use it when:
- Building a small internal asset-generation utility.
- Writing scripts that call Gemini image generation/editing.
- Building an optional future AI capability.
- Implementing structured-output or multimodal workflows.
- Integrating Gemini into a backend service.

Do not invoke it for ordinary CSS, SVG icon work or manual layout composition where an API integration is unnecessary.

### D2. Asset generation strategy

Use Gemini image generation as a **design production tool**, not as an uncontrolled runtime dependency.

The coding agent must not stop after writing prompts or listing ideas. The required outcome is a reviewed asset inventory, generated candidate assets, approved final files, and integration into the actual React application. First inspect every existing screen and component to discover what is genuinely needed; do not invent decorative assets just to increase asset count.

Potential asset families:

| Asset family | Use | Recommended production method |
|---|---|---|
| Hero photography | Landing page visual | Generate carefully art-directed illustrative/local-street imagery, or use consented real photos |
| Category illustrations | Category tiles | Generate a consistent illustration family or create clean vector illustrations |
| Empty states | No results, no location, no vendors | Generate simple brand-consistent illustrations |
| About/heritage visuals | Brand storytelling | Use authentic licensed/consented photography where possible |
| Promotional/social assets | Project presentation and outreach | Generate campaign compositions and edit them |
| Decorative textures | Subtle street-inspired background details | Generate restrained textures, then optimise |
| Logo/wordmark | Brand identity | Build as editable vector typography/SVG; do not rely on image-generated lettering |
| Icons | UI controls and categories | Use Lucide or hand-authored SVG, not raster AI images |

**Important authenticity rule:** generated images of people must be clearly illustrative/representative. Never present generated people as actual registered Indore vendors. For a real vendor profile, use an authentic photograph only with permission. If no image is available, use a neutral category illustration or initials/avatar treatment.

### D3. Recommended Gemini asset workflow

1. Write an asset brief and visual reference board.
2. Define a consistent art direction: contemporary Indian street culture, Indore context, Ice Silver/Aubergine/Marigold accents, natural light, human-scale documentary composition.
3. Generate multiple candidate images.
4. Review for cultural accuracy, realism, unwanted text, distortions and consistency.
5. Edit/iterate with reference images.
6. Select final assets manually.
7. Crop/export to required aspect ratios.
8. Optimise WebP/AVIF and create responsive sizes.
9. Add descriptive filenames, alt text, source/licence and generation notes.
10. Store in the project asset directory and commit only approved final assets.
11. Integrate the approved files into the actual frontend components and remove obsolete placeholders.
12. Verify crop, focal point, loading behaviour, responsive sizes and visual quality on mobile, tablet and desktop.
13. Maintain an inventory with asset ID, filename, component/route, purpose, dimensions, format, source/generation method, approval status and alt text.

For important hero and campaign visuals, generate multiple candidates and compare them before selecting a final. For category visuals, generate a coherent family with consistent illustration language rather than unrelated one-off pictures. Obtain approval before large batches or meaningful API spend.

Do not generate text inside images for UI labels, maps, signage or logos. Render text in HTML/SVG so it remains accessible, searchable and correct.

Minimum asset inventory to assess:
- Landing hero/editorial visual replacing the unrelated beach image.
- A consistent visual family for all ten existing informal-vendor categories.
- Search no-results, GPS unavailable/denied, no nearby vendors and empty heatmap states.
- About/Indore heritage visuals using verified source material or clearly illustrative art.
- Brand-support graphics, favicon and social-sharing artwork.
- Small decorative textures only where they improve hierarchy.
- Admin empty states or onboarding illustrations only where they clarify a workflow.

Do not force imagery into every card. Prefer Lucide or authored SVG for functional icons, editable SVG for the wordmark, CSS for simple decoration, and authentic consented photography where it exists.

### D4. Model and API guardrails

Use the current model names and API instructions in the installed skill and current official Gemini documentation at implementation time. Do not copy model IDs from old tutorials.

The current Gemini image-generation guide recommends Nano Banana-family models for image creation/editing; the skill currently lists Nano Banana 2.1 for efficient generation/editing, Nano Banana Pro for higher-quality production and Nano Banana 2 Lite for faster lower-cost work. Confirm model availability, pricing, rate limits and SDK support in the account before use.

Do not start new work on deprecated Imagen endpoints or old Gemini SDK packages. Use the current official TypeScript SDK (`@google/genai`) or Python SDK (`google-genai`) as appropriate, and follow the skill's migration guidance.

Security and cost:
- API key stays server-side or in a local generation script.
- Never put Gemini API key in Vite `VITE_*` variables or browser bundles.
- Add `.env` to `.gitignore`.
- Use environment variables/secret manager.
- Set usage budgets/quotas and monitor spend.
- Cache/store approved outputs; do not regenerate on every page view.
- Do not send vendor phone numbers, private admin records or precise sensitive vendor data to Gemini.
- Use explicit user approval before generating large batches or incurring material costs.

### D5. Should GaliGuide have Gemini features at runtime?

Not for V2 launch by default.

Possible later experiments, only if user value is demonstrated:

1. **Search query assistance:** help map colloquial queries to existing category/search terms. Keep deterministic search as fallback.
2. **Admin data-quality assistant:** flag missing landmarks, incomplete hours or likely duplicate records for human review. Never auto-verify or auto-publish.
3. **Vendor description helper:** draft descriptions from admin-provided facts, with human approval and no invented claims.
4. **Multilingual copy assistance:** help administrators prepare Hindi/English descriptions, with human review.

Do not add an AI chatbot to the public landing page just for novelty. Do not use AI to make up vendor data, availability, distance, verification or directions.

If an AI feature is later approved:
- Implement behind a server-side service boundary.
- Add authentication/authorisation where relevant.
- Validate inputs and structured outputs.
- Add timeouts, rate limits, cost controls and usage logging.
- Provide graceful fallback.
- Add tests for hallucinated/invalid output.
- Make human approval mandatory for changes to vendor records.

---

## 6. Workstream E — Asset library and content quality

Create a managed asset library under the frontend, for example:

```text
client/public/assets/
  brand/
  hero/
  categories/
  empty-states/
  about/
  admin/
```

Keep editable source assets separately where appropriate:

```text
design/
  brand/
  references/
  generated/
  approved/
```

Each final asset should have:
- Clear filename.
- Intended placement.
- Alt text.
- Dimensions/aspect ratio.
- Source or generation method.
- Licence/consent status.
- Optimised format and size.

Prefer WebP/AVIF for photographic assets, SVG for icons/marks/diagrams, and CSS for simple decoration. Avoid large unoptimised background images.

No generated map tiles, fake map screenshots or AI-rendered text-based UI should be used in the real product. The actual map must remain Leaflet/OSM.

---

## 7. Workstream F — Quality, performance, accessibility and SEO

### F1. Responsive acceptance

Test at minimum:
- 360px mobile.
- 390px mobile.
- 430px mobile.
- 768px tablet.
- 1024px small desktop.
- 1440px desktop.

Acceptance:
- No horizontal page overflow.
- No clipped Hindi text.
- Touch targets at least 44 × 44 CSS pixels where practical.
- Safe-area handling for bottom navigation/sheets.
- Keyboard-aware forms.
- No map controls obscured by the bottom sheet.
- Search remains usable with mobile keyboard open.
- No accidental scroll/gesture conflicts.

### F2. Accessibility

- Semantic headings and landmarks.
- Keyboard navigation.
- Visible focus indicators.
- Proper accessible labels for icon-only buttons.
- Sufficient colour contrast.
- Do not rely on colour alone for status.
- Screen-reader announcements for search results/loading/error states.
- Reduced-motion support.
- Correct Hindi language metadata where content is Hindi.
- Accessible map alternatives: vendor list must remain fully usable without map interaction.

### F3. Performance

Measure before and after changes.

- Code-split admin and non-critical views.
- Lazy-load below-the-fold imagery.
- Use responsive image sizes.
- Optimise fonts and avoid unnecessary weights.
- Avoid repeated API calls and unnecessary component re-renders.
- Keep map marker rendering efficient.
- Review Leaflet/heatmap/cluster lifecycle cleanup.
- Add loading skeletons only where useful.
- Cache public read-only data with explicit freshness/invalidation rules.
- Track Core Web Vitals in real deployments if practical.

Do not add a heavy UI library solely for a few components.

### F4. SEO and sharing

- Unique page title and description.
- Correct canonical URL.
- Open Graph/social sharing metadata.
- Descriptive page headings.
- Favicon and brand assets.
- Robots/sitemap where appropriate.
- Public vendor pages only if routing, privacy and indexability are deliberately designed.
- Avoid indexing admin routes or private data.

### F5. Observability

- Keep request IDs.
- Log structured server errors without sensitive data.
- Track API latency and status codes.
- Monitor Neon database/query performance.
- Monitor Vercel function errors and execution duration.
- Track frontend errors.
- Do not log raw phone numbers, JWTs or API keys.
- Provide a health endpoint that checks application health without exposing secrets.

---

## 8. Proposed frontend component organisation

This is a target direction, not a requirement to move every existing file. Inspect the real source tree and reuse components before creating duplicates.

```text
client/src/
  components/
    layout/
      AppShell.tsx
      DesktopHeader.tsx
      MobileNavigation.tsx
      PageContainer.tsx

    discovery/
      SearchBar.tsx
      LocationSelector.tsx
      CategoryFilter.tsx
      VendorCard.tsx
      VendorList.tsx
      MapToolbar.tsx
      MapView.tsx
      MobileMapSheet.tsx

    vendor/
      VendorProfile.tsx
      VendorStatus.tsx
      LandmarkGuidance.tsx
      OperatingHours.tsx
      VendorActions.tsx

    admin/
      AdminLayout.tsx
      AdminSidebar.tsx
      AdminDashboard.tsx
      VendorRegistry.tsx
      VendorForm.tsx
      CoordinatePicker.tsx

    shared/
      Button.tsx
      Badge.tsx
      Input.tsx
      EmptyState.tsx
      LoadingState.tsx
      ConfirmDialog.tsx

  styles/
    tokens.css
    globals.css
    map.css
```

Do not refactor the entire application merely to match this tree. Prioritise clean boundaries and reuse.

---

## 9. Phased execution roadmap

Implement in small, reviewable phases. Each phase must build, run and pass its acceptance checks before the next phase begins.

### Phase 0 — Repository reconnaissance and safety baseline

- Inspect current branch, git status and uncommitted work.
- Inspect all existing frontend/backend files.
- Inspect package scripts and dependency versions.
- Inspect Prisma schema and migration history.
- Inspect environment variable names without printing secret values.
- Run frontend build, backend build, unit tests and current acceptance tests.
- Capture current screenshots and baseline performance.
- Verify current production deployment and Neon backup/branch strategy.
- Produce a file-level implementation plan before editing.

**Gate:** No implementation until baseline and actual source code have been inspected.

### Phase 1 — P0 backend correctness and data integrity

- Fix timezone-aware operating-hours evaluation.
- Add previous-day overnight shift handling.
- Change `AuditLog.vendor` to `onDelete: SetNull`; retain physical vendor deletion for PAC-08 and write a final DELETE snapshot.
- Clean legacy stall-type prefixes in the database, serializer and seed logic.
- Add a Prisma serverless singleton and verify Vercel proxy trust/rate-limit behaviour.
- Review public visibility rules for deleted/rejected/suspended vendors.
- Add unit and integration tests.
- Create and test migrations on a disposable database/Neon branch.

**Gate:** All new tests pass; no existing API contract breaks.

### Phase 2 — Design system and responsive shell

- Implement brand tokens.
- Load and verify typography.
- Build shared components.
- Build responsive app shell and navigation.
- Verify contrast, keyboard focus and mobile safe areas.

**Gate:** All pages can use the same design tokens without old theme leakage.

### Phase 3 — Landing page and category discovery

- Redesign Explore page.
- Rebuild search presentation.
- Rebuild category directory.
- Generate, review, optimise and integrate approved hero, category, empty-state and brand-support assets using the `gemini-api-dev` workflow.
- Verify API-driven counts and GPS fallback.

**Gate:** Search and navigation work on mobile and desktop.

### Phase 4 — Discovery map and mobile bottom sheet

- Redesign desktop split layout.
- Implement mobile map-first layout.
- Implement draggable bottom sheet.
- Synchronise map/list selection.
- Redesign markers, controls and heatmap legend; preserve `.marker-cluster-custom`, spiderfication and the required heatmap gradient.
- Test cluster spiderfication and touch gestures.

**Gate:** Existing map features still work; no map interaction regression.

### Phase 5 — Vendor profile and details

- Redesign vendor cards and detail profile.
- Preserve privacy and approximate-location messaging.
- Improve schedule display and directions.
- Test all vendor states.

**Gate:** No private phone data is exposed; schedule status is correct.

### Phase 6 — Admin portal

- Build dedicated admin layout.
- Redesign metrics, registry and onboarding.
- Improve coordinate picker presentation.
- Review all permissions and destructive actions.
- Preserve audit logging.

**Gate:** All admin endpoints remain protected and workflows pass regression tests.

### Phase 7 — Search, performance and infrastructure refinement

- Add indexes only where query plans justify them.
- Review pagination and search.
- Optimise image/font/bundle loading.
- Add monitoring and structured error handling.
- Review Vercel and Neon configuration.
- Verify CI runs migrations/tests/builds safely.

**Gate:** Measured performance improves or remains within agreed budgets.

### Phase 8 — Final QA and release

- Run complete backend tests.
- Run complete frontend tests.
- Run acceptance and edge-case suite.
- Test supported viewport matrix.
- Test English and Hindi.
- Test GPS denied and unavailable.
- Test admin permissions.
- Test production build.
- Verify migrations and rollback plan.
- Deploy to preview first.
- Review screenshots and walkthrough.
- Obtain approval before production release.

**Gate:** No P0/P1 defects, no privacy/security regressions, all agreed acceptance criteria pass.

---

## 10. Test and acceptance matrix

| Area | Required acceptance |
|---|---|
| Landing | Search is immediately discoverable on mobile |
| Search | English and Hindi matching still works |
| Filters | Category/locality changes do not show stale results |
| GPS | Denied/timed-out GPS falls back safely |
| Map | OSM, clusters, spiderfication and heatmap work |
| Map/list | Selecting a vendor synchronises both views |
| Mobile sheet | Collapsed/half/expanded states work without gesture conflicts |
| Vendor profile | All existing profile information remains available |
| Phone privacy | Unconsented phone is null in public API |
| Approximate location | Warning and landmark guidance remain visible |
| Operating hours | IST and previous-day overnight shifts are correct |
| Admin | Unauthenticated requests receive 401 |
| Admin roles | Role restrictions apply on every protected route |
| Audit | Vendor deletion does not erase audit history |
| Database | Migrations preserve existing data |
| Performance | No major regression in bundle, API or map performance |
| Accessibility | Keyboard, contrast, labels and reduced-motion checks pass |
| Deployment | Preview build and production build succeed |

Keep the existing audit test IDs where they remain valid. Add new tests rather than deleting or weakening old checks.

### Audit-alignment regression checks

In addition to the general matrix above, explicitly verify:

- PAC-08 still completes physical vendor deletion and the deleted vendor is absent from public list/detail endpoints.
- Prior `AuditLog` rows survive vendor deletion with `vendorId = NULL`; the final DELETE audit row contains a vendor snapshot.
- `OperatingHour` rows still cascade-delete as expected.
- `id="btn-get-directions"` and `id="btn-call-vendor"` remain present after component refactoring.
- `.marker-cluster-custom` remains present and cluster spiderfication works.
- No description begins with a raw `[Stall Type: ...]` prefix in API responses or the UI.
- Stall enums display Thela, Gumti, Phad and Roaming Vendor labels consistently.
- Marigold surfaces never use white text/icons; contrast is tested in default, hover, focus and disabled states.
- The Vercel rate limiter distinguishes client IPs and is not trivially bypassed by spoofed forwarded headers.
- CI succeeds with the selected Prisma schema/migration approach and any required PostgreSQL extensions.
- The heatmap uses the approved gradient and only returns eligible verified public vendor coordinates.
- The map tile filter, if retained, does not reduce road, label, attribution or marker legibility.


---

## 11. Release and operational safeguards

- Work on a dedicated feature branch.
- Commit in logical, reviewable units.
- Do not overwrite the working production branch.
- Do not edit production environment variables without approval.
- Never expose secret values in agent output.
- Use a Neon preview branch or disposable database for schema work.
- Review Vercel preview deployments before production.
- Keep a known-good deployment available for rollback.
- Maintain a release note of schema, API and UI changes.
- Verify public privacy behaviour after deployment.
- Verify the production domain and API health after release.

---

## 12. AI agent operating instructions for Antigravity

Use the supplied audit files and this plan as project context. The actual repository is authoritative when it differs from the audit; report discrepancies rather than silently assuming the audit is current.

### Mandatory agent behaviour

1. Read `plan1.md` and all relevant audit documents before implementation.
2. Inspect the current repository and identify actual files before proposing edits.
3. Separate verified facts, assumptions and proposed changes.
4. Do not claim tests passed unless they were run and the output was inspected.
5. Do not invent endpoints, schema fields, file paths or environment variables.
6. Do not rewrite the application or change frameworks.
7. Do not change backend contracts without documenting migration impact.
8. Do not create fake vendor data or synthetic real-vendor photographs.
9. Use `gemini-api-dev` only for actual Gemini API development and asset-generation scripts/workflows.
10. Treat asset generation as a real implementation workstream: inventory, generate candidates, review, optimise, document and integrate actual assets. Do not stop at prompt-writing.
11. Before generating large batches or incurring significant API costs, present the inventory and batch strategy for approval.
12. Before using a Gemini endpoint/model, read the current skill references and official API documentation.
13. Keep API keys server-side and out of browser bundles.
14. Ask before changing production data or deploying to production.
15. Work phase-by-phase and stop at each gate for review.
16. Produce screenshots/walkthroughs for the redesigned landing, mobile map, desktop map, vendor profile and admin portal.
17. At the end of each phase, report files changed, tests run, results, known issues and rollback considerations.

### First Antigravity task — planning only

Before editing code, ask the agent to:

- Read `plan1.md`.
- Read all five audit Markdown files.
- Inspect the current repository tree and git status.
- Verify the actual Prisma schema, migrations, API routes, frontend components and test scripts.
- Confirm the `AuditLog.vendorId` nullability, `onDelete` behaviour, `OperatingHour` cascade and PAC-08 expectations.
- Confirm the actual Vercel proxy path before setting Express `trust proxy`.
- Inspect the live seeded descriptions and seed script for `[Stall Type: ...]` leakage.
- Locate and record the required DOM selectors before refactoring.
- Inspect `.github/workflows/ci.yml` and its current `prisma db push` behaviour.
- Compare actual code with audit claims.
- Identify contradictions, stale audit details and risks.
- Produce a file-level implementation plan for Phase 0 and Phase 1.
- Make no code changes until the plan is reviewed.

---

## 13. Definition of done

GaliGuide V2 is complete when:

- The new Contemporary Street Culture identity is consistently implemented.
- The application is genuinely mobile-first.
- Landing, discovery map, vendor profile and admin portal have been redesigned.
- Existing features and API contracts are preserved or migrated safely.
- IST/overnight schedule behaviour is correct.
- Audit history survives normal vendor deletion.
- Search and database performance have been measured.
- All privacy, security and admin permissions remain intact.
- Approved assets are optimised, documented and correctly licensed/consented.
- AI-generated assets are not misrepresented as real vendors.
- Responsive, accessibility and regression tests pass.
- Preview and production deployment checks pass.
- A final walkthrough and release report are available.

**Final product principle:** GaliGuide should feel like a thoughtfully designed, trustworthy local discovery platform — not a template, not an AI demo and not merely a map with pins. Its strongest differentiator is the people and informal services that ordinary digital maps often overlook.
