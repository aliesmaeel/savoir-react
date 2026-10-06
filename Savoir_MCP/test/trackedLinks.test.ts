import { describe, expect, it } from "vitest";
import { listingLinks } from "../src/tools/common.js";
import { isAutomatedFetch, LinkSigner } from "../src/trackedLinks.js";

const signer = () => new LinkSigner("k".repeat(32), "https://mcp.savoirproperties.com", "https://savoirproperties.com");

describe("signed click links", () => {
  it("round-trips allowed targets and rejects tampering", () => {
    const s = signer();
    const url = s.wrap({ u: "https://wa.me/971505074686?text=hi", c: "whatsapp_company", s: "handoff" });
    expect(url).toMatch(/^https:\/\/mcp\.savoirproperties\.com\/go\/[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{22}$/);
    const token = url.split("/go/")[1]!;
    expect(s.open(token)).toEqual({ u: "https://wa.me/971505074686?text=hi", c: "whatsapp_company", s: "handoff" });
    const [body, sig] = token.split(".");
    const evil = Buffer.from(JSON.stringify({ u: "https://wa.me/1", c: "whatsapp_company", s: "handoff" })).toString("base64url");
    expect(s.open(`${evil}.${sig}`)).toBeNull();
    expect(s.open(`${body}.${"A".repeat(22)}`)).toBeNull();
    expect(new LinkSigner("z".repeat(32), "https://m", "https://savoirproperties.com").open(token)).toBeNull();
    expect(s.open("garbage")).toBeNull();
  });

  it("never becomes an open redirect", () => {
    const s = signer();
    for (const u of ["https://evil.example/x", "http://savoirproperties.com/x", "javascript:alert(1)", "https://user:pw@savoirproperties.com/"]) {
      expect(s.wrap({ u, c: "website", s: "card" })).toBe(u); // not wrapped
    }
    expect(s.isAllowedTarget("https://www.savoirproperties.com/project/x")).toBe(true);
  });

  it("builds listing button links, with the agent's WhatsApp number when known", () => {
    const plain = listingLinks(null, { kind: "property", slug: "a", url: "https://savoirproperties.com/project/a" }, "detail", "+971 50 925 4548");
    expect(plain.whatsapp.startsWith("https://wa.me/971509254548?text=")).toBe(true);
    expect(plain.website).toBe("https://savoirproperties.com/project/a");
    const tracked = listingLinks(signer(), { kind: "property", slug: "a", url: "https://savoirproperties.com/project/a" }, "card");
    expect(tracked.website).toMatch(/\/go\//);
    expect(signer().open(tracked.whatsapp.split("/go/")[1]!)).toMatchObject({ c: "whatsapp_company", s: "card", k: "property", l: "a" });
  });

  it("recognises link-preview bots and prefetches", () => {
    expect(isAutomatedFetch("WhatsApp/2.23.20.0 A", undefined)).toBe(true);
    expect(isAutomatedFetch("facebookexternalhit/1.1", undefined)).toBe(true);
    expect(isAutomatedFetch("Mozilla/5.0 (iPhone) Safari/604.1", "prefetch")).toBe(true);
    expect(isAutomatedFetch("Mozilla/5.0 (iPhone) Safari/604.1", undefined)).toBe(false);
  });
});
