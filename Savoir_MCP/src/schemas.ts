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
  location: LocationSchema,
  photo: nullableString,
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
  image: nullableString,
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
