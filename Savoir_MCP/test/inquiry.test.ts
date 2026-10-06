import { describe, expect, it } from "vitest";
import { buildContactPayload, ConfirmationTokens, TOKEN_TTL_MS, type InquiryInput } from "../src/inquiry.js";

const input: InquiryInput = {
  inquiry_type: "viewing_request",
  name: "  Jane Doe ",
  email: "jane@example.com",
  phone: "+971 50 000 0000",
  message: "Is it available in November?",
  preferred_date: "2026-11-02",
  preferred_time: "17:30",
};
const listing = {
  kind: "property" as const,
  title: "UnFurnished | Vacant | Skyline View",
  reference_number: "2974-25427458",
  url: "https://savoirproperties.com/project/unfurnished-vacant-skyline-view-2974-25427458",
};

describe("contact-us payload", () => {
  it("uses exactly the website's contact form shape", () => {
    const p = buildContactPayload(input, [listing]);
    expect(Object.keys(p).sort()).toEqual(["email", "message", "name", "phone", "type"]);
    expect(p.type).toBe("contact_us");
    expect(p.name).toBe("Jane Doe");
  });

  it("includes the property reference and link, and frames the viewing as a request", () => {
    const { message } = buildContactPayload(input, [listing]);
    expect(message).toContain("Reference: 2974-25427458");
    expect(message).toContain(`Link: ${listing.url}`);
    expect(message).toContain("Preferred date: 2026-11-02");
    expect(message).toContain("not a confirmed booking");
    expect(message).not.toMatch(/\bbooked\b|\bconfirmed viewing\b/i);
  });

  it("always has a non-empty message (the website requires one)", () => {
    const { message } = buildContactPayload({ inquiry_type: "general", name: "Jo", email: "jo@example.com" }, []);
    expect(message.trim().length).toBeGreaterThan(10);
  });
});

describe("confirmation tokens", () => {
  it("accepts a token only for the exact previewed payload, once", () => {
    const tokens = new ConfirmationTokens("x".repeat(32));
    const payload = buildContactPayload(input, [listing]);
    const { token } = tokens.issue(payload);
    expect(tokens.redeem(token, { ...payload, email: "attacker@example.com" })).toBe("invalid");
    expect(tokens.redeem(token, payload)).toBe("ok");
    expect(tokens.redeem(token, payload)).toBe("used");
  });

  it("rejects missing, malformed, forged and expired tokens", () => {
    let now = 1_000_000;
    const tokens = new ConfirmationTokens(undefined, () => now);
    const payload = buildContactPayload(input, []);
    expect(tokens.redeem(undefined, payload)).toBe("missing");
    expect(tokens.redeem("garbage", payload)).toBe("invalid");
    const { token } = tokens.issue(payload);
    const forged = token.replace(/.$/, (c) => (c === "A" ? "B" : "A"));
    expect(tokens.redeem(forged, payload)).toBe("invalid");
    expect(new ConfirmationTokens("y".repeat(32), () => now).redeem(token, payload)).toBe("invalid");
    now += TOKEN_TTL_MS + 1;
    expect(tokens.redeem(token, payload)).toBe("expired");
  });

  it("allows a retry after release (failed send)", () => {
    const tokens = new ConfirmationTokens(undefined);
    const payload = buildContactPayload(input, []);
    const { token } = tokens.issue(payload);
    expect(tokens.redeem(token, payload)).toBe("ok");
    tokens.release(token);
    expect(tokens.redeem(token, payload)).toBe("ok");
  });
});
