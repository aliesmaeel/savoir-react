# Production deployment: mcp.savoirproperties.com (read-only launch)

**Status: live since 2026-10-06.** Read-only with inquiries disabled. v0.3.8 (v0.3.7 fix + genuinely new results still shown) deployed 2026-10-07. Real ChatGPT retest pending.

## 1. The existing server

**Verified from outside the server:**

| Fact | Source |
|---|---|
| The website, CMS and `chat.` all run on one Hostinger VPS at `31.97.190.32` | DNS A records; RIPE `HOSTINGER-HOSTING` |
| **nginx owns ports 80 and 443.** HTTP redirects to HTTPS, and a catch-all server drops unknown hostnames, including `mcp.` today | HTTP probes |
| Website deploy: GitHub Actions → SSH (`HOST`/`USERNAME`/`PASSWORD`) → `/home/savoirproperties/htdocs/savoirproperties.com/savoir-react` → `pm2 restart savoir-react` | `.github/workflows/main.yml` |
| One Let's Encrypt certificate per subdomain; IPv4 only; DNS at GoDaddy; no CAA record | TLS and DNS lookups |

**Not yet known.** The `inspect` action reports all of these read-only:

- Whether `USERNAME` is root.
- Whether the server is CloudPanel, which its paths and certificates suggest, or plain nginx.
- The exact nginx server blocks.
- Whether ports 8787 and 8887 are free.
- The Node and pm2 versions.

**Decisions that follow:**

- **Caddy is not used on this server.** `deploy/docker-compose.yml` stays only for a separate Docker host.
- The MCP server runs as its **own pm2 process `savoir-mcp`** on `127.0.0.1:8787`, from `~/savoir-mcp` (outside any web root).
- It runs as a **non-root** user. If `USERNAME` is root, the workflow runs the app as the `run_as` user, for example the website's site user `savoirproperties`.
- HTTPS comes from the **existing nginx**: a new, separate server block for `mcp.savoirproperties.com` plus its own Let's Encrypt certificate. On CloudPanel this uses the panel's own `clpctl` so the panel stays in charge. No other site's configuration is edited.
- The website's files, its `savoir-react` pm2 process and its nginx block are never touched.
- `INQUIRY_MODE=disabled` is written on first deploy and enforced: `deploy.sh` refuses any other value, and the workflow fails if a write tool appears.
- Node ≥ 20.6 is required (tested on Node 20.6.1 and 22).

## 2. GitHub Actions workflow: `.github/workflows/deploy-mcp.yml`

The workflow runs **only when triggered manually** (`workflow_dispatch`). It uses the existing secrets `HOST`, `USERNAME` and `PASSWORD`. Every action except `inspect` requires typing the action name again in **confirm**.

| Action | What it does | Changes production? |
|---|---|---|
| `inspect` | Reports OS, memory, Node/pm2, listeners on 80/443, nginx routing lines (file / listen / server_name / proxy_pass / cert path only, never full configs), CloudPanel/certbot presence, free ports 8787/8887, and the shared CMS rate-limit budget | **No** |
| `activity` | Counts only, for a UTC `window` (`YYYY-MM-DDTHH:MM/YYYY-MM-DDTHH:MM`): tool calls by name and outcome, card URIs read, MCP methods and client names, HTTP status counts. Never request contents or IPs. Use it to check a host test | **No** |
| `deploy` | Typecheck and test, package, upload over SCP, then on the server: create `~/savoir-mcp/shared/.env` from the template if missing, run `deploy.sh` (boot test on :8887, switch, pm2, automatic rollback), set up reboot persistence, then **health checks**. The public URL is checked too once it exists. | Yes: MCP only |
| `configure-https` | Root or sudo only. It first requires a healthy MCP, DNS pointing at this server, and nginx owning 80/443, and it refuses if `mcp.` is already configured differently. **CloudPanel:** `clpctl site:add:reverse-proxy` plus `clpctl lets-encrypt:install:certificate`. **Plain nginx:** one new `sites-available/mcp.savoirproperties.com.conf`, `nginx -t` before every reload (removed again if the test fails), then `certbot --nginx --redirect`. Ends with an HTTPS health check through nginx. | Yes: adds the `mcp.` site |
| `rollback` | Returns to the previous healthy release, or `rollback_to`, then health checks | MCP only |
| `stop` | Stops `savoir-mcp`. The website is unaffected. | MCP only |

User inputs reach the server only as validated environment variables (`envs:`), never as text pasted into the script. The remote script always runs under bash from a temp file.

**How this was tested** (all locally; no production access was used):

- **Linting:** actionlint passes for both workflows, and shellcheck passes for all four server scripts.
- **The workflow's own server script, extracted verbatim and run in a Debian container that mirrors this server:**
  - Setup: root SSH login under `/bin/sh`; a stand-in `savoir-react` pm2 process run by root; nginx owning port 80 with the website's server block and the catch-all drop.
  - `inspect`: passed.
  - `deploy` as root without `run_as`: correctly refused.
  - `deploy` as root with `run_as`: passed, with all checks green.
  - `configure-https`: refused with no DNS, refused with a DNS mismatch, refused with certbot missing (no file written). Otherwise it wrote the server block, passed `nginx -t`, reloaded, and called certbot with the right arguments. The MCP was reachable through nginx while the website's block and the catch-all were unchanged, and a re-run was idempotent.
  - `rollback` and `stop`: passed.
  - Non-root SSH user without sudo: `configure-https` refused with a clear message.
  - The website stand-in stayed `online` with **0 restarts** throughout.
  - The simulation found and fixed 4 bugs along the way.
- **Not testable locally:** issuing the real Let's Encrypt certificate and the CloudPanel `clpctl` path. Those can only be proven on the real server.

## 3. Still missing (access and DNS only)

1. **DNS:** an A record at GoDaddy, `mcp` → `31.97.190.32`, TTL 600. Required before `configure-https`, not before `deploy`.
2. **Is `USERNAME` root?** Unknown. `inspect` prints it.
   - If it is root, you choose `run_as`. The website's site user is probably `savoirproperties`, and `inspect` shows candidates.
   - If it is not root, the app runs as that user, and `configure-https` additionally needs **root or passwordless sudo**. Without that, whoever administers CloudPanel creates the site by hand: **Sites → Add Site → Reverse Proxy**, domain `mcp.savoirproperties.com`, URL `http://127.0.0.1:8787`, then **SSL/TLS → New Let's Encrypt Certificate**.
3. **`acme_email`:** only needed if `inspect` shows plain nginx with certbot (it's the Let's Encrypt contact). Not needed for CloudPanel.
4. **Approval to push.** GitHub only lets you run a manual workflow when the workflow file exists on the **default branch (`main`)**. But any push to `main` triggers the existing website deploy, which ends in `pm2 restart savoir-react`. So:
   - Commit `Savoir_MCP/`, `.github/workflows/deploy-mcp.yml`, `.github/workflows/savoir-mcp.yml` and the three small website config changes to a branch, `savoir-mcp`.
   - Put `deploy-mcp.yml` on `main` in **a single commit whose message contains `[skip ci]`**, so the website deploy does **not** run.
   - Run the workflow with **Use workflow from: `savoir-mcp`**.
   - Merge the branch into `main` later, following your normal process. That merge *will* run the usual website deploy, which is unaffected by these changes: the website typechecks, tests and builds with them, as verified locally.

No other credentials are needed, and none should be shared in chat.

## 4. Sequence, after your approval

1. **Push** as described in §3.4.
2. **Inspect** (read-only): Actions → *Deploy Savoir MCP (manual)* → Run workflow → branch `savoir-mcp`, action `inspect`, plus `run_as` if you already know `USERNAME` is root. We review the output together and confirm CloudPanel vs plain nginx, `run_as`, and the free ports.
3. **DNS:** add the A record. Check with `nslookup mcp.savoirproperties.com 8.8.8.8`, which should return `31.97.190.32`.
4. **Deploy:** action `deploy`, confirm `deploy`. Expect green server-local checks and an "https not served yet" notice.
5. **HTTPS:** action `configure-https`, confirm `configure-https`. Expect the public verification `All required checks passed`, run by `npm run verify:deployment` inside the workflow.
6. **ChatGPT:** connect and test (see §6).

## 5. Rollback and removal

| Situation | How |
|---|---|
| A bad release | Action `rollback`, confirm `rollback`. A failed deploy already rolls back automatically. |
| A specific release | `rollback` with `rollback_to=<YYYYMMDDHHMMSS>`. On the server, `bash ~/savoir-mcp/current/deploy/server/rollback.sh --list` shows them. |
| Take the MCP offline | Action `stop` |
| Remove HTTPS site (CloudPanel) | `clpctl site:delete --domainName=mcp.savoirproperties.com --force`, as root |
| Remove HTTPS site (plain nginx) | `rm /etc/nginx/sites-enabled/mcp.savoirproperties.com.conf /etc/nginx/sites-available/mcp.savoirproperties.com.conf && nginx -t && systemctl reload nginx && certbot delete --cert-name mcp.savoirproperties.com` |
| Remove everything | The above, plus `pm2 delete savoir-mcp && pm2 save` as the app user, `rm -rf ~/savoir-mcp`, removing the `@reboot pm2 resurrect` crontab line if the workflow added it, deleting the GoDaddy `mcp` record, and removing the ChatGPT connection |

None of these touch `savoir-react`, the website's or CMS's nginx blocks, or their certificates.

## 5b. Separate test instance (`target: test`)

This runs a second, independent copy of the server for trying changes in ChatGPT. It **never touches production**.

| | Production | Test |
|---|---|---|
| URL | `https://mcp.savoirproperties.com/mcp` | `https://mcp-test.savoirproperties.com/mcp` |
| pm2 process | `savoir-mcp` | `savoir-mcp-test` |
| Port (loopback) | 8787 (boot test 8887) | 8797 (boot test 8897) |
| App root, settings, data | `~/savoir-mcp`, own `shared/.env` and `shared/data` | `~/savoir-mcp-test`, own `shared/.env` (written by `deploy/server/test-env.sh`, never copied from production) and `shared/data` |
| CloudPanel site user | `savoir-mcp-proxy` | `savoir-mcp-test-proxy` |
| Inquiries / staff dashboard | disabled / off | disabled / off (deploy refuses a dashboard password on test) |
| Map | off | MapLibre + OpenFreeMap (`MAP_ENGINE=maplibre`) |
| CMS budget | 20 requests a minute | 10 requests a minute. Both share the server's IP and the CMS limit |

- **Allowed actions** for `target: test`: `inspect`, `deploy`, `configure-https`, `rollback`, `stop`. The challenge token, widget domain, log rotation and user creation stay production-only.
- **Setup order:**
  1. Add a GoDaddy `A` record `mcp-test` with the same value as the existing `mcp` record.
  2. Run `deploy` with `target: test`.
  3. Run `configure-https` with `target: test`. This creates a separate CloudPanel reverse-proxy site and certificate.
- **Removal:**
  1. Run `stop` with `target: test`.
  2. As the app user: `pm2 delete savoir-mcp-test && pm2 save` and `rm -rf ~/savoir-mcp-test`.
  3. As root: `clpctl site:delete --domainName=mcp-test.savoirproperties.com --force`.
  4. Delete the `mcp-test` DNS record and the ChatGPT test app.

## 6. ChatGPT end-to-end (after HTTPS is live)

1. In ChatGPT, go to **Plugins → + → Add custom MCP server**. Name: `Savoir Properties`. URL: `https://mcp.savoirproperties.com/mcp`. Authentication: **None**. Then **Create as a plugin**.
2. Start a new chat, type `@`, and choose **Savoir Properties**.
3. Run the test table below and record the **host** for every row. The browser preview harness and the MCP-client tests **do not count** as ChatGPT or Claude end-to-end tests.

| # | Prompt / action | Expected | Host | Result |
|---|---|---|---|---|
| 1 | "Show me 2-bedroom apartments for sale in Dubai Marina" | cards with photos, AED prices, location | ChatGPT web | |
| 2 | "Studios for rent, cheapest first" | studios only, prices ascending | ChatGPT web | |
| 3 | **Details** on a card | gallery, facts, amenities, agent | ChatGPT web | |
| 4 | **Website** and **WhatsApp** buttons | savoirproperties.com and a pre-filled wa.me link open | ChatGPT web | |
| 5 | **More results**, then **← Back to results** | page 2 loads, and Back works | ChatGPT web | |
| 6 | **Ask Savoir** | a follow-up message appears; nothing is sent to Savoir | ChatGPT web | |
| 7 | "Which Emaar off-plan projects hand over in 2029? Payment plan?" | off-plan cards, then the payment plan split | ChatGPT web | |
| 8 | "Find villas on the Moon" | a plain "no results" | ChatGPT web | |
| 9 | "Show details for property slug abc-does-not-exist" | "not found", with no server internals | ChatGPT web | |
| 10 | "Book me a viewing tomorrow at 5pm" | says it can't book, and offers contact links | ChatGPT web | |
| 11 | Repeat test 1 in dark mode | readable cards | ChatGPT web | |
| 12 | Repeat tests 1, 3 and 4 on the mobile app | renders, and links open | ChatGPT iOS/Android | |
| 13 | **Error path:** run action `stop`, ask a search, then restore with `rollback` + `rollback_to=<current release>` (or `deploy`) | ChatGPT reports the service is unavailable, not "no results" | ChatGPT web | |

### Host test log

| Date (Dubai) | Server | Host | Test | Result | Evidence |
|---|---|---|---|---|---|
| 2026-10-06 18:32 | v0.3.0 | ChatGPT web (Chrome) | 1, plus a comparison follow-up | **FAIL (UI).** Tool calls returned correct data, and ChatGPT wrote a text comparison table. Each tool row showed "Couldn't open … / Retry" with a "CSP off" chip. No cards rendered (no photos, heart or compare buttons) | Screenshot from Savoir; chat "Compare Dubai Apartments" |
| 2026-10-06 ~18:56 | v0.3.1 | ChatGPT web (Chrome) | "Save these two to my shortlist and give me a share link" | **FAIL (shortlist).** ChatGPT replied that the connection (named "Savoir Privé Properties" in its reply) has no shortlist or share-link action | Screenshot from Savoir. Server activity 14:00–15:30 UTC (workflow `activity` run 37484225475): **every** `update_shortlist`/`share_shortlist`/`compare_listings` call came from our own two smoke runs (2 each); ChatGPT called none of them. After the v0.3.1 deploy, ChatGPT read `ui://savoir/listings-v1.html`, the URI that only the **v0.1** tool list references. Conclusion: ChatGPT is still using its cached v0.1 tool list (5 tools); the server offers all 12 |
| 2026-10-06 ~20:26–20:31 | v0.3.4 | ChatGPT web | Button test after redesign | **FAIL (some buttons).** Reported by Savoir: some buttons do nothing | `activity` (counts only): in that window ChatGPT called search ×1, get_property_details ×2, update_shortlist ×2, get_shortlist ×2, share_shortlist ×3, prepare_inquiry ×2, all `ok`, so tool-backed buttons reached the server. **Zero `/go/` requests all day.** This is not proof that every link failed: the click may not have reached our server for other reasons (host handling, prefetch filtering, a tracking problem). On 2026-10-06 after the v0.3.5 deploy, `/go/` redirects were checked directly: Website and WhatsApp return 302 to the right targets, and a tampered token returns 404. Control run of the v0.3.4 build in a simulated host that ignores requests: an unanswered link request does nothing, and an unanswered tool call leaves the card dimmed with "Loading…" and every button disabled. Fixed in v0.3.5 (time limits, `window.openai.openExternal` first, visible fallbacks with reason codes) |
| 2026-10-06 ~21:00 | v0.3.5 | ChatGPT web | Full button retest | **PASS (reported by Savoir).** Savoir reports all tests now work | `activity` 16:55–17:1x UTC: search ×3, update_shortlist ×2, get_shortlist ×2, share_shortlist ×2, prepare_inquiry ×1, compare_listings ×1, card reads ×2; all `ok` |
| 2026-10-07 ~10:06 | v0.3.5 | ChatGPT web | Comparison card → **Message about these** | **FAIL (one button).** Savoir reports nothing happens | `activity` 06:00–06:07 UTC: `prepare_inquiry` ×2, both `ok`, so the click reached the server and the message was prepared. Cause reproduced in the simulated ChatGPT-like host: ChatGPT fires `openai:set_globals` on every global change (height, widget state, theme) and the card re-rendered the original tool result each time, undoing the navigation. Fixed in v0.3.6 (render a tool result once; ignore non-result global updates; new views scroll into view; sticky notices; visible error for unexpected UI errors) |
| 2026-10-07 ~10:25 | v0.3.6 | ChatGPT web | Results → **Details**; comparison → **Message about these** | **FAIL.** Loading shows, then the previous screen returns; no error | `activity` 06:18–06:28 UTC overlapped with our own post-deploy audit, so it cannot attribute calls exactly. Counts beyond our known calls suggest the clicks reached the server and returned `ok`. Reproduced in the simulated ChatGPT-like host when global updates carry a **full snapshot with a re-serialised copy of the original tool output** (v0.3.6 compared results as exact text): the requested view appears, loading clears, then the original result is drawn over it. Not confirmed in ChatGPT itself. Fixed in v0.3.7 (results compared by content; host deliveries never replace a view the customer opened; the opened view is saved in widget state and reopened after a card reload; actionable error if drawing fails). Logs now label calls by caller (`agent=openai` vs `script`) |

**Root cause (most likely; not yet confirmed in ChatGPT):**
- **Cached metadata.** v0.3.0 renamed the card resource from `ui://savoir/listings-v1.html` (v0.1) to `listings-v2.html`, and the server stopped serving v1 (the post-deploy verifier got "Resource not found" for v1). ChatGPT caches a connector's tool metadata, so a cached tool still points at the old URI. When that URI can't be read, the card can't open even though the tool call succeeds. OpenAI's community forum reports this exact symptom after a URI change ("Failed to fetch template"; thread 1380454, May 2026).
- **Weaker contributing factor.** ChatGPT has been reported to ignore the standard `ui.csp` unless the legacy `openai/widgetCSP` is also present (thread 1374446). That could explain the "CSP off" chip. The meaning of that chip is not documented, so this is unconfirmed.

**Checked and found correct (production v0.3.0 vs the official OpenAI UI docs):**
- MIME type is `text/html;profile=mcp-app`.
- Tools carry `_meta.ui.resourceUri` and the `openai/outputTemplate` alias.
- The resource is listed in `resources/list` and `_meta.ui.csp` is present on both the list entry and the read contents.
- The HTML is self-contained, with no external scripts or styles.

**Fix (v0.3.1):**
- Serve the v1 URI again, with identical content, alongside v2.
- Add the `openai/widgetCSP`, `openai/widgetPrefersBorder` and `openai/widgetDescription` aliases.
- Log which card URI a host reads (`mcp.resource.read`, URI only) so the next host test has server evidence.
- Keep `ui.domain` unset (it defaults to the ChatGPT sandbox). It is **required before directory submission** and is configured with `WIDGET_DOMAIN`.

**Fix for the shortlist failure:** a full reconnect of the ChatGPT app (Refresh alone did not update the tool list). From v0.3.2 the server logs each `initialize` with the client's name and version, plus each `tools/list`, so the `activity` action can confirm the reconnect fetched the new list.

**ChatGPT shortlist test: pass criteria (all must be observed in ChatGPT, not in the preview harness):**
1. Tap ♡ on a card → "Saved to your shortlist." appears, the heart fills, and "My shortlist (1)" updates.
2. "My shortlist" opens the list. **Remove** works and the count drops.
3. **Create share link** → **Copy link** shows "Copied" (or the manual-copy message), and the link opens the Savoir page in a normal browser.
4. In the same chat, "Show my shortlist" reopens the same listings.
5. The `activity` action shows `update_shortlist`, `get_shortlist` and `share_shortlist` calls in the test window.

**Hosts tested so far: ChatGPT web: passing on v0.3.5 (reported by Savoir, server log consistent). Earlier failures: UI on v0.3.0, shortlist on v0.3.1, some buttons on v0.3.4.** No Claude test yet.
