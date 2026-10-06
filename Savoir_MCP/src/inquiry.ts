/**
 * Property inquiry flow with an explicit two-step confirmation.
 *
 * Step 1 (confirm omitted/false): validate, look up the listing, compose the
 *   exact message, and return a preview plus a short-lived confirmation token.
 *   Nothing is sent.
 * Step 2 (confirm=true + token): the token is an HMAC over the exact payload,
 *   so any change to the contact details or message after the user reviewed
 *   them invalidates it. Tokens are single-use and expire after 10 minutes.
 *
 * The CMS has no booking API: the website's "Book a Viewing" form only opens
 * a mailto link. Inquiries therefore go through /api/contact-us and are never
 * described as a booked or confirmed viewing.
 */
import { createHmac, randomBytes, timingSafeEqual, createHash } from "node:crypto";

export const TOKEN_TTL_MS = 10 * 60_000;

export type InquiryType = "viewing_request" | "more_information" | "general";

export interface InquiryInput {
  listing_kind?: "property" | "offplan";
  slug?: string;
  inquiry_type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
}

export interface ListingRef {
  kind: "property" | "offplan";
  title: string;
  reference_number: string | null;
  url: string;
}

export interface ContactUsPayload {
  type: "contact_us";
  name: string;
  email: string;
  phone: string;
  message: string;
}

const TYPE_LABEL: Record<InquiryType, string> = {
  viewing_request: "Viewing request (preferred date/time is a request only — not a confirmed booking)",
  more_information: "Request for more information",
  general: "General inquiry",
};

/** Compose the exact /api/contact-us body (same shape as the website's contact form). */
export function buildContactPayload(input: InquiryInput, listing: ListingRef | null): ContactUsPayload {
  const lines = ["Inquiry sent via the Savoir Properties AI assistant app.", `Inquiry type: ${TYPE_LABEL[input.inquiry_type]}`];
  if (listing) {
    lines.push(`${listing.kind === "offplan" ? "Off-plan project" : "Property"}: ${listing.title}`);
    if (listing.reference_number) lines.push(`Reference: ${listing.reference_number}`);
    lines.push(`Link: ${listing.url}`);
  }
  if (input.preferred_date) lines.push(`Preferred date: ${input.preferred_date}`);
  if (input.preferred_time) lines.push(`Preferred time: ${input.preferred_time}`);
  const msg = input.message?.trim();
  lines.push("", "Message:", msg || (input.inquiry_type === "viewing_request" ? "I would like to arrange a viewing. Please contact me with available slots." : "Please contact me with more information."));
  return {
    type: "contact_us",
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() ?? "",
    message: lines.join("\n"),
  };
}

const digest = (payload: ContactUsPayload) => createHash("sha256").update(JSON.stringify(payload)).digest("base64url");

export class ConfirmationTokens {
  private readonly key: Buffer;
  private readonly used = new Map<string, number>();

  constructor(secret: string | undefined, private readonly now: () => number = Date.now) {
    this.key = secret ? Buffer.from(secret, "utf8") : randomBytes(32);
  }

  issue(payload: ContactUsPayload): { token: string; expires_at: string } {
    const exp = this.now() + TOKEN_TTL_MS;
    const nonce = randomBytes(9).toString("base64url");
    const sig = this.sign(`${digest(payload)}.${exp}.${nonce}`);
    return { token: `${exp}.${nonce}.${sig}`, expires_at: new Date(exp).toISOString() };
  }

  /** "ok" only if the token was issued for exactly this payload, is unexpired and unused. Marks it used. */
  redeem(token: string | undefined, payload: ContactUsPayload): "ok" | "missing" | "invalid" | "expired" | "used" {
    if (!token) return "missing";
    const parts = token.split(".");
    if (parts.length !== 3) return "invalid";
    const [expStr, nonce, sig] = parts as [string, string, string];
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || !/^[A-Za-z0-9_-]{1,32}$/.test(nonce)) return "invalid";
    const expected = Buffer.from(this.sign(`${digest(payload)}.${exp}.${nonce}`));
    const given = Buffer.from(sig);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";
    if (exp <= this.now()) return "expired";
    this.gc();
    if (this.used.has(token)) return "used";
    this.used.set(token, exp);
    return "ok";
  }

  /** Allow a retry with the same token when the send itself failed before reaching the CMS. */
  release(token: string): void {
    this.used.delete(token);
  }

  private sign(data: string): string {
    return createHmac("sha256", this.key).update(data).digest("base64url");
  }

  private gc(): void {
    const t = this.now();
    for (const [k, exp] of this.used) if (exp <= t) this.used.delete(k);
  }
}
