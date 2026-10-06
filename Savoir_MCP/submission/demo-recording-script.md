# Demo recording script (OpenAI review)

OpenAI requires a video URL that shows the app's test cases working. Record it **in ChatGPT, against the production server** (`https://mcp.savoirproperties.com/mcp`), after the card domain (`ui.domain`) is live and the app has been refreshed, so the video shows exactly what reviewers will see.

## Setup
- ChatGPT web on a desktop browser, 1280–1440 px wide, light theme.
- A **new chat** with only Savoir Properties selected (type `@` and choose it). Close other tabs, and hide chat history, bookmarks and notifications.
- Record the screen at 1080p with no webcam, using OBS, the Windows Snipping Tool (screen recording) or Loom.
- Narration is optional. Short captions such as "Test 1: search" make review faster.
- Aim for 3–5 minutes. Don't speed it up so much that the cards can't be read.
- Show no personal data: don't type real phone numbers or emails, and don't show other conversations.

## Shots, in the order of `submission/plugin.json`

| # | Type | Prompt or action | Must be visible |
|---|---|---|---|
| 1 | Positive | `Find 2-bedroom apartments for sale in Dubai Marina.` | Cards with photos, AED prices, "For sale · Ready", Details and WhatsApp buttons, and "My shortlist (0)" |
| 2 | Positive | `Tell me more about the first one.` (or click **Details**) | Photo gallery (click the arrow once), price per sq ft, status, **Contact Savoir**, and **More details** opened to show the reference and permit numbers |
| 3 | Positive | `Compare the first two listings for me.` (or tick **Compare** on two cards, then **Compare (2)**) | Comparison table; click **Show all details** once |
| 4 | Positive | `Save the first two to my shortlist and give me a share link.` (or click ♡ on two cards, then **My shortlist**, then **Create share link**) | "Saved to your shortlist.", "My shortlist (2)", the share link; click **Open link** and show the read-only Savoir page in the browser, then come back |
| 5 | Positive | `I'd like to contact Savoir about these two listings.` (or **Ask about my shortlist**) | The prepared message with its SAV- reference; click **Send on WhatsApp**, show that wa.me opens with the message, and close it **without sending** |
| 6 | Negative | `Find villas for sale on the Moon.` | No invented listings; an honest "no match" |
| 7 | Negative | `Book me a viewing for this apartment tomorrow at 5pm.` | The assistant says it can't book, and offers to prepare a message instead; no booking is claimed |
| 8 | Negative | In a **new chat**: `What's the weather in Dubai today?` | No Savoir tool is called |

Optional (if time allows): `Off-plan projects under AED 1.5M with payment plans`, open one, enter a unit price and click **Calculate**.

## After recording
1. Upload the video so the link opens **without logging in**, for example as an unlisted YouTube video.
2. Send me the link. I'll put it in `submission/plugin.json` → `review.demo_recording_url` and re-run the checks.

Live listings change. On the day you record, check that tests 1–5 still return results. Prompts can be adjusted to what's available, but `plugin.json` must then match what the video shows; tell me and I'll update it.
