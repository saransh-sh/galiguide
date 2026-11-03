# GaliGuide Context & Ubiquitous Language

GaliGuide is a hyperlocal, bilingual discovery and navigation platform purpose-built for the informal vendor economy of Indore, Madhya Pradesh. It maps street food stalls, chai walas, puncture thelas, cobblers, key makers, knife sharpeners, and roaming seasonal artisans who operate outside the formal retail registry and do not appear on standard commercial maps.

> **The Golden Rule:** GaliGuide requires **zero paid mapping API consumption**. All interactive cartography is powered by Leaflet and OpenStreetMap. Turn-by-turn routing is delegated entirely to user devices through direct universal Google Maps deep links.

---

## Domain Vocabulary

### Core Concepts

**Vendor**:  
An informal entrepreneur operating a fixed stall, pushcart, or roaming setup in Indore's street markets and residential mohallas.  
*Avoid*: Store, shop, merchant, retailer, outlet, establishment.

**Thela**:  
A traditional four-wheeled pushcart commonly used by street food vendors (e.g., poha-jalebi, hot dogs) and fruit/vegetable sellers.  
*Avoid*: Food truck, cart, vehicle, mobile van.

**Gumti**:  
A small, semi-permanent roadside cabin or wooden kiosk often used by pan walas, key makers, and repair services.  
*Avoid*: Storefront, kiosk, booth, shop.

**Phad**:  
A traditional ground-mat vendor configuration positioned on footpaths or market corners.  
*Avoid*: Pop-up shop, sidewalk stall.

**Roaming Vendor**:  
A mobile vendor with no permanent coordinate lock whose approximate operating zones and active hours are recorded. Marked with `isApproximateLoc: true`.  
*Avoid*: Itinerant merchant, wandering seller.

**Operating Schedule**:  
A structured 7-day schedule defining `dayOfWeek` (0–6), `openTime` (HH:mm), `closeTime` (HH:mm), and `isClosed` status.  
*Avoid*: Business hours, store hours, opening times.

**Landmark Guidance**:  
Informal street directions based on recognizable physical and cultural landmarks (e.g. "Behind 56 Dukan fountain, near electrical pole #4").  
*Avoid*: Street address, postal address.

**Universal Navigation Link**:  
A standard, zero-cost web deep link formatting: `https://www.google.com/maps/dir/?api=1&destination=lat,lng` that natively launches turn-by-turn routing on the participant's device.  
*Avoid*: Google Directions API, Route calculation.

**Phone Masking**:  
Privacy-protecting redaction applied when a vendor has not consented to public phone distribution (`hasConsentForPhone = false`), displaying `+91 98XXX-XX123` to public explorers.  
*Avoid*: Redacted number, hidden contact.

---

### Roles & Surfaces

**Public Explorer**:  
Any resident, tourist, or foodie in Indore browsing street vendors, checking operating hours, or launching directions without needing authentication.  
*Avoid*: User, customer, shopper, buyer.

**Ward Lead (Admin)**:  
A verified municipal ward supervisor or designated field coordinator holding `ADMIN` privileges who audits, approves, updates, or registers informal vendors.  
*Avoid*: Store manager, moderator, agent.

**Super Admin**:  
A privileged system administrator managing Ward Lead accounts, global categories, and system-wide configurations.  
*Avoid*: Root, owner, master.

**Live Map View**:  
The primary full-screen interactive Leaflet map rendering OpenStreetMap tiles, MarkerCluster groupings, and heatmap overlays.  
*Avoid*: Google Map, Google View.

**Discovery Cards**:  
The responsive grid/list view displaying vendor profiles, distances, Hindi/English names, open status badges, and action buttons.  
*Avoid*: Product catalog, merchant listings.

**Admin Verification Portal**:  
The password-protected administrative surface (`/admin`) where ward leads log in to create, edit, verify, or archive vendor records.  
*Avoid*: Backoffice, CMS, dashboard.
