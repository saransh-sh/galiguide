# Project: GaliGuide Client Authentic Indori Copy Overhaul

## Architecture & Code Layout
- Frontend Client: `client/src/` (React + TypeScript + Vite + Tailwind CSS + Leaflet)
  - `client/src/components/ExploreView.tsx` — Hero headline, subhead, search console, category grid, civic value proposition, footer [UPDATED]
  - `client/src/components/AboutModal.tsx` — Modal headline, body copy, Sarafa/Chappan cultural descriptions, civic/ward collaboration, privacy reassurance [UPDATED]
  - `client/src/components/MapView.tsx` — Search bar, area selector, category pills ("All Categories"), empty state, vendor cards, details CTA [UPDATED]
  - `client/src/components/MobileMapSheet.tsx` — Mobile map bottom sheet vendor counter and empty state [UPDATED]
  - `client/src/components/BottomNavBar.tsx` — Mobile navigation tabs ("Categories" instead of "Guilds") [UPDATED]
  - `client/src/components/AdminPortal.tsx` — Municipal administration portal, category labels ("Vendor Category" instead of "Guild"), landmark placeholder prompts [UPDATED]
  - `client/src/components/vendor-detail/LandmarkCard.tsx` — Landmark guidance ("Street Landmark Guidance • ज़मीनी पहचान और रास्ता", "गली / इलाका", "चलता-फिरता ठेला") [UPDATED]
  - `client/src/components/vendor-detail/VendorActions.tsx` — Call, In-Person Only, Directions buttons [UPDATED]
  - `client/src/components/vendor-detail/VendorHeader.tsx` — Stall type helper, verification badge ("Verified Vendor • सत्यापित") [UPDATED]
  - `client/src/components/VendorDetailDrawer.tsx` — "About this Vendor & Stall • वेंडर परिचय", payment badge ("डिजिटल पेमेंट (UPI & Cash)") [UPDATED]
  - `client/src/components/CoordinatePicker.tsx` — Area jump and coordinate picker guidance [UPDATED]
  - `client/src/components/HeatmapLegend.tsx` — Density scale labels [UPDATED]
  - `client/index.html` — HTML title tag [UPDATED]
- Backend Data: `server/prisma/seed.ts` (10 vendor category descriptions updated with rich Indori cultural context; ASCII slugs untouched) [UPDATED]

## Feature Inventory
| # | Feature / Area | Description | Milestone | Source |
|---|----------------|-------------|-----------|--------|
| 1 | ExploreView Hero & Search | Replace AI buzzwords ("Hyperlocal Street Discovery", "Locate Vendors") with grounded Indori copy, authentic search placeholders, and curated trending pills (Joshi Flying Dahi Bada, Johny Hot Dog, Ramu Mochi). | M1 | Survey/Exp 1 & 3 |
| 2 | ExploreView Category Grid | Replace fantasy "Guilds" / "Micro-Artisans" with "Street Hawkers & Karigars • पटरी दुकानदार व कारीगर", "Explore Essential Street Trades", and "View Stalls • ठेले देखें". | M1 | Survey/Exp 1 & 2 |
| 3 | ExploreView Civic Value Block | Replace academic grant jargon ("Zero-Cost Civic Philosophy", "Topological Landmark Guidance", "API toll gates") with clear civic language ("Khuli Cartography • Zero Commission", "Desi Nishaniyon Se Asli Rasta", "Vendor Ki Sahmati Aur Suraksha"). | M1 | Survey/Exp 1 & 3 |
| 4 | AboutModal Cultural Overhaul | Ground Ahilya Nagari street identity, specify iconic delicacies (Joshi ji's flying dahi bada, jeeravan, roasted bhutte ka kis, winter garadu, Vijay Chaat khopra patties, Banarasi paan), and articulate Ward Lead verification & vendor privacy. | M1 | Survey/Exp 1, 2 & 3 |
| 5 | MapView & Navigation Feed | Replace "All Guilds" with "All Categories", provide warm bilingual empty state guiding users to Sarafa/Chappan/Rajwada, and update details CTA. | M1 | Survey/Exp 1, 2 & 3 |
| 6 | Landmark & Vendor Detail Views | Replace "Hyperlocal Topological Landmark Guidance" and "Street Corridor" with "Street Landmark Guidance • ज़मीनी पहचान और रास्ता", "गली / इलाका", and "चलता-फिरता ठेला • Roaming Handcart". | M1 | Survey/Exp 1, 2 & 3 |
| 7 | AdminPortal & Navigation Labels | Replace "Guilds" in BottomNavBar and AdminPortal with "Categories", update admin form landmark & description placeholders to reflect authentic street setups. | M1 | Survey/Exp 2 & 3 |
| 8 | Category Seed Descriptions | Update 10 category descriptions in `server/prisma/seed.ts` to enrich dynamically fetched category cards with authentic Indori trade markers while strictly keeping category slugs unchanged. | M1 | Survey/Exp 2 |
| 9 | Brand & Visual Preservation | Keep all Tailwind CSS tokens (`text-aubergine`, `text-marigold`, `bg-canvas`, `border-icesilver-300`, `font-display`, `font-body`) and DOM test selectors (`id`, `data-testid`) byte-for-byte identical. | M1 | Survey/Exp 1, 2 & 3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Complete Authentic Indori Street Copy Overhaul | All client JSX copy replacements across `ExploreView.tsx`, `AboutModal.tsx`, `MapView.tsx`, `MobileMapSheet.tsx`, `BottomNavBar.tsx`, `AdminPortal.tsx`, `vendor-detail/*.tsx`, `VendorDetailDrawer.tsx`, `CoordinatePicker.tsx`, `HeatmapLegend.tsx`, `index.html`, and `server/prisma/seed.ts` category descriptions. | None | DONE |

## Code Layout & Write Ownership
- Exclusive Write Ownership for Worker (Completed):
  - `client/src/components/ExploreView.tsx`
  - `client/src/components/AboutModal.tsx`
  - `client/src/components/MapView.tsx`
  - `client/src/components/MobileMapSheet.tsx`
  - `client/src/components/BottomNavBar.tsx`
  - `client/src/components/AdminPortal.tsx`
  - `client/src/components/VendorDetailDrawer.tsx`
  - `client/src/components/vendor-detail/LandmarkCard.tsx`
  - `client/src/components/vendor-detail/VendorActions.tsx`
  - `client/src/components/vendor-detail/VendorHeader.tsx`
  - `client/src/components/vendor-detail/OperatingScheduleTable.tsx`
  - `client/src/components/CoordinatePicker.tsx`
  - `client/src/components/HeatmapLegend.tsx`
  - `client/index.html`
  - `server/prisma/seed.ts` (category description strings only)
- STRICT READ-ONLY (DO NOT TOUCH):
  - `server/src/lib/haversine.ts` (unit tests assert on `formatDistance`)
  - `server/src/lib/operating-hours.ts` (unit tests assert on `statusText`)
  - `server/__tests__/**`
  - Category `slug` values (e.g. `street-food`, `cobbler`) across client and server
  - All DOM `id` and `data-testid` attributes
