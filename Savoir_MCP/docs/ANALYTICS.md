# Business analytics (Milestone 2)

## What is collected

**Daily aggregate counters** per Dubai calendar day: an event, a set of low-cardinality dimensions, and a count. Counts are also kept per public listing slug.

**Never stored:** conversation text, search free text, notes, viewing times, names, emails, phone numbers, IP addresses, user or session identifiers, shortlist IDs, share tokens, reference codes, and timestamps finer than a day.

**Safeguards:**
- Unknown events are dropped.
- Dimension values must look like vocabulary. Anything else, including any value with 7 or more digits, is stored as `other`.
- Each event is capped at 500 dimension sets per day.

**Storage:** `DATA_DIR/analytics.json`, file mode 600, written atomically, kept for **400 days**.

**Access:**
- **Never through MCP tools.** A test asserts that no tool name mentions analytics, insights, metrics or reports.
- Staff read the data with the report command, or with the optional authenticated dashboard.

**Switch off** with `ANALYTICS=off`. Buttons then use plain links and nothing is counted.

## Events

| Event | Dimensions | Listing counted |
|---|---|---|
| `search` | purpose, budget band, bedrooms, type, completion, must_have used, outcome, number of alternatives | – |
| `search_area` | resolved Savoir area name, outcome | – |
| `offplan_search` | budget band, whether developer, handover or area filters were used, outcome | – |
| `area_guide` | purpose, budget band, number of tags, number of results | – |
| `detail_view` | kind, whether a payment schedule was requested | ✓ |
| `compare`, `compare_listing` | number of items, requirements given / kind | ✓ |
| `shortlist_created/add/remove/view/shared/unshared/deleted`, `shared_page_view` | kind or item count | add/remove ✓ |
| `handoff_prepared`, `handoff_listing` | number of listings, unavailable count, language, viewing requested, campaign code, purpose, budget band / kind | ✓ |
| `contact_options` | with a listing or not | – |
| `link_click` | channel (website / whatsapp_company / whatsapp_agent), source (card / detail / handoff / share_page), kind | ✓ |
| `inquiry_submitted` | number of listings, type, has reference | – (only when live submission is enabled) |

**Budget bands:**
- Sale: `<1M`, `1–2M`, `2–3M`, `3–5M`, `5–10M`, `10M+`
- Rent: `<80k`, `80–120k`, `120–180k`, `180–300k`, `300k+`
- `unspecified` when no budget is given

## Clicks vs. leads

| Signal | What it means | How it's observed |
|---|---|---|
| **Message prepared** (`handoff_prepared`) | The customer asked for a message to Savoir | Tool call |
| **Contact link click** (`link_click`, WhatsApp channels) | The customer pressed a WhatsApp button | A signed `/go/` redirect counts it, then forwards to `wa.me` |
| **Delivered lead** | Savoir actually received a message | **Not observable automatically.** Staff match the `SAV-XXXXXX` reference in incoming WhatsApp messages. With live submission enabled, `inquiry_submitted` counts confirmed CMS submissions |

`/go/` links are HMAC-signed and the target is re-checked against an allow-list (the Savoir website and `wa.me`), so they cannot be used as an open redirect. Link-preview bots and browser prefetches are forwarded but not counted. Tokens never appear in logs (the path is logged as `/go/:token`).

## What each host lets us observe

| Interaction | ChatGPT (cards) | Claude (cards) | Text-only MCP clients |
|---|---|---|---|
| Searches, details, compare, shortlist, handoff | ✓ tool calls | ✓ tool calls | ✓ tool calls |
| Card button clicks (Website / WhatsApp) | ✓ via `/go/`, **if** the host opens the link it was given | ✓ via `/go/`, same condition | n/a (no buttons) |
| Links the assistant writes in its own reply | ✗ plain links, not tracked | ✗ | ✗ |
| Shortlist share page views and clicks | ✓ (`shared_page_view`, `link_click` from `share_page`) | ✓ | ✓ |
| Email and phone buttons | ✗ (mailto/tel are not tracked) | ✗ | ✗ |
| Whether a WhatsApp/email message was sent | ✗ | ✗ | ✗ |
| Who the customer is, or where they came from | ✗ (not provided by hosts and not collected) | ✗ | ✗ |
| Activity on the website after a click | ✗ (the website has no analytics) | ✗ | ✗ |

The card-click rows are verified in a **simulated** MCP Apps host only. Whether ChatGPT and Claude open the exact `/go/` URL the card provides must be confirmed in those hosts after deployment (DEPLOYMENT.md §6).

## Staff report and dashboard

**Report (no server needed), from a copy of the data file:**

```bash
npm run insights -- --data-dir ./data --days 30 --out insights.html
```

**On the server**, as `savoir-mcp`:

```bash
node ~/savoir-mcp/current/dist/cli/insights.js --data-dir ~/savoir-mcp/shared/data --days 30 --out /tmp/insights.html
```

**Dashboard:** `https://mcp.savoirproperties.com/internal/insights?days=30`
- **Disabled (404)** unless both `INSIGHTS_USER` and `INSIGHTS_PASSWORD_HASH` are set in `shared/.env`.
- Uses HTTP Basic auth over HTTPS against a scrypt hash.
- Five failed attempts block for 15 minutes.
- Pages are served with `no-store` and `noindex`, under a CSP with no scripts.
- To create the hash, run `npm run insights:hash-password`, type the password, then press Ctrl-D.

**The report shows:**
- the funnel;
- key rates **with numerator/denominator**, flagged "low sample" under 30;
- the most requested areas, with no-match rates;
- budget bands, marked **underserved** when there are at least 10 searches and 40% or more have no exact match;
- the listings attracting interest (weighted: details 1, compare 2, shortlist 3, click 4, message 5);
- the daily search-to-contact trend, clicks by channel and source, and campaign codes;
- the limitations.

**Rules for using it:** don't send marketing messages or enrol customers from this data. There are no customer identities in it.
