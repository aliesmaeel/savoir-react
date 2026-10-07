# Property map

**Status:** built and tested locally in simulated hosts. **Not deployed, and no provider billing is enabled.** The map is off unless `MAP_TILE_URL` is set.

## 1. What the CMS provides (checked 7 October 2026)

| Source | Field | Finding |
|---|---|---|
| Ready listings: search API | none | No coordinates |
| Ready listings: `/api/property/{slug}` | `lat`, `lng` | Present but **empty on 30 of 30 sampled listings** |
| Off-plan: `/api/offplan-projects/{slug}` | `map_link` | A Google Maps embed for 46 of 46 projects. It stores the centre and width of the map **view** (`!1d<width m>!2d<lng>!3d<lat>`), with **no place pin** |

The CMS has no verified building positions. **Every listing on the map is therefore shown at area level only.**

## 2. Placement: area groups, never building pins
- **Grouping:** listings are grouped by community into **one marker per area**, for example "JVC · 3 homes". A dashed ring shows the area. There are no per-listing pins.
- **Merging:** areas whose labels would overlap at the current zoom merge into "N areas · M homes"; tapping one zooms in.
- **Selecting an area** shows its price range on the marker ("AED 900K – 1.3M") and a compact preview docked on the map: "Approximate area", the area name and count, the range, and the homes in it.
- **Selecting a home** shows a compact property preview (photo, price, key facts, "Area: … (exact building not shown)", Details, WhatsApp). Its card is highlighted, and other cards in the same area are outlined.
- **Labels:** "Approximate areas · not exact buildings" stays on the map. The list fallback is titled "Listings by area (approximate areas)".
- **Counts** separate this page from the whole search: "This page: 11 of 12 homes on the map · 61 results in total".
- **No search on movement:** moving or zooming the map never changes or re-runs the search.
- **Off-plan projects** are also shown at area level. Their developer map only checks the listed area: when it contradicts the area, the project is reported for a CMS fix; when the area can't be verified, the project is not placed.

Area centres come from **OpenStreetMap contributors (ODbL)**, geocoded once through Nominatim, and are stored with their OSM ids in `src/data/areaPoints.ts`. Only area features were accepted, and the list is **pending Savoir review**.

### Coverage (live data, 7 October 2026)
- **Ready listings:** 235 of 242. Not placed: Damac Lagoons (4) and Al Furjan (3).
- **Off-plan projects:** 37 of 46.

### For Savoir to fix in the CMS
- **Developer map contradicts the listed area:** `the-heights-country-club-wellness` and `ocean-pearl`.
- **Area can't be verified:**
  - the 3 Sobha Sanctuary projects;
  - The Archive (DLRC);
  - Riwa;
  - Nikki Beach Residences;
  - Palm Jebel Ali Villas;
  - Cassia Villas.
- **Best fix:** fill the existing `lat`/`lng` fields with verified coordinates.

## 3. Which map API this uses
- **Leaflet 1.9.4** (BSD-2-Clause), inlined in the card. It loads no external scripts.
- **Raster XYZ tiles, one 256 px image per tile request.** This is billed **per tile request**, not per map load or session.
  - Panning and zooming loads more tiles.
  - A typical first view of a 1180 × 420 map uses about 18 tiles.
- **Security policy:** tiles are images, so the card only needs the tile host in `resourceDomains`. No `connectDomains`, workers or WebGL.
- **Basemap:** the previews use **Stadia "Alidade Smooth"**, a minimal, soft basemap. It's for **local testing only**; Stadia allows keyless requests from localhost.

## 4. Providers (official pricing pages, checked 7 October 2026)

| Provider and API | Commercial use free? | Free allowance | After that | Works in ChatGPT? |
|---|---|---|---|---|
| **ArcGIS Location Platform**: Static Basemap Tiles (raster; light grey style) | **Yes.** The platform includes a commercial deployment licence | **2,000,000 basemap tiles a month** | **$0.15 per 1,000 tiles**, pay-as-you-go | Yes: raster tiles plus an access token in the URL. Requires "Powered by Esri" attribution |
| **Mapbox**: Static Tiles API (styled raster from a Studio style, e.g. Light) | Pay-as-you-go free tier; a card is required. Mapbox mentions a commercial licence for some uses, so **check the terms with Mapbox** | **200,000 tile requests a month** | **$0.50 per 1,000** | Yes: raster plus a public token |
| Mapbox: Raster Tiles API (raster *tilesets*, e.g. satellite, not styled maps) | As above | 750,000 a month | $0.25 per 1,000 | Not the right API for a styled minimal map |
| Mapbox: map loads (GL JS) | | 50,000 loads a month | $5.00 per 1,000 | **Not used.** That's Mapbox's own map library, not tiles |
| **Stadia Maps** (Alidade Smooth) | **No** on Free | Free: 200,000 credits (non-commercial) | Starter **$20/month**: 1,000,000 credits, 1 credit per tile; then 3¢ per 1,000 | Needs an **API key**. Website-based authentication won't work from ChatGPT's sandbox origin |
| **MapTiler Cloud** | **No** on Free | Free: non-commercial only | Flex **$30/month**: 500,000 requests, then $0.15 per 1,000 | Yes: raster plus a key |
| OpenFreeMap | Yes, free, no key | Unlimited (no SLA) | Free | **Vector tiles only.** Needs MapLibre GL, fetch access, a blob worker and WebGL inside ChatGPT's sandbox. Prototype passes in simulation; **untested in ChatGPT** (see 4b) |
| OpenStreetMap tile servers | **No** (usage policy) | | | Testing only |

**Rough monthly tile volume:** about 20–60 tiles per map opened (a first view plus some panning). 2,000,000 tiles is roughly 33,000–100,000 map opens a month.

**Recommendation:** ArcGIS Static Basemap Tiles, light grey style. It's the only option here with a **commercially permitted free tier** large enough for launch, it's raster (the lowest risk in ChatGPT), and it has a calm basemap. Before enabling it:
- create an ArcGIS Location Platform account;
- create an access token restricted to basemap tiles;
- set a **spending alert or limit** in the ArcGIS dashboard;
- check the attribution text.

Pay-as-you-go plans **bill automatically above the free tier**, so a spending limit matters.

## 4b. Free option under evaluation: MapLibre GL JS + OpenFreeMap (prototype)

**Status:** prototype behind `MAP_ENGINE=maplibre`. Leaflet stays the default. **Not deployed, and not tested in ChatGPT.**

- **Why MapLibre directly, not mapcn:** mapcn is a set of React, Tailwind and shadcn components on top of MapLibre. The card is plain JavaScript, so it uses MapLibre GL JS 6.13 (BSD-3-Clause) directly through a small engine adapter. Area groups, selection, preview, counts and the list fallback are shared code for both engines.
- **OpenFreeMap terms:** free, commercial use allowed, no key, no registration, no usage limit. There's **no SLA**: it's a donation-funded public service.
  - Required attribution: "OpenFreeMap © OpenMapTiles Data from OpenStreetMap". It comes from the style and is always visible.
  - Self-hosting the same tiles is possible later if reliability matters.
- **Styles:**
  - light: `positron`, with road shields, path and minor-road names, POI and airport labels hidden, and names in English or Arabic;
  - dark: `dark`.
- **Card size:** about 2.1 MB, against about 0.67 MB with Leaflet. MapLibre (1.1 MB) and its worker (0.5 MB) are inlined, so no external scripts load.
- **Security policy it needs:**
  - `connectDomains: https://tiles.openfreemap.org` for the style, vector tiles, fonts and sprites. This is added automatically from `MAP_STYLE_URL`.
  - **WebGL.**
  - A **web worker started from a `blob:` URL**. The MCP Apps spec doesn't define a worker policy, so whether ChatGPT allows it is **unknown until tested there**.
- **Fallbacks:** if WebGL is missing, the worker is blocked, the style can't be fetched, or loading takes over 9 s, the card shows "map couldn't load" and the accessible area list. All four cases are tested in the simulation.

**Simulated host results (local Chrome, 7 Oct 2026):** 206 of 206 checks pass through both card addresses. Leaflet still passes its 204.

| Check | Desktop 1280 px | Phone 390 px (touch emulated) |
|---|---|---|
| Map loads (markers / style ready / first idle) | about 0.1 s / 1.9–2.7 s / 2.1–3.1 s | first idle 1.9–2.6 s |
| First-view traffic from OpenFreeMap | 22 requests, about 470–565 KiB (6 tiles, 12 font ranges, 2 sprites, style) | 17 requests, about 390–560 KiB |

These timings come from a fast local connection. A mobile network in ChatGPT will be slower.

**Actual ChatGPT (test app, 7 Oct 2026 ~15:10 Dubai, reported by Savoir): rendering PASSES in ChatGPT web.** The map draws, and area selection and the property preview are visible, so WebGL, the blob worker and the OpenFreeMap fetches worked in that session.

**Interactions: PASS in ChatGPT web** (reported by Savoir later on 7 Oct; the test time was not given).

**Still pending in ChatGPT:**
- the ChatGPT phone app and full screen;
- Arabic and dark mode;
- load time on a real phone;
- the fallback when something is blocked (this can only be simulated).

**Run locally:** `MAP_ENGINE=maplibre MAP_STYLE_URL=https://tiles.openfreemap.org/styles/positron MAP_STYLE_URL_DARK=https://tiles.openfreemap.org/styles/dark`. Optional: `MAP_CONNECT_DOMAINS` (extra fetch origins) and `MAP_MAX_ZOOM` (default 16).

## 5. Configuration

| Variable | Example | Effect |
|---|---|---|
| `MAP_TILE_URL` | the provider's raster XYZ template, including its public key or token | Turns the map on. Must be https and contain `{z}`, `{x}`, `{y}` (`{s}` and `{r}` are supported) |
| `MAP_TILE_ATTRIBUTION` | the provider's required text | Shown on the map |
| `MAP_TILE_SUBDOMAINS` | `a,b,c` | Only for `{s}` |
| `MAP_MAX_ZOOM` | `18` | |

The tile host is added automatically to the card's `resourceDomains`. After changing the provider, refresh the app in ChatGPT so it fetches the new policy.

## 6. Tests
- **Unit tests (`test/map.test.ts`):**
  - area data stays inside Dubai and keeps its sources;
  - area matching;
  - developer-map checks (agrees, conflict, unverifiable);
  - configuration and the security-policy entries;
  - Leaflet is inlined only when the map is on.
- **Simulated host, scenario K (large desktop 1280 px; phone 390 px with touch):**
  - **Markers and labels:** one marker per area, no building pins, markers never overlap, overlapping areas merge, the "approximate" label on the map, the count line separating this page from all results.
  - **Map behaviour:** attribution visible and never covered by the preview; **no tool call when the map moves or zooms**.
  - **Selection:** selecting an area shows the price range, the homes in the preview and outlined cards; the property preview; Show on map; Details and Back keep the selection.
  - **Phone:** full screen, the selected area stays visible above the preview, Back to listings, no sideways scroll.
  - **Other:** blocked tiles lead to the fallback list; Arabic, with zoom buttons not covered; off-plan results counted as projects.
- **Not yet tested in ChatGPT or Claude.**
