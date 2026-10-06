/**
 * Savoir CMS adapters: build verified request bodies, resolve user wording to
 * the CMS's own vocabulary, and return small sanitised results.
 *
 * Errors from the CMS propagate as CmsError so callers can tell "the API
 * failed" apart from "no listings matched".
 */
import type { OffplanDetails, OffplanSummary, Pagination, PropertyDetails, PropertySummary } from "../schemas.js";
import { CmsClient, CmsError } from "./client.js";
import { mapOffplanDetails, mapOffplanSummary, mapPropertyDetails, mapPropertySummary, type MapContext } from "./mappers.js";
import { isValidSlug } from "./sanitize.js";
import {
  CMS_MAX_LIMIT,
  COMPLETION_STATUS,
  OFFERING_TYPE,
  PROPERTY_TYPES,
  SORTS,
  type Completion,
  type PropertyTypeKey,
  type Purpose,
  type SortKey,
} from "./vocab.js";

const SUGGESTIONS_TTL_MS = 10 * 60_000;
const DETAILS_TTL_MS = 2 * 60_000;
const SEARCH_TTL_MS = 60_000;
const INVENTORY_TTL_MS = 10 * 60_000;
const MAX_AREA_MATCHES = 8;
const MAX_HANDOVER_VARIANTS = 6;

export interface SearchOutcome<T> {
  status: "ok" | "no_results";
  items: T[];
  pagination: Pagination;
  applied_filters: Record<string, unknown>;
  notes: string[];
  /** When the CMS data behind these results was fetched (ISO), or null if the CMS was not queried. */
  data_as_of: string | null;
}

const iso = (ms: number) => new Date(ms).toISOString();

export interface PropertySearchParams {
  areas?: string[];
  purpose?: Purpose;
  property_type?: PropertyTypeKey;
  /** 0 = studio. Exact match (verified CMS semantics). */
  bedrooms?: number;
  bathrooms?: number;
  min_price?: number;
  max_price?: number;
  completion?: Completion;
  sort?: SortKey;
  page: number;
  page_size: number;
}

export interface OffplanSearchParams {
  developers?: string[];
  handover?: string;
  area?: string;
  /** Matches projects whose parsed "starting from" price is within budget (cheapest unit only). */
  max_starting_price_aed?: number;
  page: number;
  page_size: number;
}

/** Minimal listing facts kept in the inventory snapshot (used for area statistics only). */
export interface InventoryItem {
  community: string | null;
  sub_community: string | null;
  purpose: "sale" | "rent" | null;
  completion: "ready" | "off_plan" | null;
  bedrooms: number | null;
  price: number | null;
  type: string | null;
}

export interface InventorySnapshot {
  items: InventoryItem[];
  total: number;
  complete: boolean;
  fetchedAt: number;
}

export interface OffplanSuggestions {
  developers: string[];
  completionDates: string[];
  locations: Array<{ slug: string; label: string }>;
}

/** Lower-case, strip punctuation, collapse whitespace — for comparing names. */
export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Common Dubai abbreviations → CMS location names (applied only if the target exists in the CMS list). */
const AREA_ALIASES: Record<string, string> = {
  jbr: "Jumeirah Beach Residence",
  jlt: "Jumeirah Lake Towers",
  jvc: "Jumeirah Village Circle",
  "the palm": "Palm Jumeirah",
  palm: "Palm Jumeirah",
  downtown: "Downtown Dubai",
  "mbr city": "Mohammed Bin Rashid City",
  mbr: "Mohammed Bin Rashid City",
  "dubai south": "Dubai South (Dubai World Central)",
  dwc: "Dubai South (Dubai World Central)",
  dip: "Dubai Investment Park (DIP)",
  "creek harbour": "Dubai Creek Harbour (The Lagoons)",
  "dubai creek harbour": "Dubai Creek Harbour (The Lagoons)",
};

/** Names that would match (almost) everything if used for partial expansion. */
const TOO_BROAD = new Set(["united arab emirates", "dubai", "uae"]);

export interface AreaResolution {
  matched: string[];
  unmatched: string[];
  expanded: Array<{ input: string; matches: string[]; truncated: boolean }>;
}

/**
 * Resolve user area wording to exact CMS location names.
 * Exact (case/punctuation-insensitive) match wins; otherwise known aliases;
 * otherwise whole-word partial matches (e.g. "Marina" → "Dubai Marina",
 * "Marina Gate", ...), capped and reported back to the caller.
 */
export function resolveAreas(inputs: string[], known: string[]): AreaResolution {
  const byNorm = new Map(known.map((k) => [normalizeName(k), k] as const));
  const matched: string[] = [];
  const unmatched: string[] = [];
  const expanded: AreaResolution["expanded"] = [];
  const add = (v: string) => {
    if (!matched.includes(v)) matched.push(v);
  };

  for (const input of inputs) {
    const n = normalizeName(input);
    if (!n) continue;
    const exact = byNorm.get(n);
    if (exact) {
      add(exact);
      continue;
    }
    const alias = AREA_ALIASES[n];
    const aliasTarget = alias ? byNorm.get(normalizeName(alias)) : undefined;
    if (aliasTarget) {
      add(aliasTarget);
      continue;
    }
    if (TOO_BROAD.has(n) || n.length < 3) {
      unmatched.push(input);
      continue;
    }
    const pattern = new RegExp(`(^| )${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`);
    const partial = known.filter((k) => !TOO_BROAD.has(normalizeName(k)) && pattern.test(normalizeName(k)));
    if (partial.length) {
      const kept = partial.slice(0, MAX_AREA_MATCHES);
      kept.forEach(add);
      expanded.push({ input, matches: kept, truncated: partial.length > kept.length });
    } else {
      unmatched.push(input);
    }
  }
  return { matched, unmatched, expanded };
}

/** Resolve developer wording ("Sobha", "emaar") to exact CMS developer names. */
export function resolveDevelopers(inputs: string[], known: string[]): { matched: string[]; unmatched: string[] } {
  const matched: string[] = [];
  const unmatched: string[] = [];
  for (const input of inputs) {
    const n = normalizeName(input);
    if (!n) continue;
    const exact = known.find((k) => normalizeName(k) === n);
    const wholeWord = new RegExp(`(^| )${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`);
    const hits = exact ? [exact] : n.length >= 3 ? known.filter((k) => wholeWord.test(normalizeName(k))) : [];
    if (hits.length) hits.forEach((h) => !matched.includes(h) && matched.push(h));
    else unmatched.push(input);
  }
  return { matched, unmatched };
}

/**
 * Resolve handover wording to the exact completion_date strings stored in the
 * CMS. The CMS stores inconsistent variants ("Q2 - 2028" and "Q2 2028"), so a
 * quarter can map to several values; a bare year maps to all its quarters.
 */
export function resolveHandover(input: string, known: string[]): string[] {
  const n = normalizeName(input);
  if (!n) return [];
  const exact = known.filter((k) => normalizeName(k) === n);
  if (exact.length) return exact;

  const keyOf = (s: string) => {
    const m = normalizeName(s).match(/^q\s?([1-4])\s?(\d{4})$/);
    if (m) return { q: m[1], y: m[2] };
    const y = normalizeName(s).match(/^(\d{4})$/);
    if (y) return { q: undefined, y: y[1] };
    return null;
  };

  if (/^ready/.test(n)) return known.filter((k) => /^ready/.test(normalizeName(k)));

  const want = keyOf(input);
  if (!want) return [];
  return known.filter((k) => {
    const have = keyOf(k);
    return !!have && have.y === want.y && (want.q === undefined || have.q === want.q);
  });
}

function emptyPagination(page: number, page_size: number): Pagination {
  return { page, page_size, total_results: 0, total_pages: 0, has_more: false };
}

const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && /^\d+$/.test(v) ? Number(v) : null);

export class SavoirCms {
  constructor(
    private readonly client: CmsClient,
    private readonly ctx: MapContext,
  ) {}

  get mapContext(): MapContext {
    return this.ctx;
  }

  async propertyLocations(): Promise<string[]> {
    const raw = await this.client.get<unknown>("/api/search-suggestions", { cacheTtlMs: SUGGESTIONS_TTL_MS });
    // Verified shape: { "Dubai Marina": "Dubai Marina", ... } (identity map).
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new CmsError("cms_invalid_response");
    return Object.keys(raw as Record<string, unknown>).filter((k) => k.length <= 120);
  }

  async offplanSuggestions(): Promise<OffplanSuggestions> {
    const raw = await this.client.get<Record<string, unknown>>("/api/search-offplan-suggestions", { cacheTtlMs: SUGGESTIONS_TTL_MS });
    if (!raw || typeof raw !== "object") throw new CmsError("cms_invalid_response");
    const strings = (v: unknown) => asArray(v).filter((s): s is string => typeof s === "string");
    const locs = raw.locations && typeof raw.locations === "object" && !Array.isArray(raw.locations) ? (raw.locations as Record<string, unknown>) : {};
    return {
      developers: strings(raw.developers),
      completionDates: strings(raw.completion_date),
      locations: Object.entries(locs)
        .filter((e): e is [string, string] => typeof e[1] === "string" && isValidSlug(e[0]))
        .map(([slug, label]) => ({ slug, label })),
    };
  }

  async searchProperties(p: PropertySearchParams): Promise<SearchOutcome<PropertySummary>> {
    const notes: string[] = [];
    const applied: Record<string, unknown> = {};

    let query: string[] = [];
    if (p.areas?.length) {
      const res = resolveAreas(p.areas, await this.propertyLocations());
      for (const e of res.expanded) {
        notes.push(`"${e.input}" is not an exact Savoir location; searched matching locations: ${e.matches.join(", ")}${e.truncated ? " (more exist — be more specific)" : ""}.`);
      }
      if (res.unmatched.length) {
        notes.push(`No Savoir listings are recorded for location(s): ${res.unmatched.join(", ")}.`);
      }
      if (!res.matched.length) {
        return { status: "no_results", items: [], pagination: emptyPagination(p.page, p.page_size), applied_filters: { areas: p.areas }, notes, data_as_of: null };
      }
      query = res.matched;
      applied.areas = res.matched;
    }

    const body = {
      query,
      offering_type: p.purpose ? OFFERING_TYPE[p.purpose] : null,
      completion_status: p.completion ? COMPLETION_STATUS[p.completion] : null,
      type: p.property_type ? PROPERTY_TYPES[p.property_type].code : null,
      bedroom: p.bedrooms ?? null,
      bathroom: p.bathrooms ?? null,
      min_price: p.min_price ?? null,
      max_price: p.max_price ?? null,
    };
    if (p.purpose) applied.purpose = p.purpose;
    if (p.completion) applied.completion = p.completion;
    if (p.property_type) applied.property_type = PROPERTY_TYPES[p.property_type].label;
    if (p.bedrooms !== undefined) applied.bedrooms = p.bedrooms === 0 ? "studio" : p.bedrooms;
    if (p.bathrooms !== undefined) applied.bathrooms = p.bathrooms;
    if (p.min_price !== undefined) applied.min_price_aed = p.min_price;
    if (p.max_price !== undefined) applied.max_price_aed = p.max_price;
    const sortKey = p.sort ?? "newest";
    applied.sort = sortKey;

    const sort = SORTS[sortKey];
    const qs = new URLSearchParams({
      page: String(p.page),
      limit: String(p.page_size),
      sort_field: sort.sort_field,
      sort_order: sort.sort_order,
    });
    const { data: raw, fetchedAt } = await this.client.postMeta<Record<string, unknown>>(`/api/search?${qs}`, body, { cacheTtlMs: SEARCH_TTL_MS });
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.data)) throw new CmsError("cms_invalid_response");

    const items = raw.data.map((d) => mapPropertySummary(d, this.ctx)).filter((x): x is PropertySummary => x !== null);
    const total = num(raw.total) ?? items.length;
    const totalPages = num(raw.total_pages) ?? Math.ceil(total / p.page_size);
    const pagination: Pagination = {
      page: p.page,
      page_size: p.page_size,
      total_results: total,
      total_pages: totalPages,
      has_more: p.page < totalPages,
    };
    if (total > 0 && !items.length && p.page > totalPages) {
      notes.push(`Page ${p.page} is beyond the last page (${totalPages}).`);
    }
    return { status: total === 0 ? "no_results" : "ok", items, pagination, applied_filters: applied, notes, data_as_of: iso(fetchedAt) };
  }

  async propertyDetails(slug: string): Promise<PropertyDetails | null> {
    return (await this.propertyDetailsMeta(slug)).details;
  }

  /** Listing details plus when they were fetched. `fresh` bypasses the cache (used before a contact handoff). */
  async propertyDetailsMeta(slug: string, fresh = false): Promise<{ details: PropertyDetails | null; fetchedAt: number }> {
    const { data: raw, fetchedAt } = await this.client.getMeta<unknown>(`/api/property/${encodeURIComponent(slug)}`, {
      cacheTtlMs: DETAILS_TTL_MS,
      notFoundOnMissingRecord: true,
      fresh,
    });
    const mapped = mapPropertyDetails(raw, this.ctx);
    if (!mapped) {
      const property = raw && typeof raw === "object" ? (raw as Record<string, unknown>).property : undefined;
      if (property === null || property === undefined) return { details: null, fetchedAt };
      throw new CmsError("cms_invalid_response");
    }
    return { details: mapped, fetchedAt };
  }

  /**
   * Snapshot of the current listing inventory (minimal fields), for area statistics only.
   * Bounded to 5 CMS pages; `complete` is false if the inventory is larger.
   */
  async inventory(): Promise<InventorySnapshot> {
    const items: InventoryItem[] = [];
    let total = 0;
    let fetchedAt = Number.MAX_SAFE_INTEGER;
    for (let page = 1; page <= 5; page++) {
      const qs = new URLSearchParams({ page: String(page), limit: String(CMS_MAX_LIMIT), sort_field: "price", sort_order: "asc" });
      const r = await this.client.postMeta<Record<string, unknown>>(`/api/search?${qs}`, { query: [] }, { cacheTtlMs: INVENTORY_TTL_MS });
      fetchedAt = Math.min(fetchedAt, r.fetchedAt);
      if (!r.data || !Array.isArray(r.data.data)) throw new CmsError("cms_invalid_response");
      total = num(r.data.total) ?? total;
      for (const d of r.data.data) {
        const s = mapPropertySummary(d, this.ctx);
        if (s) items.push({ community: s.location.community, sub_community: s.location.sub_community, purpose: s.purpose, completion: s.completion, bedrooms: s.bedrooms, price: s.price, type: s.property_type });
      }
      const pages = num(r.data.total_pages) ?? 1;
      if (page >= pages) break;
    }
    return { items, total, complete: items.length >= total, fetchedAt };
  }

  async searchOffplan(p: OffplanSearchParams): Promise<SearchOutcome<OffplanSummary>> {
    const notes: string[] = [];
    const applied: Record<string, unknown> = { sort: "recently_updated" };
    const none = (filters: Record<string, unknown>): SearchOutcome<OffplanSummary> => ({
      status: "no_results",
      items: [],
      pagination: emptyPagination(p.page, p.page_size),
      applied_filters: filters,
      notes,
      data_as_of: null,
    });

    const needsSuggestions = !!(p.developers?.length || p.handover || p.area);
    const sugg = needsSuggestions ? await this.offplanSuggestions() : null;

    let developers: string[] | null = null;
    if (p.developers?.length && sugg) {
      const r = resolveDevelopers(p.developers, sugg.developers);
      if (r.unmatched.length) notes.push(`No Savoir off-plan projects are recorded for developer(s): ${r.unmatched.join(", ")}.`);
      if (!r.matched.length) return none({ developers: p.developers });
      developers = r.matched;
      applied.developers = r.matched;
    }

    let locations: string[] | null = null;
    if (p.area && sugg) {
      const n = normalizeName(p.area);
      const hits = n ? sugg.locations.filter((l) => normalizeName(l.label).includes(n)) : [];
      if (!hits.length) {
        notes.push(`No Savoir off-plan projects are recorded in "${p.area}".`);
        return none({ ...applied, area: p.area });
      }
      locations = hits.map((h) => h.slug);
      applied.area = p.area;
    }

    let variants: Array<string | null> = [null];
    if (p.handover && sugg) {
      const v = resolveHandover(p.handover, sugg.completionDates);
      if (!v.length) {
        notes.push(`No Savoir off-plan projects list a handover of "${p.handover}". Known values look like "Q3 - 2028" or "Ready To - Move in".`);
        return none({ ...applied, handover: p.handover });
      }
      variants = v.slice(0, MAX_HANDOVER_VARIANTS);
      applied.handover = variants;
    }

    const fetchPage = (completion_date: string | null, page: number, limit: number) =>
      this.client.postMeta<Record<string, unknown>>(
        `/api/search-offplan?${new URLSearchParams({ page: String(page), limit: String(limit), sort_field: "updated_at", sort_order: "desc" })}`,
        { developers, completion_date, locations },
        { cacheTtlMs: SEARCH_TTL_MS },
      );

    const totalOf = (raw: Record<string, unknown>) => {
      const pg = raw.pagination as Record<string, unknown> | undefined;
      return num(pg?.total);
    };

    const budget = p.max_starting_price_aed;
    if (budget !== undefined) applied.max_starting_price_aed = budget;

    if (variants.length === 1 && budget === undefined) {
      const { data: raw, fetchedAt } = await fetchPage(variants[0] ?? null, p.page, p.page_size);
      if (!raw || !Array.isArray(raw.data)) throw new CmsError("cms_invalid_response");
      const items = raw.data.map((d) => mapOffplanSummary(d, this.ctx)).filter((x): x is OffplanSummary => x !== null);
      const total = totalOf(raw) ?? items.length;
      const totalPages = num((raw.pagination as Record<string, unknown> | undefined)?.last_page) ?? Math.ceil(total / p.page_size);
      if (total > 0 && !items.length && p.page > totalPages) notes.push(`Page ${p.page} is beyond the last page (${totalPages}).`);
      return {
        status: total === 0 ? "no_results" : "ok",
        items,
        pagination: { page: p.page, page_size: p.page_size, total_results: total, total_pages: totalPages, has_more: p.page < totalPages },
        applied_filters: applied,
        notes,
        data_as_of: iso(fetchedAt),
      };
    }

    // Merge path: several stored spellings of the same handover (the CMS accepts only one
    // completion_date per request) and/or a budget, which must be applied to the whole set
    // before paginating. Each fetch is bounded to the CMS maximum page size.
    const merged = new Map<string, { raw: Record<string, unknown>; updated: string }>();
    let incomplete = false;
    let oldest = Number.MAX_SAFE_INTEGER;
    for (const v of variants) {
      const { data: raw, fetchedAt } = await fetchPage(v, 1, CMS_MAX_LIMIT);
      oldest = Math.min(oldest, fetchedAt);
      if (!raw || !Array.isArray(raw.data)) throw new CmsError("cms_invalid_response");
      if ((totalOf(raw) ?? 0) > CMS_MAX_LIMIT) incomplete = true;
      for (const d of raw.data) {
        if (!d || typeof d !== "object") continue;
        const r = d as Record<string, unknown>;
        const key = String(r.id ?? r.slug);
        merged.set(key, { raw: r, updated: typeof r.updated_at === "string" ? r.updated_at : "" });
      }
    }
    let all = [...merged.values()]
      .sort((a, b) => Date.parse(b.updated || "0") - Date.parse(a.updated || "0"))
      .map((e) => mapOffplanSummary(e.raw, this.ctx))
      .filter((x): x is OffplanSummary => x !== null);
    if (budget !== undefined) {
      const unpriced = all.filter((x) => x.starting_price_aed === null).length;
      all = all.filter((x) => x.starting_price_aed !== null && x.starting_price_aed <= budget);
      notes.push(
        `Matched on each project's published "starting from" price (its cheapest unit). Larger units cost more; exact unit prices are not published.`,
      );
      if (unpriced) notes.push(`${unpriced} matching project(s) publish no starting price (e.g. "Call Us") and are not included; ask Savoir about them.`);
    }
    if (incomplete) notes.push("Results may be incomplete: one handover period has more than 100 projects.");
    const total = all.length;
    const totalPages = Math.ceil(total / p.page_size);
    const start = (p.page - 1) * p.page_size;
    if (total > 0 && p.page > totalPages) notes.push(`Page ${p.page} is beyond the last page (${totalPages}).`);
    return {
      status: total === 0 ? "no_results" : "ok",
      items: all.slice(start, start + p.page_size),
      pagination: { page: p.page, page_size: p.page_size, total_results: total, total_pages: totalPages, has_more: p.page < totalPages },
      applied_filters: applied,
      notes,
      data_as_of: iso(oldest),
    };
  }

  async offplanDetails(slug: string): Promise<OffplanDetails | null> {
    return (await this.offplanDetailsMeta(slug)).details;
  }

  async offplanDetailsMeta(slug: string, fresh = false): Promise<{ details: OffplanDetails | null; fetchedAt: number }> {
    const { data: raw, fetchedAt } = await this.client.getMeta<unknown>(`/api/offplan-projects/${encodeURIComponent(slug)}`, {
      cacheTtlMs: DETAILS_TTL_MS,
      notFoundOnMissingRecord: true,
      fresh,
    });
    if (raw === null || (Array.isArray(raw) && raw.length === 0)) return { details: null, fetchedAt };
    const mapped = mapOffplanDetails(raw, this.ctx);
    if (!mapped) throw new CmsError("cms_invalid_response");
    return { details: mapped, fetchedAt };
  }

  budgetRemaining(): number {
    return this.client.budgetRemaining();
  }

  /**
   * POST /api/contact-us with exactly the body shape the website sends
   * (app/components/ContactUs/ContactUsForm.tsx). Any 2xx is treated as accepted.
   */
  async submitContactUs(payload: { type: "contact_us"; name: string; email: string; phone: string; message: string }): Promise<void> {
    await this.client.post("/api/contact-us", payload, { acceptNonJsonSuccess: true });
  }
}
