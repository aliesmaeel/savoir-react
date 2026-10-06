import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { CmsError } from "../cms/client.js";
import { isValidSlug, safeEmail } from "../cms/sanitize.js";
import type { SavoirCms } from "../cms/service.js";
import { PROPERTY_TYPE_KEYS, SORT_KEYS } from "../cms/vocab.js";
import type { AppConfig } from "../config.js";
import { companyContact, privacyPolicyUrl } from "../contact.js";
import { buildContactPayload, type ConfirmationTokens, type InquiryInput, type ListingRef } from "../inquiry.js";
import type { Logger } from "../logger.js";
import {
  ContactOptionsSchema,
  ErrorInfoSchema,
  OffplanDetailsSchema,
  OffplanSummarySchema,
  PaginationSchema,
  PropertyDetailsSchema,
  PropertySummarySchema,
  StatusSchema,
} from "../schemas.js";
import { WIDGET_URI } from "../ui/widget.js";
import { contactText, offplanDetailsText, offplanSearchText, propertyDetailsText, propertySearchText } from "./format.js";

export interface ToolDeps {
  cms: SavoirCms;
  config: AppConfig;
  logger: Logger;
  tokens: ConfirmationTokens;
}

type ErrorInfo = z.infer<typeof ErrorInfoSchema>;

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

function widgetMeta(invoking: string, invoked: string) {
  return {
    ui: { resourceUri: WIDGET_URI },
    // ChatGPT compatibility aliases (documented as legacy but still honoured).
    "openai/outputTemplate": WIDGET_URI,
    "openai/toolInvocation/invoking": invoking,
    "openai/toolInvocation/invoked": invoked,
  };
}

function toErrorInfo(err: unknown): ErrorInfo {
  if (err instanceof CmsError) return { code: err.code, message: err.publicMessage };
  return { code: "internal_error", message: "Something went wrong while handling this request. Please try again." };
}

const text = (t: string) => [{ type: "text" as const, text: t }];

/** Wrap a handler with timing/outcome logging. Arguments are never logged. */
function instrument<A, R extends { structuredContent?: { status?: string } }>(
  logger: Logger,
  tool: string,
  fn: (args: A) => Promise<R>,
): (args: A) => Promise<R> {
  return async (args: A) => {
    const started = Date.now();
    try {
      const result = await fn(args);
      logger.info("tool.call", { tool, status: result.structuredContent?.status ?? "unknown", ms: Date.now() - started });
      return result;
    } catch (err) {
      logger.error("tool.call.unhandled", { tool, error: err instanceof Error ? err.name : "unknown", ms: Date.now() - started });
      throw err;
    }
  };
}

// ---------- output schemas ----------

const PropertyListOutput = z.object({
  view: z.literal("property_list"),
  status: StatusSchema,
  items: z.array(PropertySummarySchema),
  pagination: PaginationSchema.nullable(),
  applied_filters: z.record(z.string(), z.unknown()),
  notes: z.array(z.string()),
  error: ErrorInfoSchema.nullable(),
});

const PropertyDetailOutput = z.object({
  view: z.literal("property_detail"),
  status: StatusSchema,
  property: PropertyDetailsSchema.nullable(),
  error: ErrorInfoSchema.nullable(),
});

const OffplanListOutput = z.object({
  view: z.literal("offplan_list"),
  status: StatusSchema,
  items: z.array(OffplanSummarySchema),
  pagination: PaginationSchema.nullable(),
  applied_filters: z.record(z.string(), z.unknown()),
  notes: z.array(z.string()),
  error: ErrorInfoSchema.nullable(),
});

const OffplanDetailOutput = z.object({
  view: z.literal("offplan_detail"),
  status: StatusSchema,
  project: OffplanDetailsSchema.nullable(),
  error: ErrorInfoSchema.nullable(),
});

const ContactOutput = z.object({
  status: StatusSchema,
  contact: ContactOptionsSchema,
  notes: z.array(z.string()),
});

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
      listing_url: z.string().nullable(),
      privacy_policy_url: z.string(),
    })
    .nullable(),
  confirmation_token: z.string().nullable(),
  expires_at: z.string().nullable(),
  message: z.string(),
  error: ErrorInfoSchema.nullable(),
});

// ---------- input schemas ----------

const pageInput = {
  page: z.number().int().min(1).max(50).default(1).describe("1-based page number."),
  page_size: z.number().int().min(1).max(12).default(6).describe("Results per page (1–12)."),
};

const slugInput = z
  .string()
  .trim()
  .min(1)
  .max(240)
  .describe("The listing slug exactly as returned by a search result (the `slug` field), not a title.");

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
  sort: z.enum(SORT_KEYS).optional().describe("Default: newest."),
  ...pageInput,
});

export const SearchOffplanInput = z.object({
  developers: z
    .array(z.string().trim().min(1).max(80))
    .max(5)
    .optional()
    .describe('Developer names, e.g. ["Emaar"], ["Sobha Group", "Binghatti"]. Matched against Savoir\'s developer list.'),
  handover: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .optional()
    .describe('Handover/completion period: a quarter ("Q3 2028"), a year ("2028") or "ready".'),
  area: z.string().trim().min(1).max(80).optional().describe('Area or community, e.g. "Business Bay", "Dubai Hills".'),
  ...pageInput,
});

export const InquiryInputSchema = z.object({
  listing_kind: z.enum(["property", "offplan"]).optional().describe("Kind of listing the inquiry is about. Required when slug is given."),
  slug: slugInput.optional(),
  inquiry_type: z.enum(["viewing_request", "more_information", "general"]).default("more_information"),
  name: z.string().trim().min(2).max(100).describe("The user's full name, as they provided it."),
  email: z.string().trim().min(3).max(254).describe("The user's email address, as they provided it."),
  phone: z.string().trim().max(25).optional().describe("The user's phone number, if they provided one."),
  message: z.string().max(1500).optional().describe("The user's own message to Savoir."),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Preferred viewing date YYYY-MM-DD (a request, not a booking)."),
  preferred_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().describe("Preferred time HH:MM, 24h (a request, not a booking)."),
  confirm: z
    .boolean()
    .default(false)
    .describe("Leave false on the first call to get a preview. Set true only after the user has explicitly approved that exact preview."),
  confirmation_token: z.string().max(200).optional().describe("Token from the preview call. Required when confirm is true."),
});

// ---------- registration ----------

export function registerTools(server: McpServer, deps: ToolDeps): void {
  const { cms, config, logger, tokens } = deps;

  registerAppTool(
    server,
    "search_properties",
    {
      title: "Search Savoir properties",
      description:
        "Search Savoir Properties' current listings in Dubai (sale and rent, ready and off-plan resale). " +
        "Filters: area, buy/rent, property type, exact bedrooms (studio supported), exact bathrooms, AED price range, ready/off-plan. " +
        "Returns listing cards with slug, price, beds, location, photo and website link. Use get_property_details with a slug for full details. " +
        "For new developer projects use search_offplan_projects instead.",
      inputSchema: SearchPropertiesInput,
      outputSchema: PropertyListOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Searching Savoir listings…", "Savoir listings ready"),
    },
    instrument(logger, "search_properties", async (a: z.infer<typeof SearchPropertiesInput>) => {
      const base = { view: "property_list" as const, items: [], pagination: null, applied_filters: {}, notes: [] as string[] };
      if (a.min_price_aed !== undefined && a.max_price_aed !== undefined && a.min_price_aed > a.max_price_aed) {
        const error = { code: "invalid_input", message: "min_price_aed must not be greater than max_price_aed." };
        return { content: text(error.message), structuredContent: { ...base, status: "invalid_input" as const, error }, isError: true };
      }
      try {
        const out = await cms.searchProperties({
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
        });
        return {
          content: text(propertySearchText(out)),
          structuredContent: { view: "property_list" as const, ...out, error: null },
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
        "Full details for one Savoir listing by slug: photos, price and currency, location, size, amenities, reference and permit number, " +
        "the listing agent's public contact, the website link and similar listings.",
      inputSchema: z.object({ slug: slugInput }),
      outputSchema: PropertyDetailOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Loading property…", "Property loaded"),
    },
    instrument(logger, "get_property_details", async ({ slug }: { slug: string }) => {
      const base = { view: "property_detail" as const, property: null };
      if (!isValidSlug(slug)) {
        const error = { code: "invalid_input", message: "That is not a valid listing slug. Use the slug from a search result." };
        return { content: text(error.message), structuredContent: { ...base, status: "invalid_input" as const, error }, isError: true };
      }
      try {
        const property = await cms.propertyDetails(slug);
        if (!property) {
          const error = { code: "not_found", message: "No Savoir listing exists with that slug. It may have been removed." };
          return { content: text(error.message), structuredContent: { ...base, status: "not_found" as const, error } };
        }
        return { content: text(propertyDetailsText(property)), structuredContent: { ...base, status: "ok" as const, property, error: null } };
      } catch (err) {
        if (err instanceof CmsError && err.code === "cms_not_found") {
          const error = { code: "not_found", message: err.publicMessage };
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
        "Search new off-plan developer projects marketed by Savoir Properties. Filters supported by the CMS: developer, handover period, area. " +
        "Results are ordered by most recently updated (the CMS supports no other ordering). Use get_offplan_project_details with a slug for payment plans.",
      inputSchema: SearchOffplanInput,
      outputSchema: OffplanListOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Searching off-plan projects…", "Off-plan projects ready"),
    },
    instrument(logger, "search_offplan_projects", async (a: z.infer<typeof SearchOffplanInput>) => {
      try {
        const out = await cms.searchOffplan({ developers: a.developers, handover: a.handover, area: a.area, page: a.page, page_size: a.page_size });
        return { content: text(offplanSearchText(out)), structuredContent: { view: "offplan_list" as const, ...out, error: null } };
      } catch (err) {
        const error = toErrorInfo(err);
        return {
          content: text(`Off-plan search failed: ${error.message} (This is a service error, not an empty result.)`),
          structuredContent: { view: "offplan_list" as const, status: "error" as const, items: [], pagination: null, applied_filters: {}, notes: [], error },
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
        "Details for one off-plan project by slug: developer, location, starting price, handover, payment plan, unit sizes, amenities, images and website link. " +
        "Fields are included only when the CMS provides them.",
      inputSchema: z.object({ slug: slugInput }),
      outputSchema: OffplanDetailOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Loading project…", "Project loaded"),
    },
    instrument(logger, "get_offplan_project_details", async ({ slug }: { slug: string }) => {
      const base = { view: "offplan_detail" as const, project: null };
      if (!isValidSlug(slug)) {
        const error = { code: "invalid_input", message: "That is not a valid project slug. Use the slug from a search result." };
        return { content: text(error.message), structuredContent: { ...base, status: "invalid_input" as const, error }, isError: true };
      }
      try {
        const project = await cms.offplanDetails(slug);
        if (!project) {
          const error = { code: "not_found", message: "No Savoir off-plan project exists with that slug." };
          return { content: text(error.message), structuredContent: { ...base, status: "not_found" as const, error } };
        }
        return { content: text(offplanDetailsText(project)), structuredContent: { ...base, status: "ok" as const, project, error: null } };
      } catch (err) {
        if (err instanceof CmsError && err.code === "cms_not_found") {
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
        "and a WhatsApp link prefilled with the listing link.",
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
                    whatsapp_url: p.agent.phone
                      ? `https://wa.me/${p.agent.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I'm interested in this property: ${p.url}`)}`
                      : null,
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
      return {
        content: text(contactText(contact) + (notes.length ? `\nNotes:\n${notes.map((n) => `- ${n}`).join("\n")}` : "")),
        structuredContent: { status: "ok" as const, contact, notes },
      };
    }),
  );

  if (config.inquiryMode !== "disabled") {
    registerInquiryTool(server, deps);
  }
}

function registerInquiryTool(server: McpServer, { cms, config, logger, tokens }: ToolDeps): void {
  server.registerTool(
    "submit_property_inquiry",
    {
      title: "Send an inquiry to Savoir",
      description:
        "Send the user's inquiry (optionally about a specific listing) to Savoir Properties via the website contact form. " +
        "This shares the user's name, email and phone with Savoir. Two steps are mandatory: first call with confirm=false to get a preview; " +
        "show the preview to the user and ask them to confirm; only then call again with confirm=true and the confirmation_token, with identical details. " +
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
      if (a.slug && !a.listing_kind) return invalid("listing_kind is required when a slug is given.");
      if (a.slug && !isValidSlug(a.slug)) return invalid("That is not a valid listing slug.");

      let listing: ListingRef | null = null;
      if (a.slug) {
        try {
          if (a.listing_kind === "offplan") {
            const p = await cms.offplanDetails(a.slug);
            if (p) listing = { kind: "offplan", title: p.title, reference_number: null, url: p.url };
          } else {
            const p = await cms.propertyDetails(a.slug);
            if (p) listing = { kind: "property", title: p.title, reference_number: p.reference_number, url: p.url };
          }
        } catch (err) {
          if (!(err instanceof CmsError && err.code === "cms_not_found")) {
            const error = toErrorInfo(err);
            return { content: text(`Could not verify the listing: ${error.message} Nothing was sent.`), structuredContent: { ...base, status: "error" as const, message: "Nothing was sent.", error }, isError: true };
          }
        }
        if (!listing) return invalid("That listing was not found, so the inquiry cannot reference it. Nothing was sent.");
      }

      const payload = buildContactPayload(a as InquiryInput, listing);
      const preview = {
        to: "Savoir Properties (website contact form)",
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
        listing_url: listing?.url ?? null,
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
        const reason =
          check === "expired"
            ? "The confirmation expired. "
            : check === "missing"
              ? "A confirmation token is required. "
              : "The details differ from the confirmed preview (or the token is invalid). ";
        return askToConfirm(reason);
      }

      if (config.inquiryMode === "dry_run") {
        const message = "DRY RUN: the inquiry was confirmed but NOT sent (INQUIRY_MODE=dry_run). No one at Savoir has received it.";
        logger.info("inquiry.dry_run", { has_listing: !!listing, inquiry_type: a.inquiry_type });
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

      logger.info("inquiry.sent", { has_listing: !!listing, inquiry_type: a.inquiry_type });
      const message =
        "The inquiry was sent to Savoir Properties. A Savoir consultant will follow up by email or phone. " +
        (a.inquiry_type === "viewing_request" ? "This is a viewing request, not a confirmed booking — the consultant will confirm a time." : "");
      return { content: text(message.trim()), structuredContent: { status: "sent" as const, sent: true, preview, confirmation_token: null, expires_at: null, message: message.trim(), error: null } };
    }),
  );
}
