---
name: GaliGuide
colors:
  surface: '#f5fbf3'
  surface-dim: '#d6dcd4'
  surface-bright: '#f5fbf3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5ee'
  surface-container: '#eaefe8'
  surface-container-high: '#e4eae2'
  surface-container-highest: '#dee4dd'
  on-surface: '#171d19'
  on-surface-variant: '#56423c'
  inverse-surface: '#2c322d'
  inverse-on-surface: '#edf2eb'
  outline: '#8a726a'
  outline-variant: '#ddc0b8'
  surface-tint: '#a0401e'
  primary: '#9d3e1c'
  on-primary: '#ffffff'
  primary-container: '#bd5632'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59d'
  secondary: '#3d6659'
  on-secondary: '#ffffff'
  secondary-container: '#bce9d9'
  on-secondary-container: '#416b5d'
  tertiary: '#755700'
  on-tertiary: '#ffffff'
  tertiary-container: '#946f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#802a07'
  secondary-fixed: '#bfecdc'
  secondary-fixed-dim: '#a3d0c0'
  on-secondary-fixed: '#002018'
  on-secondary-fixed-variant: '#244e42'
  tertiary-fixed: '#ffdf9e'
  tertiary-fixed-dim: '#efc055'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#f5fbf3'
  on-background: '#171d19'
  surface-variant: '#dee4dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system captures the sensory dynamism of Indian neighborhood streets (*galis*) through an elevated, contemporary editorial lens. It rejects sterile utilitarian maps in favor of warm, humanized urban cartography. The aesthetic bridges the raw vibrancy of informal trade—chai stalls, roadside tailors, sabzi mandis, and cobblers—with the considered curation of a luxury lifestyle field guide.

Key aesthetic drivers:
- **Warm Editorial Cartography:** Rich tactile surfaces, structured serif typography, and textured paper undertones replace cold blue-tinted GPS aesthetics.
- **Informal Grounding:** Purposeful use of deep forest green and sunbaked terracotta anchors ephemeral vendor locations with permanence, dignity, and geographic clarity.
- **Crafted Precision:** UI interactions balance soft, tactile card surfaces with crisp hairline borders that echo vintage transit charts and architectural field notebooks.
- **Emotional Intent:** Evokes the warmth of community trust, nostalgic discovery, and everyday urban street resilience.

## Colors

The palette is tuned around natural earthy dyes, sun-bleached masonry, and leafy canopy cover:

- **Primary (`#D96B45` - Terracotta):** Represents clay kulhads, brick alleyways, and energetic street presence. Reserved for key actions, route triggers, interactive markers, and primary buttons.
- **Secondary (`#244E42` - Deep Canopy Forest):** Grounds high-level navigation, map filters, structural headers, and verified vendor seals. Conveys longevity, orientation, and calm amidst market bustle.
- **Tertiary (`#E7B94F` - Mustard Marigold):** Applied to active status markers, informal hotspots, quick tags (e.g., "Cash Only", "Morning Batch"), and promotional callouts.
- **Neutral Dark (`#343A35` - Street Charcoal):** Deep charcoal with a subtle warm-olive cast, avoiding cold pitch blacks for body typography and high-emphasis labels.
- **Surfaces & Canvases:**
  - Base canvas: `#F5EBD9` (Sunbaked Warm Cream).
  - Elevated surfaces & modal sheets: `#FFFCF6` (Parchment White).
  - Hairlines, separators, and muted borders: `#E2D3B8` (Raw Jute).
  - Secondary metadata & distance markers: `#7D8F7B` (Muted Olive Neutral).

## Typography

The type system blends literary editorial gravitas with effortless micro-legibility:

- **Headlines & Vendor Names (`Playfair Display`):** Elevates local micro-entrepreneurs into storied destinations. It brings graceful, high-contrast serif terminals to vendor listings, neighborhood collection titles, and historical zone notes.
- **Interface & Operational Data (`Plus Jakarta Sans`):** Provides geometric clarity with gentle, friendly apertures. It remains legible on mobile screens under direct sunlight during outdoor street navigation.
- **Hierarchy Rules:**
  - Vendor names on cards use `headline-sm` or `headline-md`.
  - Micro-timings, operational windows ("4:00 PM – 9:30 PM"), and landmark bearings use `label-md` or `body-sm`.
  - Badge descriptors and category markers use `label-sm` in uppercase with subtle tracking.

## Layout & Spacing

A fluid responsive system tailored for mobile-first handheld street exploration:

- **Mobile Viewport (< 768px):** Single-column layout with fixed 16px (`1rem`) outer margins. Bottom navigation sheets and horizontal swipe carousels utilize bleed edges while retaining 16px internal padding.
- **Tablet & Desktop (≥ 768px):** Shifts to an asymmetric 12-column split-view architecture:
  - Left column (4–5 columns): Sticky curated list, neighborhood dossiers, and search controls.
  - Right column (7–8 columns): Interactive cartographic canvas with persistent hotspot callouts.
- **Vertical Rhythm:**
  - Form field rows and badge clusters utilize `space-sm` (8px).
  - Vendor cards, detail metadata, and map overlay banners use `space-md` (16px) internal padding.
  - Distinct market sections, vendor clusters, and category carousels maintain `space-xl` (40px) separations.

## Elevation & Depth

Visual hierarchy rejects harsh digital drop shadows in favor of tinted, ambient surface layering derived from daylight and linen textures:

- **Surface Tiers:**
  - **Base Canvas:** `#F5EBD9` represents ground plane/pavement.
  - **Level 1 (Vendor Cards & Panels):** Raised on `#FFFCF6` with a delicate 1px border of `#E2D3B8` and a warm diffused ambient shadow: `0 4px 20px -2px rgba(52, 58, 53, 0.06)`.
  - **Level 2 (Floating Action Buttons & Bottom Sheets):** `#FFFCF6` backed by a deeper warm cast: `0 8px 30px -4px rgba(36, 78, 66, 0.12)`, bordered by `#E2D3B8`.
  - **Level 3 (Map Pins & Active Selection Overlays):** `#D96B45` or `#244E42` featuring a sharp contrast outline (`2px solid #FFFCF6`) and elevated lift: `0 6px 16px rgba(217, 107, 69, 0.35)`.
- **Cartographic Depth:** Map land parcels use subtle earth tones while alleys (*galis*) are rendered with warm cream strokes; active market clusters illuminate with a translucent wash of Mustard Yellow (`rgba(231, 185, 79, 0.18)`).

## Shapes

The geometric personality features rounded corners (`0.5rem` / 8px baseline) that evoke smooth river pebbles, clay stamps, and handmade paper chits:

- **Base Cards & Modals:** Standard curvature of `0.5rem` (`rounded`) scaled to `1rem` (`rounded-lg`) on floating cards and modal bottom sheets.
- **Status Pills & Micro Badges:** Full pill-shaped rounding (`9999px`) for category pills, operating status indicators, and street landmark badges to ensure clean visual separation from boxy layout elements.
- **Map Hotspot Pins:** Teardrop circular geometries with bottom anchor points, ringed with crisp cream borders.

## Components

### Buttons & Interactive Controls
- **Primary CTA ("Find on Gali Map", "Navigate"):** Solid `#D96B45` background, `#FFFCF6` text, `0.5rem` border-radius. Active state transitions slightly darker (`#C05834`) with a subtle scale compression (`0.98`).
- **Secondary Action ("Filter Categories", "Save Spot"):** Transparent fill with a 1.5px solid border in `#244E42`, `#244E42` text, and soft `#244E42` 5% opacity wash on hover/tap.
- **Tertiary / Quick Action:** Soft `#F5EBD9` background with `#343A35` text and 1px `#E2D3B8` border.

### Category & Status Chips
- **Trade Category Badges (e.g., *Chai Stalls*, *Cycle Repairs*, *Cobblers*, *Tailors*):** Pill-shaped, using `#FFFCF6` fill, `#343A35` label, and `#E2D3B8` hairline border. When selected, fills with `#244E42` and `#FFFCF6` text.
- **Operational Availability Badges:**
  - *Active Now:* Pill badge with `#E7B94F` background at 20% opacity, dark `#7A5B0B` text, and a pulsating 6px dot in solid `#E7B94F`.
  - *Seasonal / Morning Only:* Pill badge with `#7D8F7B` at 15% opacity, `#244E42` text.

### Cards
- **Vendor Discovery Card:** Constructed on `#FFFCF6` surface with `1rem` radius. Features a distinct top media container (curated photography or craft emblem), vendor name in `Playfair Display`, proximity tag ("Opposite Chhappan Dukan, 40m away"), and landmark breadcrumbs.
- **Mini Map Drawer Card:** Compact horizontal layout featuring a 48x48 rounded thumbnail, live walking time, and quick direct routing CTA.

### Form Inputs & Search Fields
- **Search Bar:** Elevated `#FFFCF6` capsule with `1.5rem` rounding, carrying a subtle `#E2D3B8` border and search icon in `#7D8F7B`. Placeholder text in warm `#7D8F7B` ("Search for cobbler, kachori, master tailor...").
- **Radio Buttons & Checkboxes:** Custom rounded checks using `#244E42` fill when selected, rimmed by `#E2D3B8` when unselected.

### Domain-Specific Components
- **Landmark Directional Banner:** Editorial parchment strip highlighted with a terracotta directional arrow, translating GPS coordinates into intuitive hyper-local directions (e.g., *"Take the lane beside the Banyan Tree, 3rd cart on left"*).
- **Vendor Authenticity Seal:** A circular stamp badge evoking Indian postal or trade seals, stamped in `#244E42` or `#D96B45` signifying neighborhood verification.