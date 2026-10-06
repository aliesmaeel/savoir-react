# Demo recording script (OpenAI review)

OpenAI requires an accessible video URL that shows the app's test cases working. Record it **in ChatGPT, against the production server** (`https://mcp.savoirproperties.com/mcp`), after the ChatGPT test table in DEPLOYMENT.md §6 has passed.

## Setup
- ChatGPT web, desktop browser at 1280–1440 px width, light theme. Show dark mode once at the end if time allows.
- Use a **fresh chat** with only the Savoir Properties plugin enabled. Close other tabs. Hide the sidebar's chat history, bookmarks and notifications.
- Record the screen with OBS, Windows Snipping Tool (screen recording) or Loom, at 1080p, with no webcam.
- Narration is optional. On-screen captions such as "Test 1 — search" make review faster.
- Target length 3–5 minutes. Don't speed it up so much that the cards can't be read.
- Show no personal data: no real phone numbers typed in, and no other conversations.

## Shots (in order, matching submission/plugin.json)

| # | Type | Prompt / action | Must be visible |
|---|---|---|---|
| 1 | Positive | `@Savoir Properties Find 2-bedroom apartments for sale in Dubai Marina.` | `search_properties` tool call, cards with photos, AED prices, "2 bedrooms", Dubai Marina |
| 2 | Positive | `Show me studios for rent, cheapest first.` | only studios, prices ascending |
| 3 | Positive | `Tell me more about the first one and show me the photos.`, then click **Details** on a card | gallery, size, amenities, reference/permit number, agent, website link |
| 3b | | Click **Website**, then **WhatsApp** on a card | savoirproperties.com listing page opens; wa.me opens with the listing URL pre-filled. Close it without sending. |
| 4 | Positive | `Which Emaar off-plan projects hand over in 2029, and what is the payment plan for the first one?` | off-plan cards, then the payment plan (as of 6 Oct 2026, Palace Residences Hillside shows 10% / 70% / 20%) |
| 5 | Positive | `How can I contact Savoir on WhatsApp about this property?` | wa.me link pre-filled with the listing, agent and company contacts, and **no** claim that a message was sent |
| 6 | Negative | `Find villas for sale on the Moon.` | a plain "no results", with no invented listings |
| 7 | Negative | `Book me a viewing for this apartment tomorrow at 5pm.` | the assistant says it can't book, and offers contact options; no booking claimed |
| 8 | Negative | (new chat) `What's the weather in Dubai today?` | no Savoir tool is called |

## After recording
1. Upload it so the link opens **without logging in**, for example as an unlisted YouTube video.
2. Put the URL in `submission/plugin.json` → `extensions.com.openai.review.demo_recording_url`.
3. Re-run `npm run submission:check`.

Live data changes. Re-check that tests 1, 2 and 4 still return results on the day you record. Prompts can be adjusted to available listings, but keep `plugin.json` in sync with what the video shows.
