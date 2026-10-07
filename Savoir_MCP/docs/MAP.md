# Property map

**Status:** built and tested locally in simulated hosts. **Not deployed.** The map is off unless `MAP_TILE_URL` is set.

## 1. What the CMS provides (checked 7 October 2026)

| Source | Field | Finding |
|---|---|---|
| Ready listings: search API | none | No coordinates at all |
| Ready listings: `/api/property/{slug}` | `lat`, `lng` | Present but **empty (`null`) on 30 of 30 sampled listings** |
| Off-plan: `/api/offplan-projects/{slug}` | `map_link` | A Google Maps **embed** for 46 of 46 projects. It stores the centre and width of the map **view** (`!1d<width m>!2d<lng>!3d<lat>`), **with no place pin**. Widths: 21 projects 225–962 m, 18 projects 1.7–5 km, 7 projects 14–116 km (city-wide) |

**Conclusion:** the CMS has no verified building positions. The map therefore uses **area-level** positions, and **approximate** ones for off-plan projects, and labels both.

## 2. How pins are placed

| Listing | Pin | Label shown |
|---|---|---|
| Ready listing | Centre of its **community** (CMS `community`) | "Area: Dubai Marina (exact building not shown)" + an area ring |
| Off-plan, developer map agrees with its listed area | Centre of the developer's map view (tight views ≤ 6 km wide only) | "Approximate location (from the developer's map)" + a ring |
| Off-plan, developer map **contradicts** its area | Area centre | As for ready listings |
| Area not verifiable | **Not placed** | "Location not verified (not on the map)" in the area list and on the card |

Sub-communities are not used, because many are building names; using them would imply building positions.

Area centres come from **OpenStreetMap contributors (ODbL)**. They were geocoded once through Nominatim at about 1 request per second, with an identified user agent, and are stored in `src/data/areaPoints.ts` with their OSM ids.

- **Accepted:** only area features (place, administrative boundary, or residential, commercial or retail land use) at least 0.5 km across, inside Dubai.
- **Rejected:** point features such as metro stations, restaurants, single buildings and sales offices.
- **Status:** pending Savoir review.

### Coverage (live data, 7 October 2026)
- **Ready listings:** 235 of 242 placed. Damac Lagoons (4) and Al Furjan (3) have no verifiable area.
- **Off-plan projects:** 37 of 46 placed.
  - 31 developer maps agree with the listed area.
  - 2 conflicts are placed at the area centre.
  - 4 are area only.
  - 9 are unverifiable and not placed.

### Data issues for Savoir to fix in the CMS
- **The developer map contradicts the listed area:**
  - `the-heights-country-club-wellness`: about 10 km from Dubai South;
  - `ocean-pearl`: about 14 km from Business Bay.
- **Locations that can't be verified:**
  - the 3 Sobha Sanctuary projects;
  - `the-archive-by-imtiaz` (DLRC);
  - `riwa-madinat-jumeirah-living`;
  - `nikki-beach-residences`;
  - `palm-jabel-ali-villas-dubai`;
  - `cassia-villas` (The Wilds).
- **Best long-term fix:** fill the existing `lat`/`lng` fields with verified building or project coordinates. The app can then show them as exact positions and label them that way.

## 3. Behaviour
- **List / Map** toggle on result screens. It only appears when the map is configured and some results can be placed.
- **Pins:**
  - AED price pins ("AED 2.25M"; off-plan pins read "from 666K");
  - pins closer than about 56 px group into a cluster;
  - a cluster zooms in when clicked, or lists the listings when they share one area centre.
- **Selected listing:** a pin, a card's **Show on map**, or a row in **Listings by area** selects the listing. It's highlighted on the map and in the cards, and a panel shows the photo, price, key facts, location precision, **Details** and **WhatsApp**.
- **Fit and movement:**
  - the map fits the current results;
  - moving or zooming it **never** changes or re-runs the search;
  - scroll-wheel zoom only turns on after the customer clicks the map.
- **Phones:** **Map** opens full screen (`window.openai.requestDisplayMode` / MCP Apps `requestDisplayMode`), with **Back to listings**. The card also declares `openai/ui.availableDisplayModes: ["inline","fullscreen"]`.
- **Fallback:** if Leaflet or the tiles can't load (for example a blocked provider or a bad key), the card says so and opens **Listings by area**, a keyboard-accessible list. The cards stay available.
- **Display:** Arabic (RTL) and dark mode supported; tiles are dimmed slightly in dark mode.

## 4. Map provider and costs (approve before production)

Tiles are loaded as images, so the card needs only `resourceDomains` for the tile host and no `connectDomains`. Leaflet 1.9.4 (BSD-2-Clause) is **inlined** in the card; no external script is loaded.

| Provider | Commercial use | Cost (checked 7 Oct 2026) | Notes |
|---|---|---|---|
| OpenStreetMap Foundation tiles (`tile.openstreetmap.org`) | **No.** The usage policy rules out commercial production sites, and access can be withdrawn | Free | **Used only for local testing** |
| MapTiler Cloud | Paid plans only | Flex **$25/month** (25,000 sessions, 500,000 requests) | English/Arabic labels; logo on the free plan |
| Stadia Maps | Paid plans only | Starter **$20/month** (1,000,000 credits) | 14-day trial |
| Mapbox | Yes, card required | 50,000 web map loads/month free (GL JS); **raster tiles 200,000/month free, then about $1 per 1,000** | Pricing depends on the API used |

Sources: maptiler.com/cloud/pricing, stadiamaps.com/faqs, mapbox.com/pricing, operations.osmfoundation.org/policies/tiles.

Prices change, so confirm them on the provider site before signing up. Any public key goes in `MAP_TILE_URL` and is visible to users. Restrict it to tile requests in the provider's dashboard.

## 5. Configuration

| Variable | Example | Effect |
|---|---|---|
| `MAP_TILE_URL` | `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=PUBLIC_KEY` | Turns the map on. Must be https and contain `{z}`, `{x}`, `{y}` |
| `MAP_TILE_ATTRIBUTION` | `© MapTiler © OpenStreetMap contributors` | Shown on the map (required by providers) |
| `MAP_TILE_SUBDOMAINS` | `a,b,c` | Only if the URL uses `{s}` |
| `MAP_MAX_ZOOM` | `18` | |

The tile host is added automatically to the card's `resourceDomains`. After changing it, refresh the app in ChatGPT so the new security policy is fetched.

## 6. Tests
- **Unit tests (`test/map.test.ts`):**
  - area data stays inside Dubai and keeps its sources;
  - area matching;
  - developer map views (tight only, inside Dubai);
  - the agreement, conflict and unverifiable rules;
  - configuration and the security-policy entries;
  - Leaflet is inlined only when the map is on.
- **Simulated host, scenario K in `scripts/preview-widget.ts`:**
  - the toggle, tiles under the declared security policy, pins and clusters, the legend, fit-to-results;
  - **no tool call when the map moves or zooms**;
  - selection both ways (pin ↔ card ↔ panel), Details and Back;
  - phone full screen and Back to listings;
  - blocked tiles leading to the fallback list, Arabic, and off-plan results.
- **Not yet tested in ChatGPT itself.**
