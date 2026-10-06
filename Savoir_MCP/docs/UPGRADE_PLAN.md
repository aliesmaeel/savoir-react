# Savoir MCP upgrade: gap audit and release plan

_Prepared 6 October 2026 from the code on branch `savoir-mcp`, live read-only CMS probes and current MCP Apps / ChatGPT documentation. The production server is unchanged until a release is approved._

## 1. Evidence

| Source | Finding |
|---|---|
| CMS listings (242) | 38 communities. Search results carry title, community, sub-community, type, ready/off-plan, sale/rent, beds, baths, price, photo and agent. **No size, amenities or coordinates.** |
| CMS listing detail | Size in sq ft (cross-checked with descriptions), a fixed amenity vocabulary (e.g. *Private pool, Shared pool, Maids room, View of water, Balcony, Covered parking, Shared gym, Security*), reference and permit number, and the agent. `lat`/`lng` are null in every sample. `price_name` is null, and no rent period appears in rent descriptions. |
| CMS search semantics | The filters that work are: area name (exact), sale/rent, ready/off-plan, one property type, **exact** bedrooms and bathrooms, and a price range (inclusive). There is no size, amenity, date or range-of-bedrooms filter. |
| CMS off-plan (46 projects) | Developer, handover (stored in inconsistent formats), location, a free-text `starting_price` (`AED 1.99M`, `700K`, `Call Us`, …), payment plan percentages (each sampled plan sums to 100%), unit-size range text, and `lifestyle` (Premium/Standard, in details only). **No unit-level prices.** |
| CMS rate limit | 60 requests/min per IP, shared with the website's server-side rendering; about 13/min were already in use during the inspection. The MCP budget is 20/min. |
| Website analytics | **None**: no GA, GTM, pixel or similar in the code or the live HTML. Campaign tags on website links cannot be measured by the website today. |
| MCP Apps hosts | The host context offers `locale`, `timeZone`, `platform`, `displayMode`. Optional host capabilities are `updateModelContext`, `openLinks`, `serverTools` and `message`. Display modes are inline, fullscreen and pip. |
| ChatGPT docs | Widget state is **per rendered card**, not per conversation, and the model doesn't see it unless the app calls `ui/update-model-context`. `localStorage` is "not a reliable cross-device or cross-session data layer". The host mirrors the locale to `document.documentElement.lang`. RTL is not documented. |
| Host identity | Nothing documented gives the ChatGPT user's identity or the page that referred them. The MCP client name is only partly available in stateless serving. |

## 2. Gap audit, by requirement

| # | Requirement | Today | Gap / decision |
|---|---|---|---|
| 1 | Guided discovery | Filters work, but there is no guidance for people new to Dubai | Add an **area guide** built from live inventory (counts and price ranges per community) plus a small **editorial** tag/neighbour list for Savoir to review. Searches report the **1–2 most useful missing preferences**. Lifestyle needs are **verified per listing from amenities**, never presented as a CMS filter. Ready vs off-plan and off-plan handover are verified; a handover date for resale off-plan listings is not available. |
| 2 | Search recovery | A "no results" note | When nothing matches, run **real** relaxed searches (budget +15%, nearby areas, no bedroom count, no type), capped and cached, and report each as a labelled **alternative**, never as an exact match. |
| 3 | Comparison | Missing | `compare_properties` (2–4 items) using verified details, price per sq ft for **sale** listings with a known size, missing values shown as "not provided", and suitability explained against the stated requirements. |
| 4 | Shortlist | Missing | Card state is per card, so a conversation-wide shortlist needs a **small server record** with an unguessable ID. It holds listing references only (no personal data), expires 30 days after the last change, and the user can delete it. Optional **share link** with its own unguessable token, the same expiry, a read-only page, `noindex`, and revocable. |
| 5 | Cards | One list/detail view, English only | Rebuilt cards covering list, detail (gallery), compare, shortlist, inquiry preview, loading and error. **English + Arabic with RTL** when the host locale is Arabic (CMS titles exist only in English; `title_ar` is null). Real Savoir logo, accessible markup, AED / sq ft / date formatting. Text output is kept. |
| 6 | Off-plan decisions | Payment plan percentages shown | **Off-plan budget matching on parsed "starting from" prices**, clearly labelled. A **payment schedule only from a unit price the customer provides**, only when the plan sums to 100%, with fees excluded and stated. No ROI or yield claims. |
| 7 | Inquiry handoff | Live submit tool exists (disabled), single listing | `prepare_inquiry`: **re-verifies the listings live**, composes the exact message (references, requirements, requested viewing time), and offers **WhatsApp / email links the customer sends themselves**. No personal data is collected and nothing is sent by the server. The live CMS submit stays disabled until the contract, delivery destination and privacy text are confirmed. It never claims a booking. |
| 8 | Attribution | None | Each handoff carries a **reference code** and "Source: Savoir Properties app" in the message, plus an optional explicit `campaign_code`. Links carry `utm_source=savoir_ai_app`, which can't be measured until the website adds analytics. Host identity is not assumed. |
| 9 | Analytics | Operational logs only | Milestone 2: privacy-safe **daily aggregate counters** (no conversation text, no personal data, no per-user IDs), **signed click-redirects** so contact-link clicks are observable, and clicks kept separate from delivered leads. Not exposed through any MCP tool. |
| 10 | Insights | None | Milestone 2: a staff report (CLI → HTML) plus an optional dashboard behind HTTP authentication, showing sample sizes and limitations. |
| R | Reliability | TTL cache, request budget | Add **request coalescing**, `data_as_of` on every result, **fresh re-verification** before handoff, and cache-aware relaxation probes that respect the budget. |

## 3. Release plan

**Milestone 1: customer journey** (guided search → details → compare / shortlist → contact handoff)
1. CMS layer: request coalescing, data-age metadata, inventory snapshot for area statistics.
2. Guided discovery: area guide, missing-preference hints, lifestyle verification, off-plan budget.
3. Search recovery with labelled alternatives.
4. Comparison with suitability.
5. Shortlist store, tools and share page.
6. Inquiry handoff with attribution; the existing live submit is extended but stays disabled.
7. Card UI rebuild with English/Arabic/RTL; local browser verification.
8. Tests, docs, demo script, reviewable release.

**Milestone 2: analytics and insights**
1. Aggregate counter store and event hooks in the tools.
2. Signed click-redirect endpoint.
3. Staff report and optional authenticated dashboard.
4. An observability matrix documenting what each host lets us see.

**Infrastructure cost:** none new. It runs on the same VPS and process. A small JSON data directory stores shortlists and aggregates, at most a few MB. There are no third-party services.

**Out of scope, with reasons:**
- Bedroom ranges and size filters: the CMS has no such filters, and emulating them would change pagination semantics.
- Amenity-based search: amenities exist only in details, so only per-listing verification is possible.
- ROI or yield: there is no verified data.
- Booking: there is no integration.
- Persistent user profiles: no identity is available, and none should be collected.
