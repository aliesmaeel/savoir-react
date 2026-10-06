import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { AMENITY_KEYS, type AmenityKey } from "../cms/amenities.js";
import { CmsError } from "../cms/client.js";
import { missingPreferences, recoverySearches, verifyAmenities, type Alternative } from "../cms/discovery.js";
import { paymentSchedule } from "../cms/offplanPrice.js";
import { isValidSlug, safeEmail } from "../cms/sanitize.js";
import { PROPERTY_TYPE_KEYS, SORT_KEYS } from "../cms/vocab.js";
import { companyContact, privacyPolicyUrl } from "../contact.js";
import { REFERENCE_CODE_RE } from "../handoff.js";
import { buildContactPayload, type InquiryInput, type ListingRef } from "../inquiry.js";
import {
  AlternativeSchema,
  LinksSchema,
  ContactOptionsSchema,
  ErrorInfoSchema,
  MissingPreferenceSchema,
  OffplanDetailsSchema,
  OffplanListItemSchema,
  PaginationSchema,
  PaymentScheduleSchema,
  PropertyDetailsSchema,
  PropertyListItemSchema,
  StatusSchema,
  type PropertyListItem,
} from "../schemas.js";
import { budgetBand, cmsNotFound, instrument, listingLinks, ListingRefInput, pageInput, READ_ONLY, RequirementsInput, shortlistIdInput, slugInput, text, toErrorInfo, widgetMeta, type ToolDeps } from "./common.js";
import { alternativesText, asOfLine, contactText, missingText, offplanDetailsText, offplanSearchText, propertyDetailsText, propertySearchText, scheduleText } from "./format.js";
import { registerJourneyTools } from "./journey.js";

export type { ToolDeps } from "./common.js";

// ---------- output schemas ----------

const PropertyListOutput = z.object({
  view: z.literal("property_list"),
  status: StatusSchema,
  items: z.array(PropertyListItemSchema),
  pagination: PaginationSchema.nullable(),
  applied_filters: z.record(z.string(), z.unknown()),
  notes: z.array(z.string()),
  data_as_of: z.string().nullable(),
  missing_preferences: z.array(MissingPreferenceSchema),
  alternatives: z.array(AlternativeSchema),
  amenity_note: z.string().nullable(),
  shortlist_id: z.string().nullable(),
  error: ErrorInfoSchema.nullable(),
});

const PropertyDetailOutput = z.object({
  view: z.literal("property_detail"),
  status: StatusSchema,
  property: PropertyDetailsSchema.nullable(),
  links: LinksSchema.nullable(),
  saved: z.boolean(),
  shortlist_id: z.string().nullable(),
  data_as_of: z.string().nullable(),
  error: ErrorInfoSchema.nullable(),
});

const OffplanListOutput = z.object({
  view: z.literal("offplan_list"),
  status: StatusSchema,
  items: z.array(OffplanListItemSchema),
  pagination: PaginationSchema.nullable(),
  applied_filters: z.record(z.string(), z.unknown()),
  notes: z.array(z.string()),
  data_as_of: z.string().nullable(),
  shortlist_id: z.string().nullable(),
  error: ErrorInfoSchema.nullable(),
});

const OffplanDetailOutput = z.object({
  view: z.literal("offplan_detail"),
  status: StatusSchema,
  project: OffplanDetailsSchema.nullable(),
  links: LinksSchema.nullable(),
  payment_schedule: PaymentScheduleSchema.nullable(),
  payment_schedule_note: z.string().nullable(),
  saved: z.boolean(),
  shortlist_id: z.string().nullable(),
  data_as_of: z.string().nullable(),
  error: ErrorInfoSchema.nullable(),
});

const ContactOutput = z.object({ status: StatusSchema, contact: ContactOptionsSchema, notes: z.array(z.string()) });

const InquiryOutput = z.object({
  status: StatusSchema,
  sent: z.boolean(),
  preview: z
    .object({
      to: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      message: z.string(),
      listing_urls: z.array(z.string()),
      privacy_policy_url: z.string(),
    })
    .nullable(),
  confirmation_token: z.string().nullable(),
  expires_at: z.string().nullable(),
  message: z.string(),
  error: ErrorInfoSchema.nullable(),
});

// ---------- input schemas ----------

export const SearchPropertiesInput = z.object({
  areas: z
    .array(z.string().trim().min(1).max(80))
    .max(5)
    .optional()
    .describe('Location names, e.g. ["Dubai Marina"], ["JBR", "Palm Jumeirah"]. Matched against Savoir\'s location list; partial names expand to matching locations.'),
  purpose: z.enum(["buy", "rent"]).optional().describe("buy = for sale, rent = for rent. Omit for both."),
  property_type: z.enum(PROPERTY_TYPE_KEYS).optional().describe("One property type."),
  bedrooms: z
    .union([z.literal("studio"), z.number().int().min(0).max(10)])
    .optional()
    .describe('Exact bedroom count; "studio" (or 0) for studios. The CMS matches exactly, so "3+" is not supported — search 3, 4, … separately.'),
  bathrooms: z.number().int().min(0).max(10).optional().describe("Exact bathroom count."),
  min_price_aed: z.number().min(0).max(10_000_000_000).optional().describe("Minimum price in AED (inclusive)."),
  max_price_aed: z.number().min(0).max(10_000_000_000).optional().describe("Maximum price in AED (inclusive)."),
  completion: z.enum(["ready", "off_plan"]).optional().describe("ready = completed, off_plan = under construction (resale/off-plan listings)."),
  must_have: z
    .array(z.enum(AMENITY_KEYS))
    .max(6)
    .optional()
    .describe("Lifestyle needs to VERIFY on the listings shown (e.g. private_pool, water_view). Not a search filter: listings are checked and ordered, never hidden."),
  sort: z.enum(SORT_KEYS).optional().describe("Default: newest."),
  shortlist_id: shortlistIdInput,
  ...pageInput,
});

export const SearchOffplanInput = z.object({
  developers: z
    .array(z.string().trim().min(1).max(80))
    .max(5)
    .optional()
    .describe('Developer names, e.g. ["Emaar"], ["Sobha Group", "Binghatti"]. Matched against Savoir\'s developer list.'),
  handover: z.string().trim().min(1).max(40).optional().describe('Handover/completion period: a quarter ("Q3 2028"), a year ("2028") or "ready".'),
  area: z.string().trim().min(1).max(80).optional().describe('Area or community, e.g. "Business Bay", "Dubai Hills".'),
  max_starting_price_aed: z
    .number()
    .min(10_000)
    .max(10_000_000_000)
    .optional()
    .describe("Budget: matches projects whose published 'starting from' price (cheapest unit) is at or below this. Not the price of any specific unit."),
  shortlist_id: shortlistIdInput,
  ...pageInput,
});

export const InquiryInputSchema = z.object({
  listings: z.array(ListingRefInput).max(4).optional().describe("Listings the inquiry is about (from prepare_inquiry)."),
  requirements: RequirementsInput.optional(),
  reference_code: z.string().regex(REFERENCE_CODE_RE).optional().describe("The SAV-XXXXXX code from prepare_inquiry."),
  inquiry_type: z.enum(["viewing_request", "more_information", "general"]).default("more_information"),
  name: z.string().trim().min(2).max(100).describe("The user's full name, as they provided it."),
  email: z.string().trim().min(3).max(254).describe("The user's email address, as they provided it."),
  phone: z.string().trim().max(25).optional().describe("The user's phone number, if they provided one."),
  message: z.string().max(1500).optional().describe("The user's own message to Savoir."),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Preferred viewing date YYYY-MM-DD (a request, not a booking)."),
  preferred_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().describe("Preferred time HH:MM, 24h (a request, not a booking)."),
  confirm: z.boolean().default(false).describe("Leave false on the first call to get a preview. Set true only after the user has explicitly approved that exact preview."),
  confirmation_token: z.string().max(200).optional().describe("Token from the preview call. Required when confirm is true."),
});

// ---------- registration ----------

export function registerTools(server: McpServer, deps: ToolDeps): void {
  const { cms, config, logger, shortlists, analytics } = deps;

  const savedKeys = (id: string | undefined) => new Set((id ? shortlists.get(id)?.items ?? [] : []).map((i) => `${i.kind}:${i.slug}`));
  const knownShortlist = (id: string | undefined) => (id && shortlists.get(id) ? id : null);

  registerAppTool(
    server,
    "search_properties",
    {
      title: "Search Savoir properties",
      description:
        "Search Savoir Properties' current listings in Dubai (sale and rent, ready and off-plan resale). " +
        "Filters: area, buy/rent, property type, exact bedrooms (studio supported), exact bathrooms, AED price range, ready/off-plan. " +
        "Optional must_have verifies lifestyle needs (pool, water view, maid's room…) on the listings shown. " +
        "If the customer is vague, search anyway and ask at most the two questions in missing_preferences. " +
        "When nothing matches, the result includes labelled ALTERNATIVES (what was relaxed); never present them as exact matches. " +
        "For new developer projects use search_offplan_projects. If the customer doesn't know Dubai, use get_area_guide first.",
      inputSchema: SearchPropertiesInput,
      outputSchema: PropertyListOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Searching Savoir listings…", "Savoir listings ready"),
    },
    instrument(logger, "search_properties", async (a: z.infer<typeof SearchPropertiesInput>) => {
      const base = {
        view: "property_list" as const,
        items: [] as PropertyListItem[],
        pagination: null,
        applied_filters: {},
        notes: [] as string[],
        data_as_of: null,
        missing_preferences: [],
        alternatives: [] as Alternative[],
        amenity_note: null,
        shortlist_id: knownShortlist(a.shortlist_id),
      };
      if (a.min_price_aed !== undefined && a.max_price_aed !== undefined && a.min_price_aed > a.max_price_aed) {
        const error = { code: "invalid_input", message: "min_price_aed must not be greater than max_price_aed." };
        return { content: text(error.message), structuredContent: { ...base, status: "invalid_input" as const, error }, isError: true };
      }
      const params = {
        areas: a.areas,
        purpose: a.purpose,
        property_type: a.property_type,
        bedrooms: a.bedrooms === "studio" ? 0 : a.bedrooms,
        bathrooms: a.bathrooms,
        min_price: a.min_price_aed,
        max_price: a.max_price_aed,
        completion: a.completion,
        sort: a.sort,
        page: a.page,
        page_size: a.page_size,
      };
      try {
        const out = await cms.searchProperties(params);
        const missing = missingPreferences(params);
        let alternatives: Alternative[] = [];
        let recoveryText = "";
        if (out.status === "no_results" && a.page === 1) {
          if (out.data_as_of === null) {
            recoveryText = "\nThe location wasn't recognised. Use get_area_guide to suggest Savoir areas that fit the customer's budget and lifestyle.";
          } else {
            const resolved = (out.applied_filters.areas as string[] | undefined) ?? [];
            const r = await recoverySearches(cms, params, resolved);
            alternatives = r.alternatives;
            recoveryText = alternativesText(r.alternatives, r.skipped);
          }
        }
        const wanted = (a.must_have ?? []) as AmenityKey[];
        let ordered = out.items.map((item) => ({ item, amenity_check: null as { matched: string[]; not_listed: string[] } | null }));
        let amenityNote: string | null = null;
        if (wanted.length && out.items.length) {
          const v = await verifyAmenities(cms, out.items, wanted);
          ordered = v.annotated.map((x) => ({ item: x.item, amenity_check: x.amenity_check ? { matched: x.amenity_check.matched, not_listed: x.amenity_check.not_listed } : null }));
          amenityNote = v.note;
        }
        const saved = savedKeys(a.shortlist_id);
        const items: PropertyListItem[] = ordered.map((o) => ({
          ...o.item,
          saved: saved.has(`property:${o.item.slug}`),
          links: listingLinks(deps.links, { kind: "property", slug: o.item.slug, url: o.item.url }, "card"),
          amenity_check: o.amenity_check,
        }));

        analytics.record("search", {
          purpose: a.purpose ?? "any",
          budget_band: budgetBand(a.max_price_aed, a.purpose),
          bedrooms: a.bedrooms === undefined ? "any" : String(a.bedrooms),
          type: a.property_type ?? "any",
          completion: a.completion ?? "any",
          must_have: wanted.length > 0,
          outcome: out.status,
          alternatives: alternatives.length,
        });
        for (const area of (out.applied_filters.areas as string[] | undefined) ?? []) analytics.record("search_area", { area, outcome: out.status });

        const amenityText = amenityNote
          ? `\n${amenityNote}\n${items
              .filter((i) => i.amenity_check)
              .map((i) => `- ${i.title}: ${i.amenity_check!.matched.length ? `has ${i.amenity_check!.matched.join(", ")}` : "none of the requested amenities listed"}${i.amenity_check!.not_listed.length ? `; not listed: ${i.amenity_check!.not_listed.join(", ")}` : ""}`)
              .join("\n")}`
          : "";
        const textOut = propertySearchText({ ...out, items }) + amenityText + recoveryText + missingText(missing) + `\n${asOfLine(out.data_as_of)}`;
        return {
          content: text(textOut),
          structuredContent: {
            ...base,
            ...out,
            items,
            missing_preferences: missing,
            alternatives,
            amenity_note: amenityNote,
            error: null,
          },
        };
      } catch (err) {
        const error = toErrorInfo(err);
        return {
          content: text(`Search failed: ${error.message} (This is a service error, not an empty result.)`),
          structuredContent: { ...base, status: "error" as const, error },
          isError: true,
        };
      }
    }),
  );

  registerAppTool(
    server,
    "get_property_details",
    {
      title: "Get Savoir property details",
      description:
        "Full details for one Savoir listing by slug: photos, price and currency, price per sq ft (sale listings with a known size), location, size, amenities, " +
        "reference and permit number, the listing agent's public contact, the website link and similar listings.",
      inputSchema: z.object({ slug: slugInput, shortlist_id: shortlistIdInput }),
      outputSchema: PropertyDetailOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Loading property…", "Property loaded"),
    },
    instrument(logger, "get_property_details", async ({ slug, shortlist_id }: { slug: string; shortlist_id?: string }) => {
      const base = { view: "property_detail" as const, property: null, links: null, saved: false, shortlist_id: knownShortlist(shortlist_id), data_as_of: null };
      if (!isValidSlug(slug)) {
        const error = { code: "invalid_input", message: "That is not a valid listing slug. Use the slug from a search result." };
        return { content: text(error.message), structuredContent: { ...base, status: "invalid_input" as const, error }, isError: true };
      }
      try {
        const { details: property, fetchedAt } = await cms.propertyDetailsMeta(slug);
        if (!property) {
          const error = { code: "not_found", message: "No Savoir listing exists with that slug. It may have been removed." };
          return { content: text(error.message), structuredContent: { ...base, status: "not_found" as const, error } };
        }
        analytics.record("detail_view", { kind: "property" }, { kind: "property", slug });
        const asOf = new Date(fetchedAt).toISOString();
        const saved = savedKeys(shortlist_id).has(`property:${slug}`);
        return {
          content: text(`${propertyDetailsText(property)}\n${asOfLine(asOf)}`),
          structuredContent: { ...base, status: "ok" as const, property, links: listingLinks(deps.links, { kind: "property", slug, url: property.url }, "detail", property.agent?.phone), saved, data_as_of: asOf, error: null },
        };
      } catch (err) {
        if (cmsNotFound(err)) {
          const error = { code: "not_found", message: (err as CmsError).publicMessage };
          return { content: text(error.message), structuredContent: { ...base, status: "not_found" as const, error } };
        }
        const error = toErrorInfo(err);
        return { content: text(`Could not load the listing: ${error.message}`), structuredContent: { ...base, status: "error" as const, error }, isError: true };
      }
    }),
  );

  registerAppTool(
    server,
    "search_offplan_projects",
    {
      title: "Search Savoir off-plan projects",
      description:
        "Search new off-plan developer projects marketed by Savoir Properties. Filters supported by the CMS: developer, handover period, area; " +
        "plus an optional budget matched against each project's published 'starting from' price (cheapest unit only). " +
        "Results are ordered by most recently updated. Use get_offplan_project_details for payment plans.",
      inputSchema: SearchOffplanInput,
      outputSchema: OffplanListOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Searching off-plan projects…", "Off-plan projects ready"),
    },
    instrument(logger, "search_offplan_projects", async (a: z.infer<typeof SearchOffplanInput>) => {
      const sid = knownShortlist(a.shortlist_id);
      try {
        const out = await cms.searchOffplan({ developers: a.developers, handover: a.handover, area: a.area, max_starting_price_aed: a.max_starting_price_aed, page: a.page, page_size: a.page_size });
        const saved = savedKeys(a.shortlist_id);
        const items = out.items.map((i) => ({ ...i, saved: saved.has(`offplan:${i.slug}`), links: listingLinks(deps.links, { kind: "offplan", slug: i.slug, url: i.url }, "card") }));
        analytics.record("offplan_search", { budget_band: budgetBand(a.max_starting_price_aed, "buy"), developer: (a.developers?.length ?? 0) > 0, handover: !!a.handover, area: !!a.area, outcome: out.status });
        return {
          content: text(`${offplanSearchText(out)}\n${asOfLine(out.data_as_of)}`),
          structuredContent: { view: "offplan_list" as const, ...out, items, shortlist_id: sid, error: null },
        };
      } catch (err) {
        const error = toErrorInfo(err);
        return {
          content: text(`Off-plan search failed: ${error.message} (This is a service error, not an empty result.)`),
          structuredContent: { view: "offplan_list" as const, status: "error" as const, items: [], pagination: null, applied_filters: {}, notes: [], data_as_of: null, shortlist_id: sid, error },
          isError: true,
        };
      }
    }),
  );

  registerAppTool(
    server,
    "get_offplan_project_details",
    {
      title: "Get off-plan project details",
      description:
        "Details for one off-plan project by slug: developer, location, starting price, handover, payment plan, unit sizes, lifestyle, amenities, images and website link. " +
        "Pass unit_price_aed ONLY when the customer gives the actual price of a specific unit; the tool then shows an illustrative payment schedule. " +
        "Never use the project's starting price as a unit price. Do not state ROI or returns.",
      inputSchema: z.object({
        slug: slugInput,
        unit_price_aed: z.number().min(10_000).max(5_000_000_000).optional().describe("Actual price of a specific unit, as quoted to the customer."),
        shortlist_id: shortlistIdInput,
      }),
      outputSchema: OffplanDetailOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Loading project…", "Project loaded"),
    },
    instrument(logger, "get_offplan_project_details", async ({ slug, unit_price_aed, shortlist_id }: { slug: string; unit_price_aed?: number; shortlist_id?: string }) => {
      const base = { view: "offplan_detail" as const, project: null, links: null, payment_schedule: null, payment_schedule_note: null, saved: false, shortlist_id: knownShortlist(shortlist_id), data_as_of: null };
      if (!isValidSlug(slug)) {
        const error = { code: "invalid_input", message: "That is not a valid project slug. Use the slug from a search result." };
        return { content: text(error.message), structuredContent: { ...base, status: "invalid_input" as const, error }, isError: true };
      }
      try {
        const { details: project, fetchedAt } = await cms.offplanDetailsMeta(slug);
        if (!project) {
          const error = { code: "not_found", message: "No Savoir off-plan project exists with that slug." };
          return { content: text(error.message), structuredContent: { ...base, status: "not_found" as const, error } };
        }
        analytics.record("detail_view", { kind: "offplan", schedule: unit_price_aed !== undefined }, { kind: "offplan", slug });
        let schedule = null;
        let scheduleNote: string | null = null;
        if (unit_price_aed !== undefined) {
          const r = paymentSchedule(project.payment_plan, unit_price_aed, project.starting_price_aed);
          schedule = r.schedule;
          scheduleNote = r.reason;
        }
        const asOf = new Date(fetchedAt).toISOString();
        const extra = schedule ? `\n${scheduleText(schedule)}` : scheduleNote ? `\nPayment schedule: ${scheduleNote}` : "";
        return {
          content: text(`${offplanDetailsText(project)}${extra}\n${asOfLine(asOf)}`),
          structuredContent: { ...base, status: "ok" as const, project, links: listingLinks(deps.links, { kind: "offplan", slug, url: project.url }, "detail"), payment_schedule: schedule, payment_schedule_note: scheduleNote, saved: savedKeys(shortlist_id).has(`offplan:${slug}`), data_as_of: asOf, error: null },
        };
      } catch (err) {
        if (cmsNotFound(err)) {
          const error = { code: "not_found", message: "No Savoir off-plan project exists with that slug." };
          return { content: text(error.message), structuredContent: { ...base, status: "not_found" as const, error } };
        }
        const error = toErrorInfo(err);
        return { content: text(`Could not load the project: ${error.message}`), structuredContent: { ...base, status: "error" as const, error }, isError: true };
      }
    }),
  );

  server.registerTool(
    "get_contact_options",
    {
      title: "Get Savoir contact options",
      description:
        "Savoir Properties' WhatsApp, phone, email, contact page and office address. Pass a property slug to also get that listing's agent contact " +
        "and a WhatsApp link prefilled with the listing link. For a message that includes the customer's requirements and several listings, use prepare_inquiry.",
      inputSchema: z.object({ property_slug: slugInput.optional() }),
      outputSchema: ContactOutput,
      annotations: READ_ONLY,
    },
    instrument(logger, "get_contact_options", async ({ property_slug }: { property_slug?: string }) => {
      const contact = companyContact(config.publicSiteUrl, config.inquiryMode !== "disabled");
      const notes: string[] = [];
      if (property_slug) {
        if (!isValidSlug(property_slug)) {
          notes.push("The property slug was not valid, so only company contacts are shown.");
        } else {
          try {
            const p = await cms.propertyDetails(property_slug);
            if (p) {
              contact.property_url = p.url;
              contact.property_agent = p.agent
                ? {
                    ...p.agent,
                    whatsapp_url: p.agent.phone ? `https://wa.me/${p.agent.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I'm interested in this property: ${p.url}`)}` : null,
                  }
                : null;
              contact.whatsapp_url = `${contact.whatsapp_url}?text=${encodeURIComponent(`Hello, I'm interested in this property: ${p.url}`)}`;
            } else {
              notes.push("That listing was not found, so only company contacts are shown.");
            }
          } catch (err) {
            const info = toErrorInfo(err);
            notes.push(info.code === "cms_not_found" ? "That listing was not found, so only company contacts are shown." : `Listing agent details are unavailable right now (${info.message}). Company contacts still work.`);
          }
        }
      }
      analytics.record("contact_options", { with_listing: !!property_slug });
      return {
        content: text(contactText(contact) + (notes.length ? `\nNotes:\n${notes.map((n) => `- ${n}`).join("\n")}` : "")),
        structuredContent: { status: "ok" as const, contact, notes },
      };
    }),
  );

  registerJourneyTools(server, deps);

  if (config.inquiryMode !== "disabled") registerInquiryTool(server, deps);
}

function registerInquiryTool(server: McpServer, { cms, config, logger, tokens, analytics }: ToolDeps): void {
  server.registerTool(
    "submit_property_inquiry",
    {
      title: "Send an inquiry to Savoir",
      description:
        "Send the user's inquiry to Savoir Properties via the website contact form. This shares the user's name, email and phone with Savoir. " +
        "Two steps are mandatory: first call with confirm=false to get a preview; show the preview to the user and ask them to confirm; " +
        "only then call again with confirm=true and the confirmation_token, with identical details. " +
        "Never invent contact details — use only what the user provided. This does NOT book a viewing: a consultant follows up to arrange one.",
      inputSchema: InquiryInputSchema,
      outputSchema: InquiryOutput,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    instrument(logger, "submit_property_inquiry", async (a: z.infer<typeof InquiryInputSchema>) => {
      const base = { sent: false, preview: null, confirmation_token: null, expires_at: null };
      const invalid = (message: string) => ({
        content: text(message),
        structuredContent: { ...base, status: "invalid_input" as const, message, error: { code: "invalid_input", message } },
        isError: true,
      });

      if (!safeEmail(a.email)) return invalid("The email address is not valid. Ask the user to check it.");
      if (a.phone && !/^\+?[\d\s()-]{6,25}$/.test(a.phone)) return invalid("The phone number is not valid. Ask the user to check it.");

      // Re-verify every listing live before anything is previewed or sent.
      const listings: ListingRef[] = [];
      for (const ref of a.listings ?? []) {
        if (!isValidSlug(ref.slug)) return invalid("A listing slug is not valid.");
        try {
          if (ref.kind === "offplan") {
            const p = (await cms.offplanDetailsMeta(ref.slug, true)).details;
            if (p) listings.push({ kind: "offplan", title: p.title, reference_number: null, url: p.url });
            else return invalid(`The off-plan project ${ref.slug} was not found. Nothing was sent.`);
          } else {
            const p = (await cms.propertyDetailsMeta(ref.slug, true)).details;
            if (p) listings.push({ kind: "property", title: p.title, reference_number: p.reference_number, url: p.url });
            else return invalid(`The listing ${ref.slug} is no longer available. Nothing was sent.`);
          }
        } catch (err) {
          if (cmsNotFound(err)) return invalid(`The listing ${ref.slug} is no longer available. Nothing was sent.`);
          const error = toErrorInfo(err);
          return { content: text(`Could not verify the listings: ${error.message} Nothing was sent.`), structuredContent: { ...base, status: "error" as const, message: "Nothing was sent.", error }, isError: true };
        }
      }

      const payload = buildContactPayload(a as InquiryInput, listings);
      const preview = {
        to: "Savoir Properties (website contact form)",
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
        listing_urls: listings.map((l) => l.url),
        privacy_policy_url: privacyPolicyUrl(config.publicSiteUrl),
      };

      const askToConfirm = (reason: string) => {
        const issued = tokens.issue(payload);
        const message =
          `${reason}Nothing has been sent yet. Show the user exactly what will be sent and ask for explicit confirmation:\n` +
          `To: ${preview.to}\nName: ${preview.name}\nEmail: ${preview.email}\nPhone: ${preview.phone || "(none)"}\n---\n${preview.message}\n---\n` +
          `Savoir handles personal data per ${preview.privacy_policy_url}. ` +
          `If the user confirms, call submit_property_inquiry again with the same details, confirm=true and confirmation_token="${issued.token}".`;
        return {
          content: text(message),
          structuredContent: { status: "needs_confirmation" as const, sent: false, preview, confirmation_token: issued.token, expires_at: issued.expires_at, message, error: null },
        };
      };

      if (!a.confirm) return askToConfirm("");

      const check = tokens.redeem(a.confirmation_token, payload);
      if (check === "used") {
        const message = "This inquiry was already sent with that confirmation. It was not sent again.";
        return { content: text(message), structuredContent: { ...base, status: "invalid_input" as const, message, error: { code: "already_sent", message } }, isError: true };
      }
      if (check !== "ok") {
        const reason = check === "expired" ? "The confirmation expired. " : check === "missing" ? "A confirmation token is required. " : "The details differ from the confirmed preview (or the token is invalid). ";
        return askToConfirm(reason);
      }

      if (config.inquiryMode === "dry_run") {
        const message = "DRY RUN: the inquiry was confirmed but NOT sent (INQUIRY_MODE=dry_run). No one at Savoir has received it.";
        logger.info("inquiry.dry_run", { listings: listings.length, inquiry_type: a.inquiry_type });
        return { content: text(message), structuredContent: { status: "dry_run" as const, sent: false, preview, confirmation_token: null, expires_at: null, message, error: null } };
      }

      try {
        await cms.submitContactUs(payload);
      } catch (err) {
        const error = toErrorInfo(err);
        const uncertain = err instanceof CmsError && err.code === "cms_timeout";
        if (!uncertain && a.confirmation_token) tokens.release(a.confirmation_token);
        const message = uncertain
          ? "The inquiry may or may not have reached Savoir (the request timed out). Do not resend automatically; suggest the user contact Savoir on WhatsApp or by phone to confirm."
          : `The inquiry was NOT sent: ${error.message} The user can retry, or contact Savoir via WhatsApp/phone (see get_contact_options).`;
        logger.warn("inquiry.failed", { code: error.code, uncertain });
        return { content: text(message), structuredContent: { status: "error" as const, sent: false, preview, confirmation_token: null, expires_at: null, message, error }, isError: true };
      }

      analytics.record("inquiry_submitted", { listings: listings.length, type: a.inquiry_type, has_reference: !!a.reference_code });
      logger.info("inquiry.sent", { listings: listings.length, inquiry_type: a.inquiry_type });
      const message =
        "The inquiry was sent to Savoir Properties. A Savoir consultant will follow up by email or phone. " +
        (a.inquiry_type === "viewing_request" ? "This is a viewing request, not a confirmed booking — the consultant will confirm a time." : "");
      return { content: text(message.trim()), structuredContent: { status: "sent" as const, sent: true, preview, confirmation_token: null, expires_at: null, message: message.trim(), error: null } };
    }),
  );
}
