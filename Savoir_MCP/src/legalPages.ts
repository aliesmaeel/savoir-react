/**
 * Public legal pages for the directory listing: /terms and /privacy.
 * Static text, approved for publication by Savoir on 22 October 2026 (not yet reviewed by counsel).
 * Keep /privacy true: if inquiries, logging, retention or third parties change, update it first.
 */

const UPDATED = "22 October 2026";
const COMPANY = "Savoir Privé Properties L.L.C.";
const LICENCE = "572695";
const ADDRESS = "Emaar Business Park, Building 4, Office 502, Sheikh Zayed Road, Dubai, United Arab Emirates";
const CONTACT = `info@savoirproperties.com · +971 50 507 4686 · ${ADDRESS}`;

export const LEGAL_PAGE_CSP = "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

const STYLE = `
:root{color-scheme:light dark;--bg:#fff;--fg:#1c1b1a;--muted:#6e6a64;--line:#ebe7e1;--gold:#a8834a}
@media (prefers-color-scheme:dark){:root{--bg:#1c1c1c;--fg:#f2efea;--muted:#a9a39b;--line:#353330;--gold:#d2b07c}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:760px;margin:0 auto;padding:28px 18px 56px}
.brand{font-weight:650;letter-spacing:.02em}.brand b{color:var(--gold)}
h1{font-size:28px;line-height:1.25;margin:22px 0 4px;letter-spacing:-.01em}
h2{font-size:18px;margin:28px 0 6px}
.muted{color:var(--muted);font-size:14px}
ul{padding-left:20px;margin:6px 0}li{margin:4px 0}
a{color:inherit;text-decoration-color:var(--gold);text-underline-offset:3px}
a:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
footer{margin-top:40px;padding-top:16px;border-top:1px solid var(--line)}
`;

function page(title: string, body: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · Savoir Privé Properties</title><style>${STYLE}</style></head>
<body><main><div class="brand">SA<b>V</b>OIR · Savoir Privé Properties</div>
<h1>${title}</h1><p class="muted">Last updated: ${UPDATED}</p>
${body}
<footer class="muted"><a href="/terms">Terms of Use</a> · <a href="/privacy">Privacy notice for the ChatGPT app</a> · <a href="https://savoirproperties.com/privacy-policy">Website Privacy Policy</a><br>${COMPANY} · Trade licence ${LICENCE} · ${CONTACT}</footer>
</main></body></html>`;
}

export function renderTermsPage(): string {
  return page(
    "Terms of Use",
    `<p>These Terms of Use ("Terms") govern your use of the website www.savoirproperties.com (the "Website") and of the Savoir Privé Properties app available in third-party AI assistants such as ChatGPT (the "App"), together the "Services". The Services are operated by ${COMPANY}, trade licence ${LICENCE}, ${ADDRESS} ("Savoir", "we", "us").</p>
<p>By using the Services you agree to these Terms. If you do not agree, please do not use the Services.</p>
<h2>1. What the Services provide</h2>
<p>The Services let you browse information about properties and off-plan projects that Savoir markets, including prices, locations, photos, payment plans and contact details.</p>
<p>All listing information is provided <strong>for general information only</strong>. It is not an offer, a contract, a valuation or financial, legal or investment advice.</p>
<h2>2. Accuracy and availability of listings</h2>
<p>We take care to keep listing information current. However, prices, availability, specifications, payment plans and handover dates can change at any time, and some information is supplied by developers, owners or third parties.</p>
<p><strong>You must confirm all details with a Savoir consultant before relying on them.</strong> A property shown in the Services may no longer be available. Locations shown on the App's map are approximate areas, not exact buildings.</p>
<h2>3. The App in AI assistants</h2>
<ul>
<li>The App shows Savoir's published listings. It can keep a shortlist of listing references for you (no personal details) for 30 days after your last change, and create a read-only link to that shortlist that anyone with the link can open until it expires or you stop sharing.</li>
<li>The App can prepare a message to Savoir for you to send yourself on WhatsApp or by email. It does not book viewings, make reservations, take payments, or send your contact details to Savoir.</li>
<li>A viewing or any transaction can only be arranged directly with a Savoir consultant, through the contact options the App and Website provide.</li>
<li>AI assistants generate their own responses. Savoir is responsible only for the listing data the App returns, not for how a third-party AI assistant summarises or presents it.</li>
<li>Your use of the AI assistant itself is governed by that provider's own terms and privacy policy. For example, ChatGPT is governed by OpenAI's terms.</li>
</ul>
<h2>4. Acceptable use</h2>
<p>You agree not to:</p>
<ul><li>misuse the Services;</li><li>attempt to gain unauthorised access to them;</li><li>interfere with their operation (including by automated scraping or excessive requests);</li><li>use them for unlawful purposes; or</li><li>misrepresent your identity when contacting us.</li></ul>
<h2>5. Intellectual property</h2>
<p>The Services' content, including text, photos, logos and design, belongs to Savoir or its licensors. You may view it for personal, non-commercial purposes. You may not reproduce or republish it without permission. Map data is © OpenStreetMap contributors, provided through OpenFreeMap and OpenMapTiles.</p>
<h2>6. Third-party links and services</h2>
<p>The Services link to third-party services such as WhatsApp, developers' websites and video platforms. We are not responsible for their content or practices.</p>
<h2>7. Limitation of liability</h2>
<p>To the extent permitted by the laws of the United Arab Emirates, Savoir is not liable for any loss arising from reliance on listing information, or from the unavailability of the Services.</p>
<h2>8. Privacy</h2>
<p>The <a href="/privacy">privacy notice for the ChatGPT app</a> explains what the App processes. Our <a href="https://savoirproperties.com/privacy-policy">Website Privacy Policy</a> explains how we handle personal data more generally.</p>
<h2>9. Changes</h2>
<p>We may update these Terms. The "Last updated" date shows the latest version. If you continue to use the Services after a change, you accept the updated Terms.</p>
<h2>10. Governing law</h2>
<p>These Terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Dubai. The courts of Dubai have exclusive jurisdiction.</p>
<h2>11. Contact</h2>
<p>${CONTACT}</p>`,
  );
}

export function renderPrivacyPage(): string {
  return page(
    "Privacy notice: Savoir Privé Properties app in ChatGPT",
    `<p>This notice explains how ${COMPANY} ("Savoir", "we") handles data when you use our app in third-party AI assistants such as ChatGPT (the "App"). It supplements our <a href="https://savoirproperties.com/privacy-policy">Website Privacy Policy</a>.</p>
<h2>What the App receives</h2>
<p>When you ask the assistant about properties, the assistant sends the App only the search criteria it needs. Examples are the area, buy or rent, property type, number of bedrooms, price range, or the reference of a listing you want to see. The App does not receive your name, email address, phone number, payment details, location or conversation history, and it does not ask for them.</p>
<h2>What we record</h2>
<p>To operate and secure the service, our servers keep technical logs:</p>
<ul>
<li><strong>App logs:</strong> which tool was used, whether it succeeded, and how long it took. They contain no search terms and no personal data.</li>
<li><strong>Web server logs:</strong> standard request information such as the requesting IP address, time and requested path. Searches come from the AI provider's servers. However, when <strong>you</strong> press a Website or WhatsApp button in the App, or open a shared shortlist page, your device connects to our server, so the log records your IP address.</li>
</ul>
<h2>Shortlists</h2>
<p>If you save listings, we store the listing references (no personal details) for 30 days after your last change. You can delete the shortlist at any time. If you create a share link, anyone with the link can see those listings until it expires or you stop sharing.</p>
<h2>Usage statistics</h2>
<p>We count how the App is used, for example how many searches mention an area, which budget ranges find no match, or how many times a WhatsApp button is pressed. These are daily totals. They contain no personal details, no identifiers and nothing you typed. We keep them for up to 13 months to improve our service and our listings.</p>
<h2>Purposes</h2>
<p>We use this data to answer your request, keep the service running and secure, fix errors, and understand which properties and areas customers are interested in.</p>
<h2>Recipients</h2>
<p>We do not sell this data. Our hosting provider (Hostinger International Ltd.) processes it on our behalf. Your conversation with the assistant, including anything you type, is handled by the AI provider under its own privacy policy (for ChatGPT, see OpenAI's privacy policy). Savoir does not receive your conversation.</p>
<h2>Retention</h2>
<p>App logs and web server logs are kept for 30 days and then deleted. Shortlists are kept for 30 days after their last change. Usage statistics, which contain no personal data, are kept for up to 13 months.</p>
<h2>Images, map and links</h2>
<p>Listing photos in the App are loaded directly from our image providers (Property Finder's image CDN, Cloudinary and Amazon S3). When you open the App's map, your device loads map tiles directly from OpenFreeMap (tiles.openfreemap.org), which receives your IP address under its own policy; Savoir receives nothing from this. If you open a WhatsApp, website or email link from the App, that service's own privacy policy applies.</p>
<h2>Contacting us about a property</h2>
<p>The App can prepare a message about the listings you choose, with a reference code, for you to send yourself by WhatsApp or email. The App does not send anything to Savoir and does not receive your contact details. If you contact us yourself, for example by WhatsApp, phone or email, we handle that information as described in our Website Privacy Policy.</p>
<h2>Your rights</h2>
<p>You can ask us about any data we hold about you, or ask us to delete it, using the contact details below.</p>
<h2>Contact</h2>
<p>${CONTACT}</p>`,
  );
}
