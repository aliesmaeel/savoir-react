/**
 * Contact handoff: compose the exact inquiry text for the customer to send themselves
 * (WhatsApp / email). The server sends nothing and collects no personal details.
 *
 * Attribution: every handoff gets a short reference code (SAV-XXXXXX) and states that it
 * came from the Savoir Properties app; links carry utm_source=savoir_ai_app plus an explicit
 * campaign code when one is given. The host's user identity and referring page are not
 * available and are never guessed.
 */
import { randomBytes } from "node:crypto";
import { AMENITIES } from "./cms/amenities.js";
import type { Requirements } from "./cms/discovery.js";
import { cleanLine } from "./cms/sanitize.js";
import { COMPANY_EMAIL, COMPANY_PHONE } from "./contact.js";

export type Lang = "en" | "ar";

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/I/L

export function newReferenceCode(): string {
  const bytes = randomBytes(6);
  let s = "";
  for (const b of bytes) s += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `SAV-${s}`;
}

export const REFERENCE_CODE_RE = /^SAV-[2-9A-HJKMNP-Z]{6}$/;
export const CAMPAIGN_CODE_RE = /^[a-z0-9][a-z0-9_-]{0,39}$/;
export const DEFAULT_CAMPAIGN = "ai_app";

/** Add attribution parameters to a Savoir website URL (other hosts are returned unchanged). */
export function withUtm(url: string, medium: string, campaign: string | undefined, siteOrigin: string): string {
  try {
    const u = new URL(url);
    if (u.origin !== siteOrigin) return url;
    u.searchParams.set("utm_source", "savoir_ai_app");
    u.searchParams.set("utm_medium", medium);
    u.searchParams.set("utm_campaign", campaign ?? DEFAULT_CAMPAIGN);
    return u.toString();
  } catch {
    return url;
  }
}

export interface HandoffListing {
  kind: "property" | "offplan";
  title: string;
  reference_number: string | null;
  price_label: string | null;
  url: string;
}

const T = {
  en: {
    hello: "Hello Savoir Properties,",
    intro1: "I'm interested in this listing:",
    introN: "I'm interested in these listings:",
    introNone: "I'd like help finding a property.",
    ref: "Ref",
    req: "My requirements:",
    purpose: { buy: "Buy", rent: "Rent" },
    purposeL: "Purpose",
    budget: "Budget",
    upTo: "up to",
    from: "from",
    beds: "Bedrooms",
    studio: "Studio",
    areas: "Areas",
    status: "Status",
    ready: "Ready to move in",
    offplan: "Off-plan",
    musts: "Must have",
    notes: "Notes",
    viewing: "Preferred viewing time",
    viewingNote: "(a request — please confirm availability)",
    source: "Sent via the Savoir Properties app in an AI assistant",
    code: "Reference",
    campaign: "Campaign",
  },
  ar: {
    hello: "مرحباً Savoir Properties،",
    intro1: "أرغب في الاستفسار عن هذا العقار:",
    introN: "أرغب في الاستفسار عن هذه العقارات:",
    introNone: "أرغب في المساعدة للعثور على عقار.",
    ref: "الرقم المرجعي",
    req: "متطلباتي:",
    purpose: { buy: "شراء", rent: "إيجار" },
    purposeL: "الغرض",
    budget: "الميزانية",
    upTo: "حتى",
    from: "من",
    beds: "غرف النوم",
    studio: "استوديو",
    areas: "المناطق",
    status: "الحالة",
    ready: "جاهز للسكن",
    offplan: "على الخارطة",
    musts: "مواصفات أساسية",
    notes: "ملاحظات",
    viewing: "الموعد المفضّل للمعاينة",
    viewingNote: "(طلب فقط — يرجى تأكيد التوفر)",
    source: "أُرسلت عبر تطبيق Savoir Properties في مساعد الذكاء الاصطناعي",
    code: "رقم المرجع",
    campaign: "الحملة",
  },
} as const;

const money = (n: number) => `AED ${n.toLocaleString("en-US")}`;

/** Requirement lines in the customer's language. Free text is sanitised and bounded. */
export function requirementLines(r: Requirements | undefined, lang: Lang): string[] {
  if (!r) return [];
  const t = T[lang];
  const lines: string[] = [];
  if (r.purpose) lines.push(`${t.purposeL}: ${t.purpose[r.purpose]}`);
  if (r.budget_max_aed !== undefined && r.budget_min_aed !== undefined) lines.push(`${t.budget}: ${money(r.budget_min_aed)} – ${money(r.budget_max_aed)}`);
  else if (r.budget_max_aed !== undefined) lines.push(`${t.budget}: ${t.upTo} ${money(r.budget_max_aed)}`);
  else if (r.budget_min_aed !== undefined) lines.push(`${t.budget}: ${t.from} ${money(r.budget_min_aed)}`);
  if (r.bedrooms !== undefined) lines.push(`${t.beds}: ${r.bedrooms === 0 ? t.studio : r.bedrooms}`);
  if (r.areas?.length) lines.push(`${t.areas}: ${r.areas.map((a) => cleanLine(a, 60)).filter(Boolean).join(", ")}`);
  if (r.completion) lines.push(`${t.status}: ${r.completion === "ready" ? t.ready : t.offplan}`);
  if (r.must_have?.length) lines.push(`${t.musts}: ${r.must_have.map((k) => AMENITIES[k].label).join(", ")}`);
  const notes = cleanLine(r.notes, 300);
  if (notes) lines.push(`${t.notes}: ${notes}`);
  return lines;
}

export function buildHandoffMessage(opts: {
  listings: HandoffListing[];
  requirements?: Requirements;
  viewing?: string;
  lang: Lang;
  reference_code: string;
  /** Explicit campaign/offer code the customer mentioned; shown next to the reference. */
  campaign_code?: string;
}): string {
  const t = T[opts.lang];
  const out: string[] = [t.hello, ""];
  out.push(opts.listings.length === 0 ? t.introNone : opts.listings.length === 1 ? t.intro1 : t.introN);
  for (const l of opts.listings) {
    out.push(`• ${l.title}${l.price_label ? ` — ${l.price_label}` : ""}`);
    if (l.reference_number) out.push(`  ${t.ref}: ${l.reference_number}`);
    out.push(`  ${l.url}`);
  }
  const req = requirementLines(opts.requirements, opts.lang);
  if (req.length) out.push("", t.req, ...req.map((l) => `- ${l}`));
  const viewing = cleanLine(opts.viewing, 80);
  if (viewing) out.push("", `${t.viewing}: ${viewing} ${t.viewingNote}`);
  out.push("", `${t.code}: ${opts.reference_code}${opts.campaign_code ? ` · ${t.campaign}: ${opts.campaign_code}` : ""}`, t.source);
  return out.join("\n");
}

export interface HandoffChannels {
  whatsapp_company: string;
  whatsapp_agent: { name: string; url: string } | null;
  email: string;
  phone: string;
}

export function handoffChannels(message: string, subject: string, agent: { name: string; phone: string | null } | null): HandoffChannels {
  const digits = COMPANY_PHONE.replace(/\D/g, "");
  return {
    whatsapp_company: `https://wa.me/${digits}?text=${encodeURIComponent(message)}`,
    whatsapp_agent: agent?.phone ? { name: agent.name, url: `https://wa.me/${agent.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}` } : null,
    email: `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
    phone: `tel:${COMPANY_PHONE}`,
  };
}
