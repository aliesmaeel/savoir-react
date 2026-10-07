/**
 * Output shapes shared by tools, the widget and tests.
 * These are deliberately small projections of CMS records, never raw copies.
 */
import { z } from "zod";

const nullableString = z.string().nullable();
const nullableNumber = z.number().nullable();

export const LocationSchema = z.object({
  community: nullableString,
  sub_community: nullableString,
  city: nullableString,
  label: nullableString,
});

/**
 * Where a listing can be shown on a map. "area": the community centre (not the building).
 * "approximate": the centre of the developer's own map view of the project. Never an exact position.
 */
export const MapPointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  precision: z.enum(["area", "approximate"]),
  radius_m: z.number(),
  area: nullableString,
});
export type MapPoint = z.infer<typeof MapPointSchema>;

export const PropertySummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  url: z.string(),
  purpose: z.enum(["sale", "rent"]).nullable(),
  completion: z.enum(["ready", "off_plan"]).nullable(),
  property_type: nullableString,
  bedrooms: nullableNumber,
  bedrooms_label: nullableString,
  bathrooms: nullableNumber,
  price: nullableNumber,
  currency: nullableString,
  price_label: nullableString,
  /** Rent listings only, and only when the CMS states the period for this listing (never inferred). */
  rent_period: z.enum(["year", "month", "week", "day"]).nullable(),
  location: LocationSchema,
  photo: nullableString,
  map_point: MapPointSchema.nullable(),
});
export type PropertySummary = z.infer<typeof PropertySummarySchema>;

export const AgentSchema = z.object({
  name: z.string(),
  email: nullableString,
  phone: nullableString,
  whatsapp_url: nullableString,
});
export type Agent = z.infer<typeof AgentSchema>;

export const PropertyDetailsSchema = PropertySummarySchema.extend({
  reference_number: nullableString,
  permit_number: nullableString,
  building: nullableString,
  size_sqft: nullableNumber,
  /** Sale listings with a verified size only. */
  price_per_sqft_aed: nullableNumber,
  amenities: z.array(z.string()),
  photos: z.array(z.string()),
  floor_plan_url: nullableString,
  description: nullableString,
  agent: AgentSchema.nullable(),
  updated_at: nullableString,
  similar_properties: z.array(PropertySummarySchema),
});
export type PropertyDetails = z.infer<typeof PropertyDetailsSchema>;

export const OffplanSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  url: z.string(),
  developer: nullableString,
  location: nullableString,
  handover: nullableString,
  starting_price_label: nullableString,
  /** Parsed "starting from" price (cheapest unit) in AED; null when not a price (e.g. "Call Us"). */
  starting_price_aed: nullableNumber,
  image: nullableString,
  map_point: MapPointSchema.nullable(),
});
export type OffplanSummary = z.infer<typeof OffplanSummarySchema>;

export const PaymentPlanSchema = z.object({
  down_payment: nullableString,
  during_construction: nullableString,
  on_handover: nullableString,
});

export const OffplanDetailsSchema = OffplanSummarySchema.extend({
  area: nullableString,
  unit_sizes: nullableString,
  title_type: nullableString,
  lifestyle: nullableString,
  payment_plan: PaymentPlanSchema.nullable(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  video_url: nullableString,
  description: nullableString,
});
export type OffplanDetails = z.infer<typeof OffplanDetailsSchema>;

export const PaginationSchema = z.object({
  page: z.number(),
  page_size: z.number(),
  total_results: z.number(),
  total_pages: z.number(),
  has_more: z.boolean(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const ErrorInfoSchema = z.object({ code: z.string(), message: z.string() });

/** Every tool result carries one of these statuses so "no matches" is never confused with a failure. */
export const StatusSchema = z.enum(["ok", "no_results", "not_found", "error", "needs_confirmation", "sent", "dry_run", "invalid_input"]);
export type Status = z.infer<typeof StatusSchema>;

export const ContactOptionsSchema = z.object({
  website_url: z.string(),
  contact_page_url: z.string(),
  email: z.string(),
  email_url: z.string(),
  phone: z.string(),
  phone_url: z.string(),
  whatsapp_url: z.string(),
  office_address: z.string(),
  property_agent: AgentSchema.nullable().optional(),
  property_url: z.string().nullable().optional(),
  online_inquiries_enabled: z.boolean(),
});
export type ContactOptions = z.infer<typeof ContactOptionsSchema>;

// ---------- customer journey (Milestone 1) ----------

export const AmenityCheckSchema = z.object({ matched: z.array(z.string()), not_listed: z.array(z.string()) });

/** Button links: signed click-tracking redirects when analytics are on, plain links otherwise. */
export const LinksSchema = z.object({ website: z.string(), whatsapp: z.string() });

export const PropertyListItemSchema = PropertySummarySchema.extend({
  saved: z.boolean(),
  links: LinksSchema,
  /** null = amenities not checked for this listing. */
  amenity_check: AmenityCheckSchema.nullable(),
});
export type PropertyListItem = z.infer<typeof PropertyListItemSchema>;

export const OffplanListItemSchema = OffplanSummarySchema.extend({ saved: z.boolean(), links: LinksSchema });

export const MissingPreferenceSchema = z.object({ field: z.enum(["purpose", "budget", "bedrooms", "area"]), question: z.string() });

export const AlternativeSchema = z.object({
  kind: z.enum(["higher_budget", "nearby_areas", "any_bedrooms", "any_type", "ready_or_off_plan"]),
  description: z.string(),
  total_results: z.number(),
  sample: z.array(PropertySummarySchema),
  search_args: z.record(z.string(), z.unknown()),
});

export const SuitabilitySchema = z.object({
  summary: z.enum(["fits_all_stated", "partly_fits", "does_not_fit", "some_unknown", "no_requirements"]),
  checks: z.array(z.object({ requirement: z.string(), fit: z.enum(["meets", "does_not_meet", "unknown"]), detail: z.string(), hard: z.boolean().optional() })),
});

export const PaymentScheduleSchema = z.object({
  unit_price_aed: z.number(),
  stages: z.array(z.object({ stage: z.string(), label: z.string(), percent: z.number(), amount_aed: z.number() })),
  total_percent: z.number(),
  notes: z.array(z.string()),
});

export const ShortlistEntrySchema = z.object({
  kind: z.enum(["property", "offplan"]),
  slug: z.string(),
  added_at: z.string(),
  available: z.boolean().nullable(),
  title: z.string().nullable(),
  url: z.string().nullable(),
  price_label: z.string().nullable(),
  photo: z.string().nullable(),
  location_label: z.string().nullable(),
  bedrooms_label: z.string().nullable(),
});

export const ShortlistSchema = z.object({
  shortlist_id: z.string(),
  items: z.array(ShortlistEntrySchema),
  expires_at: z.string(),
  share_url: z.string().nullable(),
  persistence: z.string(),
});
export type ShortlistView = z.infer<typeof ShortlistSchema>;

export const AreaGuideSchema = z.object({
  areas: z.array(
    z.object({
      area: z.string(),
      matching_listings: z.number(),
      price_range_aed: z.object({ min: z.number(), max: z.number() }).nullable(),
      tags: z.array(z.string()),
      nearby: z.array(z.string()),
    }),
  ),
  inventory_listings: z.number(),
  inventory_complete: z.boolean(),
  data_as_of: z.string(),
  editorial_status: z.string(),
  notes: z.array(z.string()),
});

export const HandoffSchema = z.object({
  reference_code: z.string(),
  language: z.enum(["en", "ar"]),
  message: z.string(),
  listings: z.array(z.object({ kind: z.enum(["property", "offplan"]), slug: z.string(), title: z.string(), url: z.string(), price_label: z.string().nullable(), verified_at: z.string() })),
  unavailable: z.array(z.object({ kind: z.enum(["property", "offplan"]), slug: z.string() })),
  channels: z.object({
    whatsapp_company: z.string(),
    whatsapp_agent: z.object({ name: z.string(), url: z.string() }).nullable(),
    email: z.string(),
    phone: z.string(),
  }),
  shared_information: z.string(),
  live_submission_available: z.boolean(),
});
