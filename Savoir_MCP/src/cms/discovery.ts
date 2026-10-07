/**
 * Guided discovery on top of the verified CMS adapters:
 * missing-preference hints, labelled search recovery, per-listing amenity
 * verification, an inventory-backed area guide, and comparison/suitability.
 *
 * Principles: never present something the CMS cannot filter as a working filter;
 * alternatives are always labelled as alternatives; missing data is reported as missing.
 */
import { AREAS, AREA_GUIDE_REVIEW_STATUS, AREA_TAGS, nearbyAreas, type AreaTag } from "../data/areas.js";
import type { OffplanDetails, PropertyDetails, PropertySummary } from "../schemas.js";
import { AMENITIES, checkAmenities, type AmenityCheck, type AmenityKey } from "./amenities.js";
import { CmsError } from "./client.js";
import type { PropertySearchParams, SavoirCms, SearchOutcome } from "./service.js";
import { PROPERTY_TYPES } from "./vocab.js";

// ---------- requirements (customer's stated needs) ----------

export interface Requirements {
  purpose?: "buy" | "rent";
  budget_min_aed?: number;
  budget_max_aed?: number;
  bedrooms?: number; // 0 = studio
  areas?: string[];
  completion?: "ready" | "off_plan";
  must_have?: AmenityKey[];
  notes?: string;
}

// ---------- 1. guided discovery: the 1–2 most useful missing preferences ----------

export interface MissingPreference {
  field: "purpose" | "budget" | "bedrooms" | "area";
  question: string;
}

/** Ordered by how much each answer narrows a Dubai search. At most two are returned. */
export function missingPreferences(p: Partial<PropertySearchParams>): MissingPreference[] {
  const out: MissingPreference[] = [];
  if (!p.purpose) out.push({ field: "purpose", question: "Are you looking to buy or to rent?" });
  if (p.max_price === undefined && p.min_price === undefined)
    out.push({ field: "budget", question: p.purpose === "rent" ? "What is your rental budget in AED?" : "What is your budget in AED?" });
  if (p.bedrooms === undefined) out.push({ field: "bedrooms", question: "How many bedrooms do you need (or a studio)?" });
  if (!p.areas?.length)
    out.push({ field: "area", question: "Do you have preferred areas? If you don't know Dubai yet, I can suggest areas that fit your budget and lifestyle." });
  return out.slice(0, 2);
}

// ---------- 2. search recovery ----------

export interface Alternative {
  kind: "higher_budget" | "nearby_areas" | "any_bedrooms" | "any_type" | "ready_or_off_plan";
  /** Human description of exactly which requirement was relaxed. */
  description: string;
  total_results: number;
  sample: PropertySummary[];
  /** Arguments that reproduce this alternative with search_properties. */
  search_args: Record<string, unknown>;
}

const MAX_PROBES = 3;
const PROBE_RESERVE = 4; // keep some CMS budget for the customer's next actions

/**
 * When a search has no exact matches, run up to MAX_PROBES real, relaxed CMS searches
 * (one relaxation each) and report the ones that return listings. Skipped entirely
 * when the shared CMS budget is low, rather than risking the customer's next request.
 */
export async function recoverySearches(cms: SavoirCms, p: PropertySearchParams, resolvedAreas: string[]): Promise<{ alternatives: Alternative[]; skipped: string | null }> {
  const candidates: Array<{ kind: Alternative["kind"]; description: string; params: PropertySearchParams; describe?: (out: SearchOutcome<PropertySummary>) => string }> = [];
  const base: PropertySearchParams = { ...p, page: 1, page_size: 3 };

  if (p.max_price !== undefined) {
    // Same search without the budget limit, cheapest first: shows where prices actually start.
    const budget = p.max_price;
    candidates.push({
      kind: "higher_budget",
      description: "",
      params: { ...base, max_price: undefined, sort: "price_low_to_high" },
      describe: (out) => {
        const min = out.items.find((i) => i.price !== null)?.price ?? null;
        if (min === null) return "Without the budget limit";
        const near = min <= budget * 1.15 ? " (within 15% of the budget)" : "";
        return `Without the budget limit — prices start at AED ${min.toLocaleString("en-US")}${near}`;
      },
    });
  }
  if (resolvedAreas.length) {
    const near = nearbyAreas(resolvedAreas);
    if (near.length) candidates.push({ kind: "nearby_areas", description: `Nearby areas (editorial suggestion): ${near.join(", ")}`, params: { ...base, areas: near } });
  }
  if (p.bedrooms !== undefined) candidates.push({ kind: "any_bedrooms", description: "Any number of bedrooms", params: { ...base, bedrooms: undefined } });
  if (p.property_type) candidates.push({ kind: "any_type", description: `Any property type (not only ${PROPERTY_TYPES[p.property_type].label})`, params: { ...base, property_type: undefined } });
  if (p.completion) candidates.push({ kind: "ready_or_off_plan", description: "Both ready and off-plan", params: { ...base, completion: undefined } });

  const alternatives: Alternative[] = [];
  let probes = 0;
  for (const c of candidates) {
    if (probes >= MAX_PROBES) break;
    if (cms.budgetRemaining() < PROBE_RESERVE + 1) {
      return { alternatives, skipped: "Alternative searches were limited to protect the listings service; ask me to try a specific change." };
    }
    probes++;
    try {
      const out = await cms.searchProperties(c.params);
      if (out.pagination.total_results > 0) {
        const { page: _p, page_size: _s, ...args } = c.params;
        alternatives.push({ kind: c.kind, description: c.describe ? c.describe(out) : c.description, total_results: out.pagination.total_results, sample: out.items.slice(0, 3), search_args: toSearchArgs(args) });
      }
    } catch (err) {
      if (err instanceof CmsError) break; // don't hammer a struggling CMS
      throw err;
    }
  }
  return { alternatives, skipped: null };
}

/** Map internal params back to the public search_properties argument names. */
function toSearchArgs(p: Partial<PropertySearchParams>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (p.areas?.length) out.areas = p.areas;
  if (p.purpose) out.purpose = p.purpose;
  if (p.property_type) out.property_type = p.property_type;
  if (p.bedrooms !== undefined) out.bedrooms = p.bedrooms === 0 ? "studio" : p.bedrooms;
  if (p.bathrooms !== undefined) out.bathrooms = p.bathrooms;
  if (p.min_price !== undefined) out.min_price_aed = p.min_price;
  if (p.max_price !== undefined) out.max_price_aed = p.max_price;
  if (p.completion) out.completion = p.completion;
  if (p.sort) out.sort = p.sort;
  return out;
}

// ---------- lifestyle: per-listing amenity verification ----------

export const MAX_AMENITY_CHECKS = 6;

export interface AmenityAnnotated {
  item: PropertySummary;
  amenity_check: AmenityCheck | null; // null = not checked
}

/**
 * Verify requested amenities on up to MAX_AMENITY_CHECKS listings (details are cached and coalesced).
 * Listings are never dropped: full matches are ordered first, and unchecked listings are marked as such.
 */
export async function verifyAmenities(cms: SavoirCms, items: PropertySummary[], wanted: AmenityKey[]): Promise<{ annotated: AmenityAnnotated[]; checked: number; note: string }> {
  const annotated: AmenityAnnotated[] = items.map((item) => ({ item, amenity_check: null }));
  let checked = 0;
  for (const a of annotated) {
    if (checked >= MAX_AMENITY_CHECKS || cms.budgetRemaining() < PROBE_RESERVE) break;
    try {
      const d = await cms.propertyDetails(a.item.slug);
      if (d) {
        a.amenity_check = checkAmenities(d.amenities, wanted);
        checked++;
      }
    } catch (err) {
      if (err instanceof CmsError) break;
      throw err;
    }
  }
  const rank = (a: AmenityAnnotated) => (a.amenity_check ? (a.amenity_check.not_listed.length === 0 ? 0 : 1) : 2);
  annotated.sort((x, y) => rank(x) - rank(y));
  const labels = wanted.map((k) => AMENITIES[k].label).join(", ");
  const note =
    `Requested amenities (${labels}) were checked against each listing's published amenity list for ${checked} of ${items.length} listings shown. ` +
    `The listings service cannot search by amenity, so other listings may also have them; "not listed" means the listing does not mention it.`;
  return { annotated, checked, note };
}

// ---------- area guide (inventory statistics + editorial tags) ----------

export interface AreaGuideEntry {
  area: string;
  matching_listings: number;
  price_range_aed: { min: number; max: number } | null;
  tags: string[];
  nearby: string[];
}

export interface AreaGuide {
  areas: AreaGuideEntry[];
  inventory_listings: number;
  inventory_complete: boolean;
  data_as_of: string;
  editorial_status: string;
  notes: string[];
}

export async function areaGuide(
  cms: SavoirCms,
  f: { purpose?: "buy" | "rent"; budget_min_aed?: number; budget_max_aed?: number; bedrooms?: number; tags?: AreaTag[]; limit?: number },
): Promise<AreaGuide> {
  const inv = await cms.inventory();
  const purpose = f.purpose === "buy" ? "sale" : f.purpose === "rent" ? "rent" : null;
  const stats = new Map<string, { n: number; min: number; max: number }>();
  for (const it of inv.items) {
    if (!it.community) continue;
    if (purpose && it.purpose !== purpose) continue;
    if (f.bedrooms !== undefined && it.bedrooms !== f.bedrooms) continue;
    if (it.price !== null && f.budget_max_aed !== undefined && it.price > f.budget_max_aed) continue;
    if (it.price !== null && f.budget_min_aed !== undefined && it.price < f.budget_min_aed) continue;
    const s = stats.get(it.community) ?? { n: 0, min: Number.POSITIVE_INFINITY, max: 0 };
    s.n++;
    if (it.price !== null) {
      s.min = Math.min(s.min, it.price);
      s.max = Math.max(s.max, it.price);
    }
    stats.set(it.community, s);
  }
  let entries: AreaGuideEntry[] = [...stats.entries()].map(([area, s]) => ({
    area,
    matching_listings: s.n,
    price_range_aed: s.max > 0 ? { min: s.min, max: s.max } : null,
    tags: (AREAS[area]?.tags ?? []).map((t) => AREA_TAGS[t]),
    nearby: AREAS[area]?.nearby ?? [],
  }));
  if (f.tags?.length) {
    const wanted = f.tags.map((t) => AREA_TAGS[t]);
    entries = entries.filter((e) => wanted.some((w) => e.tags.includes(w)));
  }
  entries.sort((a, b) => b.matching_listings - a.matching_listings);
  const notes = [
    "Listing counts and price ranges come from Savoir's current listings; tags and nearby areas are an editorial guide.",
    "Rent prices are shown as listed. A rent period is shown only when the listing data states it (rent_period); otherwise the period is not stated.",
  ];
  if (!inv.complete) notes.push(`Statistics cover the first ${inv.items.length} of ${inv.total} listings.`);
  return {
    areas: entries.slice(0, f.limit ?? 8),
    inventory_listings: inv.items.length,
    inventory_complete: inv.complete,
    data_as_of: new Date(inv.fetchedAt).toISOString(),
    editorial_status: AREA_GUIDE_REVIEW_STATUS,
    notes,
  };
}

// ---------- comparison and suitability ----------

export type Fit = "meets" | "does_not_meet" | "unknown";

export interface SuitabilityCheck {
  requirement: string;
  fit: Fit;
  detail: string;
  /** A failed hard requirement (buy vs rent) means the listing does not fit, whatever else matches. */
  hard?: boolean;
}

export interface Suitability {
  summary: "fits_all_stated" | "partly_fits" | "does_not_fit" | "some_unknown" | "no_requirements";
  checks: SuitabilityCheck[];
}

/** "meets" only when every stated requirement is verified; unknowns are never counted as a fit or a miss. */
export function summarise(checks: SuitabilityCheck[]): Suitability["summary"] {
  if (checks.length === 0) return "no_requirements";
  if (checks.some((c) => c.hard && c.fit === "does_not_meet")) return "does_not_fit";
  const no = checks.some((c) => c.fit === "does_not_meet");
  const yes = checks.some((c) => c.fit === "meets");
  if (no) return yes ? "partly_fits" : "does_not_fit";
  return checks.every((c) => c.fit === "meets") ? "fits_all_stated" : "some_unknown";
}

const fmt = (n: number) => `AED ${n.toLocaleString("en-US")}`;

export function propertySuitability(d: PropertyDetails, r: Requirements | undefined): Suitability {
  const checks: SuitabilityCheck[] = [];
  if (!r) return { summary: "no_requirements", checks };
  if (r.purpose) {
    const want = r.purpose === "buy" ? "sale" : "rent";
    checks.push({ requirement: r.purpose === "buy" ? "For sale" : "For rent", fit: d.purpose === null ? "unknown" : d.purpose === want ? "meets" : "does_not_meet", detail: d.purpose ?? "not provided", hard: true });
  }
  if (r.budget_max_aed !== undefined || r.budget_min_aed !== undefined) {
    const label = r.budget_max_aed !== undefined ? `Budget up to ${fmt(r.budget_max_aed)}` : `Budget from ${fmt(r.budget_min_aed!)}`;
    if (d.price === null) checks.push({ requirement: label, fit: "unknown", detail: "price not provided" });
    else {
      const over = r.budget_max_aed !== undefined && d.price > r.budget_max_aed;
      const under = r.budget_min_aed !== undefined && d.price < r.budget_min_aed;
      const detail = over ? `${fmt(d.price)} (${Math.round(((d.price - r.budget_max_aed!) / r.budget_max_aed!) * 100)}% over)` : fmt(d.price);
      checks.push({ requirement: label, fit: over || under ? "does_not_meet" : "meets", detail });
    }
  }
  if (r.bedrooms !== undefined) {
    const want = r.bedrooms === 0 ? "Studio" : `${r.bedrooms} bedroom${r.bedrooms === 1 ? "" : "s"}`;
    checks.push({ requirement: want, fit: d.bedrooms === null ? "unknown" : d.bedrooms === r.bedrooms ? "meets" : "does_not_meet", detail: d.bedrooms_label ?? "not provided" });
  }
  if (r.areas?.length) {
    const inArea = [d.location.community, d.location.sub_community].some((x) => x && r.areas!.some((a) => a.toLowerCase() === x.toLowerCase()));
    checks.push({ requirement: `Area: ${r.areas.join(" / ")}`, fit: d.location.community === null ? "unknown" : inArea ? "meets" : "does_not_meet", detail: d.location.label ?? "not provided" });
  }
  if (r.completion) {
    checks.push({ requirement: r.completion === "ready" ? "Ready to move in" : "Off-plan", fit: d.completion === null ? "unknown" : d.completion === r.completion ? "meets" : "does_not_meet", detail: d.completion ?? "not provided" });
  }
  if (r.must_have?.length) {
    const c = checkAmenities(d.amenities, r.must_have);
    for (const k of r.must_have) {
      checks.push({ requirement: AMENITIES[k].label, fit: c.matched.includes(k) ? "meets" : "unknown", detail: c.matched.includes(k) ? "listed" : "not listed by the listing" });
    }
  }
  return { summary: summarise(checks), checks };
}

export function offplanSuitability(d: OffplanDetails, r: Requirements | undefined): Suitability {
  const checks: SuitabilityCheck[] = [];
  if (!r) return { summary: "no_requirements", checks };
  if (r.budget_max_aed !== undefined) {
    checks.push({
      requirement: `Budget up to ${fmt(r.budget_max_aed)}`,
      fit: d.starting_price_aed === null ? "unknown" : d.starting_price_aed <= r.budget_max_aed ? "meets" : "does_not_meet",
      detail: d.starting_price_aed === null ? "no published starting price" : `starts from ${fmt(d.starting_price_aed)} (cheapest unit)`,
    });
  }
  if (r.completion) checks.push({ requirement: r.completion === "ready" ? "Ready to move in" : "Off-plan", fit: r.completion === "off_plan" ? "meets" : "does_not_meet", detail: `handover ${d.handover ?? "not provided"}` });
  if (r.areas?.length) {
    const hay = `${d.location ?? ""} ${d.area ?? ""}`.toLowerCase();
    checks.push({ requirement: `Area: ${r.areas.join(" / ")}`, fit: hay.trim() ? (r.areas.some((a) => hay.includes(a.toLowerCase())) ? "meets" : "does_not_meet") : "unknown", detail: d.location ?? "not provided" });
  }
  return { summary: summarise(checks), checks };
}

export type CompareRef = { kind: "property" | "offplan"; slug: string };

export interface ComparedProperty {
  kind: "property";
  slug: string;
  available: boolean;
  details: PropertyDetails | null;
  suitability: Suitability | null;
}
export interface ComparedOffplan {
  kind: "offplan";
  slug: string;
  available: boolean;
  details: OffplanDetails | null;
  suitability: Suitability | null;
}

export async function compareListings(cms: SavoirCms, refs: CompareRef[], r: Requirements | undefined): Promise<{ items: Array<ComparedProperty | ComparedOffplan>; data_as_of: string }> {
  let oldest = Date.now();
  const items = await Promise.all(
    refs.map(async (ref): Promise<ComparedProperty | ComparedOffplan> => {
      if (ref.kind === "offplan") {
        try {
          const { details, fetchedAt } = await cms.offplanDetailsMeta(ref.slug);
          oldest = Math.min(oldest, fetchedAt);
          return { kind: "offplan", slug: ref.slug, available: !!details, details, suitability: details ? offplanSuitability(details, r) : null };
        } catch (err) {
          if (err instanceof CmsError && err.code === "cms_not_found") return { kind: "offplan", slug: ref.slug, available: false, details: null, suitability: null };
          throw err;
        }
      }
      try {
        const { details, fetchedAt } = await cms.propertyDetailsMeta(ref.slug);
        oldest = Math.min(oldest, fetchedAt);
        return { kind: "property", slug: ref.slug, available: !!details, details, suitability: details ? propertySuitability(details, r) : null };
      } catch (err) {
        if (err instanceof CmsError && err.code === "cms_not_found") return { kind: "property", slug: ref.slug, available: false, details: null, suitability: null };
        throw err;
      }
    }),
  );
  return { items, data_as_of: new Date(oldest).toISOString() };
}

export type { SearchOutcome };
