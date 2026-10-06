import { describe, expect, it } from "vitest";
import { mapAgent, mapOffplanDetails, mapOffplanSummary, mapPropertyDetails, mapPropertySummary } from "../src/cms/mappers.js";
import { cleanText } from "../src/cms/sanitize.js";
import { DEFAULT_IMAGE_HOSTS } from "../src/config.js";
import { offplanDetailResponse, offplanItem, PF, propertyDetailResponse, searchItem } from "./fixtures.js";

const ctx = { publicSiteUrl: "https://savoirproperties.com", imageHosts: DEFAULT_IMAGE_HOSTS };

describe("property summary mapping", () => {
  it("maps the verified CMS search fields", () => {
    const p = mapPropertySummary(searchItem(), ctx)!;
    expect(p).toMatchObject({
      slug: "unfurnished-vacant-skyline-view-2974-25427458",
      title: "UnFurnished | Vacant | Skyline View",
      url: "https://savoirproperties.com/project/unfurnished-vacant-skyline-view-2974-25427458",
      purpose: "sale",
      completion: "ready",
      property_type: "Apartment",
      bedrooms: 2,
      bedrooms_label: "2 bedrooms",
      bathrooms: 3,
      price: 2650000,
      currency: "AED",
      price_label: "AED 2,650,000",
      photo: `${PF}/YVK/45f1/original.jpg`,
    });
    expect(p.location).toEqual({ community: "Dubai Marina", sub_community: null, city: "Dubai", label: "Dubai Marina, Dubai" });
  });

  it('labels bedroom "0" (string, as the CMS sends it) as Studio', () => {
    const p = mapPropertySummary(searchItem({ bedroom: "0" }), ctx)!;
    expect(p.bedrooms).toBe(0);
    expect(p.bedrooms_label).toBe("Studio");
  });

  it("maps rent, off-plan and the CMS office code", () => {
    const p = mapPropertySummary(searchItem({ offering_type: "RR", completion_status: "off_plan", property_type: "Office-space" }), ctx)!;
    expect(p.purpose).toBe("rent");
    expect(p.completion).toBe("off_plan");
    expect(p.property_type).toBe("Office");
  });

  it("does not invent values that are missing", () => {
    const p = mapPropertySummary(searchItem({ price: null, currency: null, bedroom: null, bathroom: null, property_type: "ZZ", photo: null }), ctx)!;
    expect(p.price).toBeNull();
    expect(p.price_label).toBeNull();
    expect(p.bedrooms_label).toBeNull();
    expect(p.property_type).toBeNull();
    expect(p.photo).toBeNull();
  });

  it("drops records without a usable slug or title", () => {
    expect(mapPropertySummary(searchItem({ slug: "" }), ctx)).toBeNull();
    expect(mapPropertySummary(searchItem({ slug: "../etc" }), ctx)).toBeNull();
    expect(mapPropertySummary(searchItem({ title_en: "<b></b>" }), ctx)).toBeNull();
    expect(mapPropertySummary("nope", ctx)).toBeNull();
  });

  it("encodes slugs in canonical URLs and rejects photos from unknown or insecure hosts", () => {
    const p = mapPropertySummary(searchItem({ slug: "marina&sea", photo: "http://static.shared.propertyfinder.ae/x.jpg" }), ctx)!;
    expect(p.url).toBe("https://savoirproperties.com/project/marina%26sea");
    expect(p.photo).toBeNull();
    expect(mapPropertySummary(searchItem({ photo: "https://evil.example.com/x.jpg" }), ctx)!.photo).toBeNull();
  });
});

describe("property detail mapping", () => {
  it("includes verified photos, amenities, size, reference and the public agent contact", () => {
    const d = mapPropertyDetails(propertyDetailResponse(), ctx)!;
    expect(d.photos).toEqual([`${PF}/YVK/45f1/original.jpg`, `${PF}/YVK/second.jpg`]);
    expect(d.amenities).toEqual(["Balcony", "Covered parking", "Shared pool"]);
    expect(d.size_sqft).toBe(1258);
    expect(d.reference_number).toBe("2974-25427458");
    expect(d.permit_number).toBe("7114958341");
    expect(d.building).toBe("West Avenue Tower");
    expect(d.agent).toEqual({
      name: "Luiza Dragan",
      email: "Luiza@savoirproperties.com",
      phone: "+971509254548",
      whatsapp_url: "https://wa.me/971509254548",
    });
  });

  it("turns the HTML description into bounded plain text and drops scripts", () => {
    const d = mapPropertyDetails(propertyDetailResponse(), ctx)!;
    expect(d.description).toContain("2 spacious bedrooms & 3 baths");
    expect(d.description).not.toMatch(/<|alert\(1\)/);
    const long = mapPropertyDetails(propertyDetailResponse({ description_en: "x".repeat(5000) }), ctx)!;
    expect(long.description!.length).toBeLessThanOrEqual(1500);
  });

  it("maps similar properties, excluding the listing itself", () => {
    const similar = [searchItem(), searchItem({ slug: "other-1", title_en: "Other", offering_type: "RR", bedroom: "0" })];
    const d = mapPropertyDetails(propertyDetailResponse({}, similar), ctx)!;
    expect(d.similar_properties.map((s) => s.slug)).toEqual(["other-1"]);
    expect(d.similar_properties[0]!.bedrooms_label).toBe("Studio");
  });

  it("returns null when the CMS has no property", () => {
    expect(mapPropertyDetails({ property: null, similar_properties: [] }, ctx)).toBeNull();
  });

  it("hides the CMS 'Admin' placeholder account as an agent", () => {
    expect(mapAgent({ name: "Admin", email: "admin@savoirproperties.com", phone: "+971505074686" })).toBeNull();
    expect(mapAgent({ name: "Jane", email: "not-an-email", phone: "12" })).toEqual({ name: "Jane", email: null, phone: null, whatsapp_url: null });
  });
});

describe("off-plan mapping", () => {
  it("maps summary fields and uses /off-plan/ URLs", () => {
    expect(mapOffplanSummary(offplanItem(), ctx)).toMatchObject({
      slug: "the-archive-by-imtiaz",
      url: "https://savoirproperties.com/off-plan/the-archive-by-imtiaz",
      developer: "Imtiaz Developments",
      handover: "Q3 - 2028",
      starting_price_label: "AED 666,000",
    });
  });

  it('does not present placeholders like "Call Us" as a price', () => {
    expect(mapOffplanSummary(offplanItem({ starting_price: "Call Us" }), ctx)!.starting_price_label).toBeNull();
  });

  it("includes the payment plan only when the CMS provides it", () => {
    const d = mapOffplanDetails(offplanDetailResponse(), ctx)!;
    expect(d.payment_plan).toEqual({ down_payment: "20%", during_construction: "35%", on_handover: "45%" });
    expect(d.amenities).toEqual(["Cabanas", "Rooftop BBQ", "Gymnasium"]);
    expect(d.unit_sizes).toBe("384 to 1,884 sq. ft.");
    expect(d.video_url).toBeNull();

    const none = mapOffplanDetails(offplanDetailResponse({ first_installment: null, during_construction: "", on_handover: "TBA" }), ctx)!;
    expect(none.payment_plan).toBeNull();
  });

  it("accepts only YouTube video links and never passes the map iframe through", () => {
    expect(mapOffplanDetails(offplanDetailResponse({ youtube_link: "https://www.youtube.com/watch?v=abc" }), ctx)!.video_url).toBe("https://www.youtube.com/watch?v=abc");
    expect(mapOffplanDetails(offplanDetailResponse({ youtube_link: "https://evil.example/v" }), ctx)!.video_url).toBeNull();
    expect(JSON.stringify(mapOffplanDetails(offplanDetailResponse(), ctx))).not.toContain("iframe");
  });
});

describe("cleanText", () => {
  it("removes markup, invisible and bidi-override characters", () => {
    expect(cleanText("<p>Hello&nbsp;<b>world</b></p>‮​", 100)).toBe("Hello world");
    expect(cleanText("&lt;script&gt;x&lt;/script&gt; ok", 100)).toBe("x ok");
    expect(cleanText(42, 100)).toBeNull();
  });
});
