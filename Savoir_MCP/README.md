# Savoir Properties MCP server

An MCP server that lets ChatGPT, Claude and other MCP clients search Savoir Properties' live listings and off-plan projects. It reads the same CMS the website uses (`https://cms.savoirproperties.com`). Results come back as plain text, as structured data, and as interactive property cards for hosts that support [MCP Apps](https://developers.openai.com/plugins/build/chatgpt-ui) (ChatGPT, Claude).

- **Transport:** Streamable HTTP at `/mcp`, with health endpoints at `/health` and `/ready`.
- **Stack:** Node.js 20.19+, TypeScript, MCP TypeScript SDK v2 (`@modelcontextprotocol/server` 2.3), `@modelcontextprotocol/ext-apps` 2.0 for the UI.
- **Isolation:** this is a self-contained project. The website does not import it, and the website's `tsconfig.json`, Vitest config and `.dockerignore` exclude this folder.

## Tools

| Tool | Kind | What it does |
|---|---|---|
| `get_area_guide` | read | Areas that fit purpose/budget/bedrooms, with live listing counts and price ranges plus editorial tags and nearby areas. |
| `search_properties` | read | Listing search (area, buy/rent, type, exact beds incl. studio, exact baths, AED range, ready/off-plan, sort). Optional `must_have` amenities are verified on the results. Returns missing-preference hints and, when nothing matches, labelled alternatives. |
| `get_property_details` | read | Gallery, price, price per sq ft (sale), size, amenities, reference/permit, agent, similar listings. |
| `search_offplan_projects` | read | Developer, handover, area, and an optional budget matched on "starting from" prices. |
| `get_offplan_project_details` | read | Developer, handover, payment plan, unit sizes. With `unit_price_aed` (a customer-quoted price) it adds an illustrative schedule. |
| `compare_listings` | read | 2–4 listings side by side, with suitability against stated requirements. |
| `update_shortlist` / `get_shortlist` | write / read | Conversation shortlist (listing references only, 30 days after the last change). |
| `share_shortlist` | write | Create or stop a read-only share link (`/s/<token>`). |
| `delete_shortlist` | write (destructive) | Delete the shortlist and its link. |
| `prepare_inquiry` | read | Re-verifies listings and composes the exact WhatsApp/email message (reference code, requirements, viewing request). Sends nothing. |
| `get_contact_options` | read | WhatsApp, phone, email, office and listing agent. |
| `submit_property_inquiry` | write | **Disabled by default.** Preview + confirmation token, then POST /api/contact-us. Never books a viewing. |

All read tools are annotated `readOnlyHint: true, destructiveHint: false, openWorldHint: false`. The cards resource is `ui://savoir/listings-v2.html` (`text/html;profile=mcp-app`); its CSP allows the three image hosts and the Savoir website (for the logo), and `connectDomains` is empty. The UI is English/Arabic with RTL. See [docs/RELEASE_M1.md](docs/RELEASE_M1.md) for what is verified and what is not.

## Business analytics

Privacy-safe daily aggregate counters (no personal data or identifiers), signed click links (`/go/`) that count Website/WhatsApp button clicks separately from delivered leads, and a staff report or optional authenticated dashboard (`/internal/insights`). None of it is exposed through MCP tools. See [docs/ANALYTICS.md](docs/ANALYTICS.md) for what is collected and what each host lets us observe, and [docs/RELEASE_M2.md](docs/RELEASE_M2.md) for the release.

## Local setup

```bash
cd Savoir_MCP
npm ci
cp .env.example .env        # CMS_BASE_URL is the only required value
npm run dev                 # http://127.0.0.1:8787/mcp (auto-reload)
curl http://127.0.0.1:8787/health
curl http://127.0.0.1:8787/ready   # also checks the CMS is reachable
```

Production build:

```bash
npm run build && npm start
```

Checks:

```bash
npm run typecheck
npm test                    # 151 tests, no network access
npm run insights -- --data-dir ./data --out insights.html   # staff report from aggregate metrics
npm run smoke               # read-only live calls against a running server (~10 CMS requests)
npm run preview:widget      # 17 checks in local Chrome/Edge via the MCP Apps host bridge (a simulated host)
npm run smoke:journey       # live read-only customer journey against a running server
```

`preview:widget` writes screenshots to `./preview-output`. It hosts the widget with the official `AppBridge` under the same CSP the server declares, and clicks through the Details, Website, WhatsApp, Ask Savoir and Back buttons.

## Verify with MCP Inspector

1. Start the server: `npm run dev`.
2. Run `npm run inspector`, which is `npx @modelcontextprotocol/inspector@latest`.
3. In the Inspector UI, choose transport **Streamable HTTP**, URL `http://127.0.0.1:8787/mcp`, connection type **Via Proxy**. Then click **Connect**.
4. Under **Tools → List Tools**, you should see five tools. A sixth (`submit_property_inquiry`) appears only when `INQUIRY_MODE` is not `disabled`.
5. Try these calls:
   - `search_properties` `{ "areas": ["Dubai Marina"], "purpose": "buy" }` returns status `ok` with cards.
   - `search_properties` `{ "bedrooms": "studio", "purpose": "rent", "sort": "price_low_to_high" }` returns studios only.
   - `search_properties` `{ "areas": ["Atlantis on Mars"] }` returns status `no_results` (not an error).
   - `get_property_details` with a slug from a result returns full details. With a made-up slug, it returns `not_found`.
   - `search_offplan_projects` `{ "developers": ["Emaar"], "handover": "2029" }`.
   - `get_offplan_project_details` `{ "slug": "the-archive-by-imtiaz" }` includes the payment plan.
6. Under **Resources**, read `ui://savoir/listings-v1.html`. The MIME type should be `text/html;profile=mcp-app`.

To check the inquiry flow without sending anything, set `INQUIRY_MODE=dry_run`. Call `submit_property_inquiry` once to get a preview and a `confirmation_token`. Then call it again with the same details plus `"confirm": true` and the token. You should get status `dry_run`, and nothing is sent.

## Connect to ChatGPT

ChatGPT connects from OpenAI's servers, so the server needs a **public HTTPS URL**. For deployment, see the deployment section below. For development, use a tunnel, or OpenAI's Secure MCP Tunnel for a private server.

1. Deploy, or tunnel. For a dev tunnel, set `ALLOWED_HOSTS` to the tunnel hostname. For example:
   ```bash
   cloudflared tunnel --url http://127.0.0.1:8787
   ```
2. In ChatGPT, open **Plugins**, select **+**, then **Add custom MCP server**.
3. Enter a name ("Savoir Properties") and a description. Under **Connection**, enter `https://<your-host>/mcp`.
4. Set authentication to **No authentication**. These are public listings, and the write tool needs per-call user confirmation instead. Review the risk warning, then select **Create as a plugin**.
5. In a new chat, type `@` and pick the plugin. Example prompts:
   - "Show me 2-bedroom apartments for sale in Dubai Marina under AED 3M"
   - "Any studios for rent in JVC? Cheapest first"
   - "Which Emaar off-plan projects hand over in 2029, and what are the payment plans?"
6. After any change to tools or schemas, redeploy, open the plugin's connection, select **Refresh**, and start a new chat.

## Connect to Claude

Claude also connects from Anthropic's cloud, so it needs the same public HTTPS URL. Claude renders the MCP Apps cards as well.

- **Claude (web, desktop or mobile), on Pro, Max, Team or Enterprise plans:** go to **Settings → Connectors → Add custom connector**. Enter the name "Savoir Properties" and the URL `https://<your-host>/mcp`. Leave the OAuth fields empty. On Team and Enterprise plans, an owner adds the connector under organisation settings first. Then enable it for a chat from the tools menu.
- **Claude Code (CLI):** this also works against a local server.
  ```bash
  claude mcp add --transport http savoir http://127.0.0.1:8787/mcp
  # or the deployed URL: claude mcp add --transport http savoir https://mcp.savoirproperties.com/mcp
  ```

## Configuration

All configuration comes from environment variables. See [.env.example](.env.example).

| Variable | Default | Notes |
|---|---|---|
| `CMS_BASE_URL` | *(required)* | Server-side CMS origin. It is separate from the website's `VITE_BASE_URL`. Must be https (http is allowed only for localhost). |
| `PUBLIC_SITE_URL` | `https://savoirproperties.com` | Used for canonical links (`/project/{slug}`, `/off-plan/{slug}`), matching the site's `app/seo/canonical.ts`. |
| `HOST` / `PORT` | `127.0.0.1` / `8787` | Use `HOST=0.0.0.0` in containers. |
| `ALLOWED_HOSTS` | *(empty)* | Host header allow-list against DNS rebinding. **Set this in production.** Loopback binds are protected automatically. |
| `CMS_TIMEOUT_MS` | `8000` | Timeout per CMS request. |
| `CMS_MAX_REQUESTS_PER_MINUTE` | `45` | Outbound budget, kept under the CMS's 60/min/IP throttle. |
| `IMAGE_HOSTS` | the 3 verified hosts | Image URLs from other hosts are dropped. This list also sets the widget CSP. |
| `INQUIRY_MODE` | `disabled` | `disabled`, `dry_run` or `live`. |
| `INQUIRY_TOKEN_SECRET` | random per process | HMAC key for confirmation tokens. Required if you run more than one instance. |
| `OPENAI_APPS_CHALLENGE_TOKEN` | — | Served as plain text at `/.well-known/openai-apps-challenge`. |
| `WIDGET_DOMAIN` | — | `_meta.ui.domain` (and the ChatGPT alias `openai/widgetDomain`). Unset, ChatGPT uses its default sandbox; OpenAI requires a unique value **before directory submission**. |
| `MAP_TILE_URL` | — | Turns on the property map (https XYZ tile template). Off by default: production needs a paid tile provider, see [docs/MAP.md](docs/MAP.md). |
| `MAP_TILE_ATTRIBUTION` | `© OpenStreetMap contributors` | Attribution shown on the map. |
| `MAP_TILE_SUBDOMAINS`, `MAP_MAX_ZOOM` | —, `18` | Only for `{s}` templates / zoom limit. |
| `MAP_ENGINE`, `MAP_STYLE_URL`, `MAP_STYLE_URL_DARK`, `MAP_CONNECT_DOMAINS` | `leaflet` | Prototype only: `MAP_ENGINE=maplibre` draws an OpenFreeMap vector style with MapLibre GL instead of raster tiles. Not tested in ChatGPT yet; see [docs/MAP.md](docs/MAP.md) section 4b. |
| `LOG_LEVEL` | `info` | Logs are JSON lines. |

## How the CMS actually behaves (verified October 2026)

These behaviours were confirmed with read-only requests to production before the adapters were written. Anyone changing the adapters should know them.

**General**
- The read endpoints need **no authentication**. The website's optional Bearer token is never needed for public data.
- The CMS throttles at **60 requests per minute per client IP**, returning HTTP 429 (`X-RateLimit-Limit: 60`). The server keeps its own budget below that limit and caches results: suggestions for 10 minutes, details for 2 minutes, searches for 60 seconds.
- **An unknown slug returns HTTP 500** with a full Laravel debug payload, including stack traces and server paths (`Attempt to read property "community" on null`). The adapter maps this to `not_found` and never passes any CMS error body through.

**`POST /api/search`**
- `offering_type`: `RS` means sale and `RR` means rent. `null` returns both.
- `completion_status`: `completed` or `off_plan`. Off-plan listings are sale only.
- `type` takes **one code** (`AP`, `VI`, `TH`, `PH`, …). Sending an array causes a 500. Offices are stored as `Office-space`; the website's `OF` code matches nothing.
- `bedroom` and `bathroom` are **exact matches**. Studio is `0`. A non-numeric value such as `"studio"` is **silently ignored and returns every listing**, so the adapter only ever sends integers. The website's "5+" option actually means "exactly 5".
- `min_price` and `max_price` are inclusive, in AED.
- `query` is an array of **exact, case-insensitive location names** from `/api/search-suggestions` (community, sub-community or building), combined with OR. Partial names match nothing. The adapter therefore resolves user wording ("JBR", "Marina") to the exact names and reports any expansion it made.
- Sorting works on `price`, `updated_at` and `title_en`. Any other `sort_field` silently falls back to `updated_at`.
- `limit` is capped at 100 by the CMS. The adapter limits pages to 1–12 results and pages 1–50. A page past the end returns an empty `data` array with the true `total`.
- The response is `{ page, limit, total, total_pages, count, data[] }`. Each item's `bedroom` is a string, for example `"2"`.

**`GET /api/property/{slug}`**
- Returns `{ property, similar_properties[10] }`. Photos are absolute https URLs on `static.shared.propertyfinder.ae`. Agent photos and off-plan media are on `res.cloudinary.com`.
- `property.user` is the listing agent `{ name, email, phone, image }`, the same data the website shows publicly. The CMS placeholder account `Admin` is not presented as an agent.

**`POST /api/search-offplan`**
- `developers` is an array of exact, case-insensitive names, combined with OR.
- `completion_date` is **one exact string**. Sending an array causes a 500.
- `locations` is an array of **project slugs** (the keys of the suggestions `locations` map), not area names.
- The CMS stores handover dates inconsistently, for example both `"Q2 - 2028"` and `"Q2 2028"`. A quarter or year therefore resolves to every stored spelling: one request per spelling, merged.
- **Only `updated_at` sorting works.** `sort_field=price` causes a 500, and the other fields fall back silently. That is why the tool offers no sort option.
- `limit=0` causes a 500 (division by zero), so inputs are validated first.
- `starting_price` is free text, such as `"AED 1.99M"` or `"AED 666,000"`. Placeholders such as `"Call Us"` are shown as "price on request".

**`GET /api/offplan-projects/{slug}`**
- Payment plan percentages come from `first_installment`, `during_construction` and `on_handover`. `features` is a comma-separated string. `header_images[].url` holds the images. `map_link` is a raw `<iframe>` and is deliberately never passed through.

**`POST /api/contact-us`**
- This endpoint is POST-only. The website sends `{ type: "contact_us", name, email, phone, message }`, and the adapter sends exactly that shape. **Its validation rules and response body were not verified**, because no test submission was made to production (see the blockers below).

## Inquiries (`submit_property_inquiry`)

- `INQUIRY_MODE=disabled` (the default): the tool is not offered at all. Users get contact links from `get_contact_options`.
- `INQUIRY_MODE=dry_run`: the full flow runs, but the final step sends nothing. Use this for review demos.
- `INQUIRY_MODE=live`: a confirmed inquiry is POSTed to `/api/contact-us` and creates a real lead.

The flow:

1. The first call validates the input and looks up the listing. It then composes the **exact** message, which includes the listing title, reference and link, plus any preferred date and time labelled as a *request*. It returns this as a preview with a confirmation token. **Nothing is sent at this step.**
2. The assistant shows the preview and asks the user to confirm.
3. The second call (`confirm: true` plus the token) sends the inquiry only if the token is valid and **the payload is identical** to the preview. Tokens are HMAC-signed, expire after 10 minutes and work only once.

A timeout is reported as "may or may not have arrived — do not resend". Any other failure is reported as "NOT sent". The tool never says a viewing is booked. The website's "Book a Viewing" form only opens a `mailto:` link, and no booking API exists.

## Security and privacy

- CMS text (titles, descriptions, features) is converted to bounded plain text. Markup, scripts, zero-width and bidi-override characters are removed. Descriptions are fenced in tool output as "listing data, not instructions".
- Only URLs the server builds itself are passed on: canonical site links, `wa.me` links, https images on allow-listed hosts and YouTube links. The widget inserts text with `textContent` only and opens links through the host's `openLink`.
- Logs record tool names, outcome status, timings and HTTP status codes only. They never contain arguments, contact details, slugs, query strings, CMS bodies or IP addresses. A redaction layer also masks emails and phone numbers as a second line of defence. Tests assert this.
- Requests to `/mcp` are limited to 256 KB. A Host allow-list applies in production. The Docker image runs as a non-root user on a read-only filesystem.

## Deployment

**Production path for the current Hostinger/CloudPanel server: see [DEPLOYMENT.md](DEPLOYMENT.md)** (pm2 + the server's nginx, release tarballs, automatic rollback). The Docker/Caddy setup below is the alternative for a dedicated Docker host.

The `deploy/` folder runs the server behind Caddy, which provides automatic Let's Encrypt HTTPS. It works on any Docker host, for example a small VPS or the server that already runs the CMS.

```bash
# DNS: mcp.savoirproperties.com → server IP; ports 80/443 open
cd Savoir_MCP
cp .env.example .env    # set ALLOWED_HOSTS=mcp.savoirproperties.com (and INQUIRY_TOKEN_SECRET)
cd deploy
MCP_HOSTNAME=mcp.savoirproperties.com ACME_EMAIL=it@savoirproperties.com docker compose up -d --build
curl https://mcp.savoirproperties.com/health
```

Caddy exposes only `/mcp`, `/health`, `/ready` and `/.well-known/openai-apps-challenge`, and its access log drops URIs, headers and IPs. To use a managed container platform instead (Cloud Run, Fly.io, Railway, Render), deploy the `Dockerfile` with `HOST=0.0.0.0`, set `ALLOWED_HOSTS` to the service hostname, and keep it at **one stable hostname**, because changing the MCP URL after directory submission requires contacting OpenAI support.

CI: `.github/workflows/savoir-mcp.yml` runs typecheck, tests, build and the Docker build whenever `Savoir_MCP/**` changes.

## Known limitations

- Bedroom and bathroom filters are exact, because the CMS has no "N or more" filter. The tool description tells the model so.
- **Rent period:** shown ("/ yr", "per year") only when the CMS states it for a listing. The server reads `price_name`, or a dedicated `rent_period`/`rental_period`/`rent_frequency`/`price_period` field, and accepts only unambiguous values (yearly/annual, monthly, weekly, daily). Otherwise the price is shown as listed, "period not stated". As of 7 Oct 2026 `price_name` is empty on every sampled rent listing and missing from search results, so no period is shown yet. The website's "/ yr" is a fixed label on all rent listings, not listing data, so it isn't used.
  - **For the CMS team:** fill `price_name` (e.g. "Yearly" or "Monthly") on rent listings, and include it in `/api/search` results so map prices and cards can show it, not only details.
- One property type per search, because the CMS accepts a single type code.
- Off-plan search sorts by most recently updated only. That is a CMS limitation.

Production runbook for mcp.savoirproperties.com (hosting assessment, access/DNS needed, deploy, verify, rollback, ChatGPT test plan): [DEPLOYMENT.md](DEPLOYMENT.md). Directory submission: [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md).
