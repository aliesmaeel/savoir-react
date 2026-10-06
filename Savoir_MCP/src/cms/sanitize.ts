/**
 * Helpers for turning untrusted CMS strings into safe, bounded plain text and
 * vetted URLs. CMS descriptions are written by listing authors and synced from
 * portals; they are data, never instructions, and never markup.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  hellip: "…",
  bull: "•",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const code = body[1]?.toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

// C0/C1 controls (except \n and \t), zero-width and bidi override characters.
const INVISIBLE = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;

/** Multi-line plain text: strips markup, decodes entities, removes invisibles, bounds length. */
export function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  let s = value
    .replace(/<\s*(script|style|iframe)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, " ")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]*>/g, " ");
  s = decodeEntities(s)
    .replace(/<[^>]*>/g, " ") // markup that was entity-encoded
    .replace(INVISIBLE, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!s) return null;
  return truncate(s, maxLength);
}

/** Single-line plain text (titles, names, labels). */
export function cleanLine(value: unknown, maxLength: number): string | null {
  if (typeof value === "number" && Number.isFinite(value)) value = String(value);
  const s = cleanText(value, Number.MAX_SAFE_INTEGER);
  if (!s) return null;
  return truncate(s.replace(/\s+/g, " "), maxLength);
}

export function truncate(s: string, maxLength: number): string {
  if (s.length <= maxLength) return s;
  return `${s.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/** Accept only absolute https URLs without credentials, optionally restricted to a host allow-list. */
export function safeHttpsUrl(value: unknown, allowedHosts?: readonly string[]): string | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;
  if (allowedHosts && !allowedHosts.includes(url.hostname.toLowerCase())) return null;
  return url.toString();
}

const EMAIL_RE = /^[A-Z0-9._%+-]{1,64}@[A-Z0-9.-]{1,190}\.[A-Z]{2,24}$/i;

export function safeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  return EMAIL_RE.test(s) ? s : null;
}

/** Normalise a phone number to "+<digits>" (UAE numbers as published by the CMS/website). */
export function safePhone(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const digits = String(value).replace(/[^\d]/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `+${digits}`;
}

/** WhatsApp click-to-chat link (https://wa.me/<digits>), optionally with prefilled text. */
export function whatsappUrl(phone: string | null, text?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return null;
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

/** Number from CMS fields that may be numbers or numeric strings ("2", 2650000). */
export function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(value)) return Number(value);
  return null;
}

/** Slugs as used by the CMS and website routes (mirrors app/seo/canonical.ts normalizeSlug). */
export function isValidSlug(value: string): boolean {
  if (!value || value.length > 240 || value === "." || value === "..") return false;
  return !/[\u0000-\u001f\u007f\s/\\?#]/u.test(value);
}
