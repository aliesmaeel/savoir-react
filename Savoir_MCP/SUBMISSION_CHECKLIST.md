# ChatGPT directory submission

**Scope:** v0.3.5 with 12 tools and online inquiries disabled (`INQUIRY_MODE=disabled`); the staff dashboard stays off. **Nothing is submitted until you approve.**

Requirements come from developers.openai.com/plugins/deploy/submission and /plugins/reference (checked 6 October 2026). Re-check them on the day you submit.

`npm run submission:check -- --check-urls` validates the package and checks the live server and the published pages. It lists every open item.

## Status

| Item | Status | Who |
|---|---|---|
| Production server v0.3.5 | ✅ live, health and verifier pass | — |
| ChatGPT web test | ✅ reported passing by Savoir on 6 Oct 2026; the server log confirms the calls (17:00–17:10 UTC) | — |
| Listing text, 5 positive and 3 negative test cases | ✅ updated for the 12 tools, and validated | Savoir to read and approve the wording |
| 1. Company verification, which sets `developerName` | ⬜ | Savoir, on the OpenAI Platform |
| 2. Domain verification token | ⬜ | Savoir copies the token; I publish it (`set-challenge-token`) |
| 3. Card domain `ui.domain` (required for apps with UI) | ⬜ prepared (`widget-domain-on`, undo `widget-domain-off`) | Your approval → I run it → you refresh ChatGPT and recheck the cards |
| 4. Log retention matching the privacy text (30 days) | ⬜ prepared (`log-rotation`) | Your approval → I run it |
| 5. Terms of Use page at `/terms` | ⬜ draft updated | Counsel approves → I add the page to the website (website deploy needs your approval) |
| 6. Privacy Policy section | ⬜ draft updated | Counsel approves → I add it to `/privacy-policy` |
| 7. Logo (square, 512×512) | ⬜ candidate in `submission/assets/logo-candidate.png` | Brand owner approves or supplies one |
| 8. Category | ⬜ | Savoir picks it from the dashboard list |
| 9. Demo video | ⬜ script in `submission/demo-recording-script.md` | Savoir records it after step 3 |
| 10. Final ZIP, then the dashboard upload | ⬜ | I build it; you upload, and I check the automated findings with you |
| 11. Submit for review | ⬜ | **Your approval only** |

## Attestation reference (live annotations, 6 Oct 2026)
- **Read-only:** `search_properties`, `get_property_details`, `search_offplan_projects`, `get_offplan_project_details`, `get_contact_options`, `get_area_guide`, `compare_listings`, `get_shortlist` and `prepare_inquiry`. `prepare_inquiry` only composes a message; nothing is sent.
- **Write (anonymous shortlist only, no personal data):**
  - `update_shortlist`: not destructive.
  - `share_shortlist`: not destructive; open-world, because it creates a public read-only link.
  - `delete_shortlist`: destructive.
- **Not advertised:** `submit_property_inquiry`. `INQUIRY_MODE=disabled` is enforced by `deploy.sh` and by the workflow health checks.
- **Commerce:** false. No payments, no checkout.
- **Authentication:** none. The listings are public, so no test account is needed.
- **Card CSP:**
  - `connectDomains: []`;
  - `resourceDomains`: the 3 image hosts and savoirproperties.com (for the logo);
  - `clipboardWrite` permission requested.
- **Data:** see the privacy section.
  - Shortlists are kept 30 days after the last change.
  - Usage statistics are daily totals with no personal data, kept 13 months.
  - Clicks and share-page visits come from the customer's device, so the web server logs their IP address.

## Related, not blocking
- Ask the CMS team to turn off Laravel debug mode (reviewers may probe invalid inputs) and to exempt the server IP from the 60-requests-per-minute limit.
- GitHub has deprecated the Node 20 runtime used by `actions/checkout@v4` and `setup-node@v4`. Update the workflow later.
- Claude is not tested. Setting `ui.domain` targets ChatGPT; test Claude separately before promoting the app there.
