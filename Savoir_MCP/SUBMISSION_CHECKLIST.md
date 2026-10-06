# ChatGPT directory submission: read-only launch

Scope: the five read-only tools, with `INQUIRY_MODE=disabled`. **Nothing is submitted until you approve.** Requirements come from developers.openai.com/plugins/deploy/submission and /plugins/plugin-guidelines (checked 6 October 2026). Re-check them on the day you submit.

## Status at a glance

| Area | Status |
|---|---|
| Production server `https://mcp.savoirproperties.com/mcp` | ✅ live, HTTPS (Let's Encrypt, CloudPanel), public verifier passes |
| Plugin connects in ChatGPT | ✅ reported by you, 6 Oct 2026 |
| ChatGPT end-to-end test table (DEPLOYMENT.md §6) | ⬜ **results not recorded yet.** Required before the demo video |
| Review test cases (5 positive, 3 negative) | ✅ written; all positive cases return real data on 6 Oct 2026 |
| Package metadata and limits | ✅ validated by `npm run submission:check` |
| Domain verification | ⬜ needs the token from the OpenAI Platform; then run workflow action `set-challenge-token` |
| Company verification | ⬜ Savoir action |
| Terms of Use page | ⬜ draft ready → legal review → publish at `/terms` |
| Privacy Policy update | ⬜ draft section ready → legal review → publish |
| Log retention matching the privacy text | ⬜ needs approval for a small server change |
| Logo | ⬜ square logo needed from the brand owner |
| Demo video | ⬜ script ready; record after the ChatGPT tests pass |
| Category, developer name | ⬜ fill in from the dashboard / verification |

## 1. Company verification (OpenAI Platform). Savoir must do this.
1. Decide which **OpenAI Platform organisation** owns the app. It must be a company organisation, not a personal account. The person who submits must be an **owner** or hold **Apps Management Write**.
2. Complete **business verification** in that organisation's settings. Have ready the legal entity name exactly as on the trade licence, the registered address, and the documents OpenAI requests during the flow.
3. Copy the verified name into `submission/plugin.json` → `interface.developerName` (at most 80 characters). The directory displays this name.
4. **Domain verification:**
   - In the portal, start MCP domain verification for `mcp.savoirproperties.com` and copy the token.
   - Run *Deploy Savoir MCP (manual)* with action `set-challenge-token`, confirm `set-challenge-token`, `run_as=savoir-mcp`, and paste the token into `challenge_token`. It publishes the token at `https://mcp.savoirproperties.com/.well-known/openai-apps-challenge` and checks it publicly. Or send me the token and I'll run it.
   - Click **Verify** in the portal.

## 2. Legal pages. Savoir's counsel must approve.
- **Terms of Use:** `submission/legal/terms-of-use.DRAFT.md`. Counsel fills in the legal entity, trade licence, liability clause and forum, then it's published at `https://savoirproperties.com/terms`. That needs a new website route and a normal website deploy; I can implement it once the text is approved. Then set `interface.termsOfServiceURL`.
- **Privacy Policy:** `submission/legal/privacy-policy-ai-app-section.DRAFT.md` is a new section for `/privacy-policy`. It states exactly what the deployed app receives and logs, including that **web server logs contain IP addresses (normally OpenAI's servers)**, and gives a concrete retention period. Also replace the existing policy's vague "as long as necessary" with real periods.
- **Retention must be true:** today the pm2 logs for `savoir-mcp` grow without limit. With your approval, I'll set up log rotation (pm2-logrotate for the `savoir-mcp` user, 30 days) so the policy's retention statement is accurate. CloudPanel's nginx logs for the `mcp.` site follow CloudPanel's rotation, which should be confirmed in CloudPanel too.
- The support URL `https://savoirproperties.com/contact-us` is fine as it is.

## 3. Branding. The brand owner must supply these.
- **Logo:** a square PNG, 512×512 recommended (minimum 48×48, at most 5 MiB). It should stay legible on light and dark backgrounds and at small sizes. Save it as `submission/assets/logo.png`. The website's current logos (184×57 wordmarks, 32×32 favicon) don't qualify.
- **Listing text** in `plugin.json` for marketing and legal sign-off:
  - display name "Savoir Properties" (30 characters max)
  - subtitle "Dubai homes & off-plan" (30 max)
  - the long description
  - 3 default prompts
  - brand colour #2B2B2B
- **Category:** pick it from the dashboard list (Lifestyle or Real estate, if offered).
- **Optional:** screenshots **taken in ChatGPT** (not from the local preview harness).

## 4. Demo recording. You record it, following my script.
- Follow `submission/demo-recording-script.md`: 8 shots matching the test cases, 3–5 minutes, ChatGPT web, no personal data.
- Upload it so it opens without a login (an unlisted YouTube video works), then set `review.demo_recording_url`.

## 5. Final assembly. I'll do this once the inputs above exist.
1. Fill in `developerName`, `category`, `termsOfServiceURL`, `demo_recording_url`, and add `assets/logo.png`.
2. Run `npm run submission:build`. It validates all limits, fetches every URL, checks the live server, and writes `submission/dist/savoir-properties-plugin.zip`. **It does not upload anything.**
3. At platform.openai.com/plugins: upload the ZIP, wait for the automated tool scan, resolve any setup or validation errors, and complete the **Metadata & Skills** and **MCPs** checks.
4. **Stop and get your approval** before clicking **Submit for review** and completing the attestations.

## Attestation reference
- All five tools: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: false`. They read only Savoir's own bounded catalogue.
- No write tool is advertised. `INQUIRY_MODE=disabled` is enforced by `deploy.sh` and by the workflow's health checks.
- Commerce: **false**. There are no payments and no checkout links.
- No authentication: the listings are public, so no reviewer test account is needed.
- Widget CSP: `connectDomains: []`, and `resourceDomains` covers only the 3 image hosts.

## Related, not blocking submission
- The CMS team should turn off Laravel debug mode, since reviewers may probe invalid inputs, and should exempt the server IP from the rate limit. About 13 of the 60 requests per minute are already used by other apps on the server.
- GitHub has deprecated the Node 20 runtime used by `actions/checkout@v4` and `setup-node@v4`. Update the workflow later.
