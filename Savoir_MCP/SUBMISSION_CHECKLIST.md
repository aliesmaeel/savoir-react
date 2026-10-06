# ChatGPT directory submission: read-only launch

Scope: the five read-only tools, with `INQUIRY_MODE=disabled`. **Do not submit for review until every item below is done and the ChatGPT tests in DEPLOYMENT.md §7 have passed.** The requirements come from developers.openai.com/plugins/deploy/submission and /plugins/plugin-guidelines (checked October 2026). Re-check them before you submit.

## Package (prepared)

- `submission/plugin.json`: the listing metadata, 5 positive and 3 negative test cases, `commerce: false` and release notes.
- `submission/mcp.json`: `streamable-http` → `https://mcp.savoirproperties.com/mcp`.
- `submission/assets/logo.png`: **missing** (see Branding below).
- Run `npm run submission:check -- --check-urls` to validate every documented limit, the test-case shape and tool names, the URLs, the logo and live server health. Run `npm run submission:build` to write `submission/dist/savoir-properties-plugin.zip`. It builds **only** when there are zero issues, and it uploads nothing.

Current validator output: **6 issues.** The developer name, category, terms URL, demo video, logo and live server are all pending. Everything else passes, including the character limits, test cases and tool names.

## Remaining company tasks

### Company verification (OpenAI Platform)
1. Decide which OpenAI Platform organisation owns the app. It must be the company's, not a personal account.
2. Complete **business verification** in that organisation's settings.
3. The submitter must be an organisation **owner** or hold **Apps Management Write**.
4. Put the exact verified name into `interface.developerName` (at most 80 characters).
5. Domain verification happens after deployment. Paste the portal's token into `OPENAI_APPS_CHALLENGE_TOKEN` in the server's `shared/.env`, redeploy or restart, then click verify. The token is served at `https://mcp.savoirproperties.com/.well-known/openai-apps-challenge`.

### Terms and privacy
6. **Terms of Service:** publish a page. `https://savoirproperties.com/terms` currently returns 404, even though the website's forms already say "I agree with Terms of Use". This is a website change (a new route) and needs legal text from Savoir. Then set `termsOfServiceURL`.
7. **Privacy policy** (https://savoirproperties.com/privacy-policy exists). OpenAI requires it to cover data categories, purposes, recipients, **retention timelines** and user controls. Gaps:
   - Retention is only "as long as necessary". Give concrete periods.
   - It doesn't mention the ChatGPT/Claude app. For the read-only launch, add a short section: the app receives only search criteria (area, budget, bedrooms…), **collects no names, emails or phone numbers**, and keeps operational logs without personal data or IP addresses. Data the user shares with ChatGPT or Claude is governed by OpenAI's or Anthropic's policies.
   - Inquiries via the app need their own clause later, before `INQUIRY_MODE=live`.
8. **Support URL:** `https://savoirproperties.com/contact-us` is used. Optionally create a dedicated support email for the app.

### Branding
9. **Logo:** a square PNG, 512×512 recommended (minimum 48×48, at most 5 MiB), saved as `submission/assets/logo.png`. The site's current logos are 184×57 wordmarks and the favicon is 32×32, so a square mark is needed from the brand owner.
10. Confirm the display name "Savoir Properties", the subtitle "Dubai homes & off-plan" and the long description in `plugin.json`. Marketing and legal should review them for accuracy.
11. Pick the **category** from the dashboard's list (Lifestyle or Real estate, if offered).
12. Optional: screenshots taken **from ChatGPT** after deployment, and a brand colour (#2B2B2B is set).

### Demo video
13. Record a walkthrough **in ChatGPT against the production server** that covers all 5 positive and 3 negative test cases: cards, Details, Website and WhatsApp buttons, off-plan payment plan, no-results, "can't book a viewing", and an unrelated prompt.
14. Upload it (unlisted YouTube, Vimeo or similar). The link must open without logging in. Set `review.demo_recording_url`.

### Before submitting
15. All rows in the DEPLOYMENT.md §7 test table pass, with the host recorded for each.
16. `npm run submission:build` succeeds.
17. On platform.openai.com/plugins: upload the ZIP, wait for the **automated tool scan**, resolve all setup and validation errors, and complete the **Metadata & Skills** and **MCPs** checks. **Stop there.** Submitting for review is a separate decision.
18. The CMS team turns off Laravel debug mode, because reviewers may probe invalid inputs, and exempts the server IP from the rate limit.

## Annotations (for the attestations)
All five tools: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: false`. They only read Savoir's own bounded catalogue. No write tool is advertised while `INQUIRY_MODE=disabled`, and `deploy.sh` refuses any other mode.
