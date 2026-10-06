# Milestone 2: business analytics and insights (v0.3.0)

**Status: built and verified locally. Not deployed.** It includes Milestone 1 (v0.2.0).

## What Savoir gets
- **A funnel:** searches → detail views → comparisons → shortlist saves/shares → messages prepared → WhatsApp clicks → inquiries submitted. Link clicks (intent) are **kept separate from delivered leads**.
- **Demand insight:** the most requested areas with no-match rates, and budget bands flagged **underserved** (at least 10 searches and 40% or more without an exact match). That's a direct signal for which listings to source.
- **Listing interest:** detail views, shortlist saves, comparisons, messages and clicks per listing.
- **Search-to-contact trend** by day, clicks by channel and source, and **campaign codes** the customer mentions.
- **Sample sizes on every rate**, with "low sample" flagged under 30, plus a written limitations section.

## How
- **Aggregate counters** (`src/analytics.ts`): per Dubai day, per event and per low-cardinality dimensions, plus per public listing. There is no conversation text, personal data, identifier, IP or exact time. Values that don't look like vocabulary, or that contain 7 or more digits, are stored as `other`. Data is kept for 400 days, with atomic writes and file mode 600.
- **Signed click links** (`/go/<token>`): HMAC-signed and allow-listed (the Savoir website and `wa.me`), so there's no open redirect. Bots and prefetches are not counted, and tokens never appear in logs.
- **Staff access:**
  - `node dist/cli/insights.js` on the server, or `npm run insights` locally, writes an HTML report.
  - The optional dashboard is at `/internal/insights`, using HTTP Basic auth against a scrypt hash. It's disabled unless configured, and five failed attempts block for 15 minutes.
- **No analytics through MCP tools**, which is enforced by a test.
- The observability matrix per host is in [ANALYTICS.md](ANALYTICS.md).

## Verification
- **17 test files, 148 tests, all passing**, with a clean typecheck and build. The tests cover:
  - dimension sanitising, daily buckets, caps, retention and corrupt files;
  - link signing, tamper rejection and the open-redirect guard;
  - bot detection;
  - report maths (period filter, rates, underserved logic, ranking, escaping);
  - scrypt verification;
  - end to end: a full journey stores no email, phone, free text, shortlist ID or reference code; clicks are counted, bots are not, and a tampered link gets 404; links are plain with analytics off; no analytics tool is exposed; the dashboard's 404/401/200/429 behaviour.
- **Live local runs** against the production CMS: the journey smoke (11/11) and the browser scenarios in the **simulated** MCP Apps host (18/18, including the counted WhatsApp redirect). The dashboard renders from the resulting data, and a scan of the stored file found no personal data.
- **Linux server simulation of the upgrade from a v0.1-style `.env`:**
  - The deploy adds `PUBLIC_MCP_URL` and generates `ANALYTICS_LINK_SECRET` **on the server**, never printed.
  - `.env` stays at `600`.
  - Click links survive a restart.
  - Metrics persist.
  - The report runs on the server from `dist/`.
- **Not tested yet:** ChatGPT and Claude. In particular, whether those hosts open the exact `/go/` URL that a card provides must be checked there.

## Cost
**None new.** The data is one small JSON file, typically a few hundred KB a year at this traffic, on the existing VPS.

## Before deploying
- **Optional:** set `INSIGHTS_USER` and `INSIGHTS_PASSWORD_HASH` in `shared/.env` to enable the dashboard. Run `npm run insights:hash-password` locally and paste only the hash.
- **Legal:** the privacy draft now covers shortlists, usage statistics (up to 13 months, no personal data), and the fact that **button clicks and share-page visits come from the customer's own device, so web-server logs record their IP address**. Counsel should approve this before launch.
