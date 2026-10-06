import { describe, expect, it } from "vitest";
import { buildHandoffMessage, handoffChannels, newReferenceCode, REFERENCE_CODE_RE, requirementLines, withUtm } from "../src/handoff.js";

const listing = {
  kind: "property" as const,
  title: "UnFurnished | Vacant | Skyline View",
  reference_number: "2974-25427458",
  price_label: "AED 2,650,000",
  url: "https://savoirproperties.com/project/unfurnished-vacant-skyline-view-2974-25427458",
};

describe("handoff message", () => {
  it("contains the listings, stated requirements, the viewing request and attribution — in English", () => {
    const m = buildHandoffMessage({
      listings: [listing],
      requirements: { purpose: "buy", budget_max_aed: 3_000_000, bedrooms: 2, areas: ["Dubai Marina"], must_have: ["water_view"], notes: "Near a school" },
      viewing: "Saturday afternoon",
      lang: "en",
      reference_code: "SAV-ABC234",
    });
    expect(m).toContain("UnFurnished | Vacant | Skyline View — AED 2,650,000");
    expect(m).toContain("Ref: 2974-25427458");
    expect(m).toContain(listing.url);
    expect(m).toContain("Budget: up to AED 3,000,000");
    expect(m).toContain("Bedrooms: 2");
    expect(m).toContain("Must have: Water view");
    expect(m).toContain("Notes: Near a school");
    expect(m).toContain("Preferred viewing time: Saturday afternoon (a request — please confirm availability)");
    expect(m).toContain("Reference: SAV-ABC234");
    expect(m).toContain("Sent via the Savoir Properties app");
    expect(m).not.toMatch(/\bbooked\b|confirmed booking/i);
  });

  it("has an Arabic version that keeps listing data and states it is a request", () => {
    const m = buildHandoffMessage({ listings: [listing], requirements: { purpose: "rent", bedrooms: 0 }, viewing: "السبت", lang: "ar", reference_code: "SAV-ABC234" });
    expect(m).toContain("مرحباً Savoir Properties");
    expect(m).toContain("الغرض: إيجار");
    expect(m).toContain("غرف النوم: استوديو");
    expect(m).toContain("طلب فقط");
    expect(m).toContain(listing.url);
    expect(m).toContain("SAV-ABC234");
  });

  it("sanitises free text and leaves out requirements that were not stated", () => {
    expect(requirementLines({ notes: "<b>hi</b>‮" }, "en")).toEqual(["Notes: hi"]);
    expect(requirementLines(undefined, "en")).toEqual([]);
    expect(requirementLines({}, "en")).toEqual([]);
  });
});

describe("attribution and channels", () => {
  it("issues unambiguous reference codes", () => {
    for (let i = 0; i < 200; i++) expect(newReferenceCode()).toMatch(REFERENCE_CODE_RE);
  });

  it("adds UTM parameters only to Savoir website links", () => {
    const u = new URL(withUtm(listing.url, "whatsapp_handoff", "spring26", "https://savoirproperties.com"));
    expect(Object.fromEntries(u.searchParams)).toEqual({ utm_source: "savoir_ai_app", utm_medium: "whatsapp_handoff", utm_campaign: "spring26" });
    expect(withUtm("https://evil.example/x", "m", undefined, "https://savoirproperties.com")).toBe("https://evil.example/x");
    expect(new URL(withUtm(listing.url, "m", undefined, "https://savoirproperties.com")).searchParams.get("utm_campaign")).toBe("ai_app");
  });

  it("encodes the exact message into WhatsApp and email links; agent link only with a phone", () => {
    const msg = "Hello & welcome\nline 2";
    const c = handoffChannels(msg, "Property inquiry SAV-ABC234", { name: "Luiza", phone: "+971509254548" });
    expect(decodeURIComponent(new URL(c.whatsapp_company).searchParams.get("text")!)).toBe(msg);
    expect(c.whatsapp_company.startsWith("https://wa.me/971505074686?text=")).toBe(true);
    expect(c.whatsapp_agent!.url.startsWith("https://wa.me/971509254548?text=")).toBe(true);
    expect(c.email).toMatch(/^mailto:info@savoirproperties\.com\?subject=Property%20inquiry%20SAV-ABC234&body=/);
    expect(handoffChannels(msg, "s", { name: "x", phone: null }).whatsapp_agent).toBeNull();
  });
});
