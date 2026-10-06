# Milestone 1: customer journey (v0.2.0)

**Status: built and verified locally. Not deployed.** Production still runs v0.1.0 (read-only, 5 tools) until you approve this release.

## What the customer gets

| Step | What happens | Tool |
|---|---|---|
| "I don't know Dubai" | Areas that fit the budget, purpose and bedrooms, with **live listing counts and price ranges** from Savoir's inventory, plus editorial character tags (beachfront, golf, family/villa, city centre, more affordable…) and nearby areas | `get_area_guide` |
| Guided search | The app searches straight away and suggests **at most two** follow-up questions. Lifestyle needs (private pool, water view, maid's room…) are **verified on the listings shown**, never presented as a search filter | `search_properties` |
| Nothing matches | Labelled **alternatives** from real searches, for example *"Without the budget limit — prices start at AED 119,950"*, *Nearby areas (editorial)*, *Any number of bedrooms*. They're never shown as exact matches | `search_properties` |
| Details | Gallery, price, **price per sq ft** (sale listings with a verified size), size, amenities, reference and permit number, agent, similar listings, and how current the data is | `get_property_details` |
| Off-plan | Budget matched on **"starting from" prices** (cheapest unit, labelled as such). A payment schedule appears **only from a unit price the customer provides** and only when the plan adds up to 100%. Fees are excluded, and there are no ROI claims | `search_offplan_projects`, `get_offplan_project_details` |
| Compare | 2–4 listings side by side. Missing data shows as "not provided". Suitability against the customer's stated needs, where buy vs rent is a hard requirement | `compare_listings` |
| Shortlist | Save and remove listings from the cards. A server record holds listing references only, no personal data, for 30 days after the last change. An optional read-only **share link** (`noindex`, revocable). Delete at any time | `update_shortlist`, `get_shortlist`, `share_shortlist`, `delete_shortlist` |
| Contact | Listings are **re-verified live**. The app writes the exact message (listings, stated requirements, a requested viewing time, a `SAV-XXXXXX` reference) and the customer sends it on WhatsApp or by email. **Nothing is sent by the server, no contact details are collected, and no booking is ever claimed** | `prepare_inquiry` |

Cards cover list, detail, compare, shortlist, area guide and message preview, with loading and error states. The UI is in **English and Arabic (RTL)**, following the host locale, in light and dark themes, at desktop and mobile widths. The Savoir logo is on the brand bar. Every tool also returns complete text, for hosts without cards.

## Verified vs. not available

| Capability | Basis |
|---|---|
| Area statistics | CMS inventory snapshot (≤5 pages, cached 10 min, "as of" shown) |
| Amenity checks | CMS listing details (portal amenity vocabulary); at most 6 listings per search, within the rate budget |
| Price per sq ft | CMS `size`, confirmed to be sq ft; **sale only**, because the rent period is not published |
| Off-plan budget | Parsed `starting_price` text. "Call Us" and similar are excluded and counted in a note |
| Nearby areas and tags | **Editorial**, in `src/data/areas.ts`. Every name exists in the CMS (enforced by a test). **Savoir should review it** |
| Not available | Amenity search, bedroom ranges, size filters, unit-level off-plan prices, rent period, coordinates, ROI, booking, user identity |

## Reliability and privacy
- **CMS:** identical in-flight requests share one call; cached data reports its fetch time; handoff re-verification bypasses the cache; recovery probes stop when the shared budget is low (reserve of 4) or after a CMS error.
- **Shortlist IDs and share tokens** are separate random 128-bit values. Share pages render **server-captured** listing facts only (not client-supplied text), are escaped, and use `default-src 'none'`, `noindex`, `no-referrer` and `no-store`. They make no CMS calls.
- **Logs** never contain shortlist IDs, share tokens (logged as `/s/:token`), tool arguments or contact details.
- **Live inquiry submission** (`submit_property_inquiry`) now supports multiple listings, requirements and a reference code, keeps the HMAC confirmation-token protection, and **stays disabled**.

## Verification
- **Automated:** 13 test files, **127 tests**, all passing, plus a clean typecheck and build. They cover:
  - suitability (including the buy/rent hard rule)
  - recovery probes (relaxations, cap, budget guard, error stop)
  - amenity verification limits
  - the area-guide integrity check against 139 real CMS names
  - shortlist expiry, limits, share/revoke/delete, atomic persistence, corrupt-file handling
  - handoff text in EN/AR, reference codes and channel encoding
  - request coalescing and data age
  - end-to-end MCP journeys including share-page escaping, log hygiene and fresh re-verification
- **Live local runs** against the production CMS (read-only):
  - `npm run smoke:journey`: area guide → search → alternatives → amenity check → compare → shortlist/share/delete → handoff → off-plan schedule, all passing.
  - `npm run preview:widget`: 17 checks in Chrome through the official MCP Apps **host bridge (a simulation)**, across English desktop, Arabic RTL, mobile and dark.
- **Linux server simulation:** create-user → deploy → shortlist → redeploy; the shortlist survives the release switch, with file mode `600`, owned by `savoir-mcp`.
- **Not tested yet: ChatGPT and Claude.** None of the above is a host test.

## Recurring infrastructure cost
**None new.** It runs on the same VPS, the same Node process and the same pm2 app. Shortlists are a few KB per list in `shared/data`. There are no third-party services.

## Configuration changes for production
`PUBLIC_MCP_URL=https://mcp.savoirproperties.com` and `ATTRIBUTION_UTM=off` (see `deploy/production.env.example`). `DATA_DIR` defaults to `~/savoir-mcp/shared/data`. The server's existing `shared/.env` needs the `PUBLIC_MCP_URL` line before this release is deployed.

## Demo script (for review in ChatGPT once deployed)
1. "I'm moving to Dubai and want to buy a 2-bedroom for under AED 3M, but I don't know the areas." → area guide → **Search here**.
2. "Which of these have a water view?" → amenity check per listing.
3. Tick two cards → **Compare (2)** → the requirements row.
4. Tap ♡ on one → **Shortlist (1)** → **Create share link** → open it in a browser → **Stop sharing**.
5. "Studio on Palm Jumeirah to rent for 40k" → alternatives ("prices start at AED …").
6. "Emaar projects handing over in 2029 under 3M" → details → enter a quoted unit price → schedule.
7. **Message about these** → check the message → **Send on WhatsApp** (don't send). Confirm that nothing claims a booking.
8. Repeat step 1 with ChatGPT set to Arabic to check RTL.
