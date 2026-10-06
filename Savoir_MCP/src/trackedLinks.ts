/**
 * Signed click-through links: https://<mcp>/go/<payload>.<sig>
 *
 * Lets Savoir count contact/website link CLICKS from the cards without cookies or identifiers.
 * A click is intent, not a delivered lead: WhatsApp/email delivery cannot be observed.
 *
 * Security: payload = base64url(JSON {u, c, s, k?, l?}) signed with HMAC-SHA256 (truncated);
 * the target host is re-checked against an allow-list at redirect time, so this can never be
 * used as an open redirect even if the secret leaked.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type LinkChannel = "website" | "whatsapp_company" | "whatsapp_agent";
export type LinkSource = "card" | "detail" | "compare" | "handoff" | "share_page";

export interface LinkPayload {
  u: string; // target URL
  c: LinkChannel;
  s: LinkSource;
  k?: "property" | "offplan";
  l?: string; // public listing slug
}

export class LinkSigner {
  private readonly key: Buffer;
  readonly ephemeral: boolean;
  private readonly allowedHosts: Set<string>;

  constructor(secret: string | undefined, private readonly mcpOrigin: string, siteOrigin: string) {
    this.ephemeral = !secret;
    this.key = secret ? Buffer.from(secret, "utf8") : randomBytes(32);
    const site = new URL(siteOrigin).hostname;
    this.allowedHosts = new Set([site, `www.${site.replace(/^www\./, "")}`, "wa.me"]);
  }

  isAllowedTarget(url: string): boolean {
    try {
      const u = new URL(url);
      return u.protocol === "https:" && !u.username && !u.password && this.allowedHosts.has(u.hostname);
    } catch {
      return false;
    }
  }

  /** Signed redirect URL, or the original URL when it is not an allowed target. */
  wrap(p: LinkPayload): string {
    if (!this.isAllowedTarget(p.u)) return p.u;
    const body = Buffer.from(JSON.stringify(p)).toString("base64url");
    return `${this.mcpOrigin}/go/${body}.${this.sign(body)}`;
  }

  /** Verified payload for a /go token, or null. */
  open(token: string): LinkPayload | null {
    if (typeof token !== "string" || token.length > 6000) return null;
    const dot = token.lastIndexOf(".");
    if (dot <= 0) return null;
    const body = token.slice(0, dot);
    const sig = Buffer.from(token.slice(dot + 1));
    const expected = Buffer.from(this.sign(body));
    if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;
    try {
      const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as LinkPayload;
      if (typeof p.u !== "string" || !this.isAllowedTarget(p.u)) return null;
      if (!["website", "whatsapp_company", "whatsapp_agent"].includes(p.c)) return null;
      if (!["card", "detail", "compare", "handoff", "share_page"].includes(p.s)) return null;
      return p;
    } catch {
      return null;
    }
  }

  private sign(body: string): string {
    return createHmac("sha256", this.key).update(body).digest("base64url").slice(0, 22);
  }
}

/** Link-preview crawlers and prefetches follow links without a person clicking. */
export function isAutomatedFetch(userAgent: string | undefined, purpose: string | undefined): boolean {
  if (purpose && /prefetch|preview/i.test(purpose)) return true;
  return /bot|crawler|spider|facebookexternalhit|whatsapp|slack|telegram|discord|linkedin|skype|preview|embedly|headless/i.test(userAgent ?? "");
}
