/**
 * CMS vocabulary, verified against live responses (Oct 2026).
 *
 * POST /api/search
 *   offering_type      "RS" (sale) | "RR" (rent) | null (both)
 *   completion_status  "completed" | "off_plan" | null
 *   type               single property_type code (an array causes HTTP 500)
 *   bedroom/bathroom   EXACT match; studio is bedroom 0. Non-numeric values
 *                      (e.g. "studio") are silently ignored by the CMS, which
 *                      would return every listing, so only integers are sent.
 *   min_price/max_price inclusive, AED
 *   query              array of exact (case-insensitive) location names from
 *                      /api/search-suggestions, OR-ed. Partial names match nothing.
 *   sort_field         price | updated_at | title_en (anything else falls back
 *                      to updated_at); sort_order asc | desc
 *   limit              capped at 100 by the CMS; 0/negative becomes 1
 *
 * POST /api/search-offplan
 *   developers         array of exact (case-insensitive) developer names, OR-ed
 *   completion_date    single exact string (array → HTTP 500)
 *   locations          array of off-plan project slugs (keys of the
 *                      suggestions "locations" map), not area names
 *   sort               only updated_at is honoured; sort_field=price → HTTP 500
 *   limit              0 → HTTP 500 (division by zero)
 */

export type Purpose = "buy" | "rent";
export type Completion = "ready" | "off_plan";

export const OFFERING_TYPE: Record<Purpose, "RS" | "RR"> = { buy: "RS", rent: "RR" };
export const COMPLETION_STATUS: Record<Completion, "completed" | "off_plan"> = {
  ready: "completed",
  off_plan: "off_plan",
};

/**
 * Searchable property types → CMS code. Codes come from the website's
 * TYPE_LABEL map, except offices: listings store "Office-space" (26 live
 * listings) while the website's "OF" code matches nothing.
 */
export const PROPERTY_TYPES = {
  apartment: { code: "AP", label: "Apartment" },
  villa: { code: "VI", label: "Villa" },
  villa_house: { code: "VH", label: "Villa/House" },
  townhouse: { code: "TH", label: "Townhouse" },
  penthouse: { code: "PH", label: "Penthouse" },
  duplex: { code: "DX", label: "Duplex" },
  hotel_apartment: { code: "HA", label: "Hotel Apartment" },
  bungalow: { code: "BW", label: "Bungalow" },
  land_plot: { code: "LP", label: "Land/Plot" },
  full_floor: { code: "FF", label: "Full Floor" },
  whole_building: { code: "WB", label: "Whole Building" },
  office: { code: "Office-space", label: "Office" },
  shop: { code: "SH", label: "Shop" },
  retail: { code: "RE", label: "Retail" },
  showroom: { code: "SR", label: "Showroom" },
  warehouse: { code: "WH", label: "Warehouse" },
} as const;

export type PropertyTypeKey = keyof typeof PROPERTY_TYPES;
export const PROPERTY_TYPE_KEYS = Object.keys(PROPERTY_TYPES) as [PropertyTypeKey, ...PropertyTypeKey[]];

/** Display labels for every code the website knows, plus the CMS office code. */
const TYPE_LABELS: Record<string, string> = {
  AP: "Apartment",
  BU: "Bulk Units",
  BW: "Bungalow",
  CD: "Compound",
  DX: "Duplex",
  FA: "Factory",
  FM: "Farm",
  FF: "Full Floor",
  HA: "Hotel Apartment",
  HF: "Half Floor",
  LC: "Labor Camp",
  LP: "Land/Plot",
  OF: "Office Space",
  "Office-space": "Office",
  BC: "Business Centre",
  PH: "Penthouse",
  RE: "Retail",
  RT: "Restaurant",
  SA: "Staff Accommodation",
  SH: "Shop",
  SR: "Showroom",
  CW: "Co-working Space",
  ST: "Storage",
  TH: "Townhouse",
  VH: "Villa/House",
  WB: "Whole Building",
  WH: "Warehouse",
  VI: "Villa",
};

export function propertyTypeLabel(code: unknown): string | null {
  return typeof code === "string" ? TYPE_LABELS[code] ?? null : null;
}

export const SORTS = {
  newest: { sort_field: "updated_at", sort_order: "desc" },
  price_low_to_high: { sort_field: "price", sort_order: "asc" },
  price_high_to_low: { sort_field: "price", sort_order: "desc" },
  title: { sort_field: "title_en", sort_order: "asc" },
} as const;
export type SortKey = keyof typeof SORTS;
export const SORT_KEYS = Object.keys(SORTS) as [SortKey, ...SortKey[]];

/** Largest page the CMS will return; also our upper bound for any single fetch. */
export const CMS_MAX_LIMIT = 100;
