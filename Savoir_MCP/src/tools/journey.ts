/**
 * Customer-journey tools: area guide → compare → shortlist (+ share) → contact handoff.
 */
import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import type { AmenityKey } from "../cms/amenities.js";
import { areaGuide, compareListings, type Requirements } from "../cms/discovery.js";
import { isValidSlug } from "../cms/sanitize.js";
import { AREA_TAG_KEYS, type AreaTag } from "../data/areas.js";
import { buildHandoffMessage, CAMPAIGN_CODE_RE, handoffChannels, newReferenceCode, withUtm, type HandoffListing, type Lang } from "../handoff.js";
import { AreaGuideSchema, ErrorInfoSchema, HandoffSchema, OffplanDetailsSchema, PropertyDetailsSchema, ShortlistSchema, StatusSchema, SuitabilitySchema, type ShortlistView } from "../schemas.js";
import { PERSISTENCE_NOTICE, ShortlistStore, type ListingSnapshot, type ShortlistRecord } from "../shortlist.js";
import { budgetBand, cmsNotFound, instrument, ListingRefInput, READ_ONLY, RequirementsInput, text, toErrorInfo, widgetMeta, type ToolDeps } from "./common.js";
import { asOfLine, compareText, shortlistText } from "./format.js";

const ShortlistIdInput = z.string().regex(/^[A-Za-z0-9_-]{22}$/).describe("The shortlist_id returned by update_shortlist.");

const ShortlistOutput = z.object({
  view: z.literal("shortlist"),
  status: StatusSchema,
  shortlist: ShortlistSchema.nullable(),
  rejected: z.array(z.string()),
  /** update_shortlist only: what this call actually changed, as confirmed by the store. */
  change: z.object({ created: z.boolean(), added: z.array(z.string()), removed: z.array(z.string()) }).optional(),
  error: ErrorInfoSchema.nullable(),
});

const CompareOutput = z.object({
  view: z.literal("compare"),
  status: StatusSchema,
  items: z.array(
    z.object({
      kind: z.enum(["property", "offplan"]),
      slug: z.string(),
      available: z.boolean(),
      property: PropertyDetailsSchema.nullable(),
      project: OffplanDetailsSchema.nullable(),
      suitability: SuitabilitySchema.nullable(),
    }),
  ),
  requirements: z.record(z.string(), z.unknown()).nullable(),
  data_as_of: z.string().nullable(),
  error: ErrorInfoSchema.nullable(),
});

const AreaGuideOutput = z.object({ view: z.literal("area_guide"), status: StatusSchema, guide: AreaGuideSchema.nullable(), error: ErrorInfoSchema.nullable() });
const HandoffOutput = z.object({ view: z.literal("inquiry"), status: StatusSchema, handoff: HandoffSchema.nullable(), error: ErrorInfoSchema.nullable() });

export function registerJourneyTools(server: McpServer, deps: ToolDeps): void {
  const { cms, config, logger, shortlists, analytics } = deps;
  const shareUrl = (r: ShortlistRecord) => (r.share_token ? `${config.publicMcpUrl}/s/${r.share_token}` : null);
  const view = (r: ShortlistRecord): ShortlistView => ({
    shortlist_id: r.id,
    items: r.items.map((i) => ({
      kind: i.kind,
      slug: i.slug,
      added_at: i.added_at,
      available: null,
      title: i.snapshot.title,
      url: i.snapshot.url,
      price_label: i.snapshot.price_label,
      photo: i.snapshot.photo,
      location_label: i.snapshot.location_label,
      bedrooms_label: i.snapshot.bedrooms_label,
    })),
    expires_at: r.expires_at,
    share_url: shareUrl(r),
    persistence: PERSISTENCE_NOTICE,
  });
  const notFound = (rejected: string[] = []) => {
    const error = { code: "shortlist_not_found", message: "That shortlist doesn't exist or has expired. Start a new one with update_shortlist (no shortlist_id)." };
    return { content: text(error.message), structuredContent: { view: "shortlist" as const, status: "not_found" as const, shortlist: null, rejected, error } };
  };

  /** Capture listing facts from the CMS (server-side) for a shortlist entry. */
  async function snapshot(kind: "property" | "offplan", slug: string): Promise<ListingSnapshot | null> {
    if (kind === "offplan") {
      const { details: d, fetchedAt } = await cms.offplanDetailsMeta(slug);
      return d ? { title: d.title, url: d.url, price_label: d.starting_price_label ? `From ${d.starting_price_label}` : null, photo: d.image, location_label: d.location, bedrooms_label: null, captured_at: new Date(fetchedAt).toISOString() } : null;
    }
    const { details: d, fetchedAt } = await cms.propertyDetailsMeta(slug);
    return d ? { title: d.title, url: d.url, price_label: d.price_label, photo: d.photo, location_label: d.location.label, bedrooms_label: d.bedrooms_label, captured_at: new Date(fetchedAt).toISOString() } : null;
  }

  // ----- area guide -----
  registerAppTool(
    server,
    "get_area_guide",
    {
      title: "Suggest Dubai areas",
      description:
        "For customers who don't know Dubai: suggests areas with Savoir listings that fit their purpose, budget and bedrooms, with live listing counts and price ranges, " +
        "plus editorial character tags (beachfront, city centre, golf, family/villa, more affordable…) and nearby areas. Tags are general guidance, not listing facts.",
      inputSchema: z.object({
        purpose: z.enum(["buy", "rent"]).optional(),
        budget_min_aed: z.number().min(0).max(10_000_000_000).optional(),
        budget_max_aed: z.number().min(0).max(10_000_000_000).optional(),
        bedrooms: z.number().int().min(0).max(10).optional().describe("0 = studio."),
        lifestyle_tags: z.array(z.enum(AREA_TAG_KEYS)).max(4).optional(),
        limit: z.number().int().min(1).max(12).default(8),
      }),
      outputSchema: AreaGuideOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Finding areas…", "Area suggestions ready"),
    },
    instrument(logger, "get_area_guide", async (a: { purpose?: "buy" | "rent"; budget_min_aed?: number; budget_max_aed?: number; bedrooms?: number; lifestyle_tags?: AreaTag[]; limit: number }) => {
      try {
        const guide = await areaGuide(cms, { purpose: a.purpose, budget_min_aed: a.budget_min_aed, budget_max_aed: a.budget_max_aed, bedrooms: a.bedrooms, tags: a.lifestyle_tags, limit: a.limit });
        analytics.record("area_guide", { purpose: a.purpose ?? "any", budget_band: budgetBand(a.budget_max_aed, a.purpose), tags: a.lifestyle_tags?.length ?? 0, results: guide.areas.length });
        const lines = guide.areas.map(
          (e, i) =>
            `${i + 1}. ${e.area}: ${e.matching_listings} matching Savoir listing${e.matching_listings === 1 ? "" : "s"}` +
            (e.price_range_aed ? `, AED ${e.price_range_aed.min.toLocaleString("en-US")}–${e.price_range_aed.max.toLocaleString("en-US")}` : "") +
            (e.tags.length ? ` · ${e.tags.join(", ")}` : "") +
            (e.nearby.length ? ` · nearby: ${e.nearby.slice(0, 3).join(", ")}` : ""),
        );
        const body = guide.areas.length ? lines.join("\n") : "No Savoir listings match those criteria in any area right now. Suggest a different budget or bedroom count.";
        return {
          content: text(`Areas with Savoir listings that fit:\n${body}\n${guide.notes.join(" ")}\nEditorial tags: ${guide.editorial_status}.\n${asOfLine(guide.data_as_of)}`),
          structuredContent: { view: "area_guide" as const, status: guide.areas.length ? ("ok" as const) : ("no_results" as const), guide, error: null },
        };
      } catch (err) {
        const error = toErrorInfo(err);
        return { content: text(`Could not build the area guide: ${error.message}`), structuredContent: { view: "area_guide" as const, status: "error" as const, guide: null, error }, isError: true };
      }
    }),
  );

  // ----- compare -----
  registerAppTool(
    server,
    "compare_listings",
    {
      title: "Compare listings",
      description:
        "Compare 2–4 Savoir listings or off-plan projects side by side using verified details (price, price per sq ft for sale listings with a known size, size, bedrooms, location, " +
        "amenities, completion, payment plan, agent). Pass the customer's stated requirements to get a per-listing suitability check. Missing data is reported as not provided.",
      inputSchema: z.object({ items: z.array(ListingRefInput).min(2).max(4), requirements: RequirementsInput.optional() }),
      outputSchema: CompareOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Comparing…", "Comparison ready"),
    },
    instrument(logger, "compare_listings", async (a: { items: Array<{ kind: "property" | "offplan"; slug: string }>; requirements?: Requirements }) => {
      const uniq = a.items.filter((x, i) => a.items.findIndex((y) => y.kind === x.kind && y.slug === x.slug) === i);
      if (uniq.some((x) => !isValidSlug(x.slug)) || uniq.length < 2) {
        const error = { code: "invalid_input", message: "Provide 2–4 different, valid listing slugs from search results." };
        return { content: text(error.message), structuredContent: { view: "compare" as const, status: "invalid_input" as const, items: [], requirements: null, data_as_of: null, error }, isError: true };
      }
      try {
        const res = await compareListings(cms, uniq, a.requirements);
        analytics.record("compare", { items: uniq.length, with_requirements: !!a.requirements });
        for (const it of uniq) analytics.record("compare_listing", { kind: it.kind }, it);
        const items = res.items.map((it) => ({
          kind: it.kind,
          slug: it.slug,
          available: it.available,
          property: it.kind === "property" ? it.details : null,
          project: it.kind === "offplan" ? it.details : null,
          suitability: it.suitability,
        }));
        return {
          content: text(compareText(res.items, res.data_as_of)),
          structuredContent: { view: "compare" as const, status: "ok" as const, items, requirements: (a.requirements as Record<string, unknown>) ?? null, data_as_of: res.data_as_of, error: null },
        };
      } catch (err) {
        const error = toErrorInfo(err);
        return { content: text(`Comparison failed: ${error.message}`), structuredContent: { view: "compare" as const, status: "error" as const, items: [], requirements: null, data_as_of: null, error }, isError: true };
      }
    }),
  );

  // ----- shortlist -----
  registerAppTool(
    server,
    "update_shortlist",
    {
      title: "Save or remove shortlist listings",
      description:
        "Add or remove listings on the customer's shortlist. Omit shortlist_id to start a new shortlist; afterwards ALWAYS pass the returned shortlist_id. " +
        "Stores listing references only (no personal details) for 30 days after the last change. Up to 12 listings.",
      inputSchema: z.object({
        shortlist_id: ShortlistIdInput.optional(),
        add: z.array(ListingRefInput).max(4).optional(),
        remove: z.array(ListingRefInput).max(12).optional(),
        clear: z.boolean().optional().describe("Remove every listing (the shortlist itself remains)."),
      }),
      outputSchema: ShortlistOutput,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      _meta: widgetMeta("Updating shortlist…", "Shortlist updated"),
    },
    instrument(logger, "update_shortlist", async (a: { shortlist_id?: string; add?: Array<{ kind: "property" | "offplan"; slug: string }>; remove?: Array<{ kind: "property" | "offplan"; slug: string }>; clear?: boolean }) => {
      if (a.shortlist_id && !shortlists.get(a.shortlist_id)) return notFound();
      const rejected: string[] = [];
      const adds: Array<{ kind: "property" | "offplan"; slug: string; snapshot: ListingSnapshot }> = [];
      try {
        for (const ref of a.add ?? []) {
          if (!isValidSlug(ref.slug)) {
            rejected.push(ref.slug);
            continue;
          }
          try {
            const snap = await snapshot(ref.kind, ref.slug);
            if (snap) adds.push({ ...ref, snapshot: snap });
            else rejected.push(ref.slug);
          } catch (err) {
            if (cmsNotFound(err)) rejected.push(ref.slug);
            else throw err;
          }
        }
      } catch (err) {
        const error = toErrorInfo(err);
        return { content: text(`Could not verify the listing to save: ${error.message}`), structuredContent: { view: "shortlist" as const, status: "error" as const, shortlist: null, rejected, error }, isError: true };
      }
      let result;
      try {
        result = shortlists.update(a.shortlist_id, adds, a.remove ?? [], a.clear ?? false);
      } catch {
        const error = { code: "capacity", message: "Shortlists are temporarily unavailable. Please try again later." };
        return { content: text(error.message), structuredContent: { view: "shortlist" as const, status: "error" as const, shortlist: null, rejected, error }, isError: true };
      }
      if (!result) return notFound(rejected);
      rejected.push(...result.rejected);
      for (const ad of adds) analytics.record("shortlist_add", { kind: ad.kind }, ad);
      for (const rm of a.remove ?? []) analytics.record("shortlist_remove", { kind: rm.kind }, rm);
      if (result.created) analytics.record("shortlist_created", {});
      const v = view(result.record);
      const has = (r: { kind: string; slug: string }) => v.items.some((i) => i.kind === r.kind && i.slug === r.slug);
      const change = {
        created: result.created,
        added: adds.filter((ad) => has(ad) && !result.rejected.includes(ad.slug)).map((ad) => ad.slug),
        removed: (a.remove ?? []).filter((r) => !has(r)).map((r) => r.slug),
      };
      const note = rejected.length ? `\nNot added (not found, invalid or the 12-listing limit was reached): ${rejected.join(", ")}` : "";
      return {
        content: text(shortlistText(v, result.created ? "Created a new shortlist." : "Shortlist updated.") + note),
        structuredContent: { view: "shortlist" as const, status: "ok" as const, shortlist: v, rejected, change, error: null },
      };
    }),
  );

  registerAppTool(
    server,
    "get_shortlist",
    {
      title: "Show the shortlist",
      description: "Show the customer's saved listings. Listing facts are as captured when each was saved; use compare_listings or prepare_inquiry to re-check current details.",
      inputSchema: z.object({ shortlist_id: ShortlistIdInput }),
      outputSchema: ShortlistOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Loading shortlist…", "Shortlist"),
    },
    instrument(logger, "get_shortlist", async ({ shortlist_id }: { shortlist_id: string }) => {
      const r = shortlists.get(shortlist_id);
      if (!r) return notFound();
      analytics.record("shortlist_view", { items: r.items.length });
      const v = view(r);
      return { content: text(shortlistText(v, "The customer's shortlist (facts as captured when saved):")), structuredContent: { view: "shortlist" as const, status: "ok" as const, shortlist: v, rejected: [], error: null } };
    }),
  );

  registerAppTool(
    server,
    "share_shortlist",
    {
      title: "Create or stop a shortlist share link",
      description:
        "Create a read-only public link to the shortlist (to send to family or a partner), or stop sharing it. The page shows only listing facts — never personal details — " +
        "and expires with the shortlist. Anyone with the link can view it. Only do this when the customer asks for a link.",
      inputSchema: z.object({ shortlist_id: ShortlistIdInput, action: z.enum(["share", "stop_sharing"]).default("share") }),
      outputSchema: ShortlistOutput,
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      _meta: widgetMeta("Updating share link…", "Share link updated"),
    },
    instrument(logger, "share_shortlist", async ({ shortlist_id, action }: { shortlist_id: string; action: "share" | "stop_sharing" }) => {
      const r = action === "share" ? shortlists.share(shortlist_id) : shortlists.unshare(shortlist_id);
      if (!r) return notFound();
      analytics.record(action === "share" ? "shortlist_shared" : "shortlist_unshared", { items: r.items.length });
      const v = view(r);
      const head = action === "share" ? `Share link created (read-only, no personal details, expires ${r.expires_at}): ${v.share_url}` : "Sharing stopped; the old link no longer works.";
      return { content: text(`${head}\n${shortlistText(v, "")}`), structuredContent: { view: "shortlist" as const, status: "ok" as const, shortlist: v, rejected: [], error: null } };
    }),
  );

  server.registerTool(
    "delete_shortlist",
    {
      title: "Delete the shortlist",
      description: "Permanently delete the customer's shortlist and any share link. Only when the customer asks.",
      inputSchema: z.object({ shortlist_id: ShortlistIdInput }),
      outputSchema: z.object({ status: StatusSchema, deleted: z.boolean() }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    instrument(logger, "delete_shortlist", async ({ shortlist_id }: { shortlist_id: string }) => {
      const deleted = shortlists.delete(shortlist_id);
      if (deleted) analytics.record("shortlist_deleted", {});
      return {
        content: text(deleted ? "The shortlist and any share link were deleted." : "No shortlist with that ID exists (it may already be deleted or expired)."),
        structuredContent: { status: deleted ? ("ok" as const) : ("not_found" as const), deleted },
      };
    }),
  );

  // ----- contact handoff -----
  registerAppTool(
    server,
    "prepare_inquiry",
    {
      title: "Prepare a message to Savoir",
      description:
        "Prepare the exact message the customer can send to Savoir on WhatsApp or by email: selected listings (re-verified live), their stated requirements and a requested viewing time. " +
        "Collects NO personal details and sends NOTHING — the customer sends it themselves. Show them the message before they open a link. " +
        "Never say a viewing is booked: it is a request a consultant will confirm. Use the customer's language (en or ar).",
      inputSchema: z.object({
        listings: z.array(ListingRefInput).max(4).optional(),
        requirements: RequirementsInput.optional(),
        viewing_preference: z.string().trim().max(80).optional().describe('Requested viewing time in the customer\'s words, e.g. "Saturday afternoon".'),
        language: z.enum(["en", "ar"]).default("en"),
        campaign_code: z.string().regex(CAMPAIGN_CODE_RE).optional().describe("Only if the customer mentions a Savoir campaign or offer code."),
      }),
      outputSchema: HandoffOutput,
      annotations: READ_ONLY,
      _meta: widgetMeta("Preparing your message…", "Message ready"),
    },
    instrument(
      logger,
      "prepare_inquiry",
      async (a: { listings?: Array<{ kind: "property" | "offplan"; slug: string }>; requirements?: Requirements; viewing_preference?: string; language: Lang; campaign_code?: string }) => {
        const refs = (a.listings ?? []).filter((x, i, arr) => arr.findIndex((y) => y.kind === x.kind && y.slug === x.slug) === i);
        if (refs.some((x) => !isValidSlug(x.slug))) {
          const error = { code: "invalid_input", message: "A listing slug is not valid. Use slugs from search results." };
          return { content: text(error.message), structuredContent: { view: "inquiry" as const, status: "invalid_input" as const, handoff: null, error }, isError: true };
        }
        const link = (url: string) => (config.attributionUtm ? withUtm(url, "whatsapp_handoff", a.campaign_code, config.publicSiteUrl) : url);
        const listings: Array<HandoffListing & { slug: string; verified_at: string }> = [];
        const unavailable: Array<{ kind: "property" | "offplan"; slug: string }> = [];
        const agents = new Map<string, { name: string; phone: string | null }>();
        try {
          for (const ref of refs) {
            try {
              if (ref.kind === "offplan") {
                const { details: d, fetchedAt } = await cms.offplanDetailsMeta(ref.slug, true);
                if (!d) unavailable.push(ref);
                else listings.push({ kind: "offplan", slug: ref.slug, title: d.title, reference_number: null, price_label: d.starting_price_label ? `from ${d.starting_price_label}` : null, url: link(d.url), verified_at: new Date(fetchedAt).toISOString() });
              } else {
                const { details: d, fetchedAt } = await cms.propertyDetailsMeta(ref.slug, true);
                if (!d) unavailable.push(ref);
                else {
                  listings.push({ kind: "property", slug: ref.slug, title: d.title, reference_number: d.reference_number, price_label: d.price_label, url: link(d.url), verified_at: new Date(fetchedAt).toISOString() });
                  agents.set(d.agent?.phone ?? "company", d.agent ? { name: d.agent.name, phone: d.agent.phone } : { name: "Savoir Properties", phone: null });
                }
              }
            } catch (err) {
              if (cmsNotFound(err)) unavailable.push(ref);
              else throw err;
            }
          }
        } catch (err) {
          const error = toErrorInfo(err);
          return {
            content: text(`Could not re-check the listings right now (${error.message}). The customer can still contact Savoir on WhatsApp: https://wa.me/971505074686`),
            structuredContent: { view: "inquiry" as const, status: "error" as const, handoff: null, error },
            isError: true,
          };
        }

        const reference_code = newReferenceCode();
        const message = buildHandoffMessage({ listings, requirements: a.requirements, viewing: a.viewing_preference, lang: a.language, reference_code, campaign_code: a.campaign_code });
        const singleAgent = agents.size === 1 ? [...agents.values()][0] ?? null : null;
        const raw = handoffChannels(message, `Property inquiry ${reference_code}`, singleAgent && singleAgent.phone ? singleAgent : null);
        // Count clicks on the WhatsApp buttons (intent to contact, not a delivered message).
        const channels = deps.links
          ? {
              ...raw,
              whatsapp_company: deps.links.wrap({ u: raw.whatsapp_company, c: "whatsapp_company", s: "handoff" }),
              whatsapp_agent: raw.whatsapp_agent ? { ...raw.whatsapp_agent, url: deps.links.wrap({ u: raw.whatsapp_agent.url, c: "whatsapp_agent", s: "handoff" }) } : null,
            }
          : raw;
        analytics.record("handoff_prepared", {
          listings: listings.length,
          unavailable: unavailable.length,
          language: a.language,
          viewing: !!a.viewing_preference,
          campaign: a.campaign_code ?? "none",
          purpose: a.requirements?.purpose ?? "any",
          budget_band: budgetBand(a.requirements?.budget_max_aed, a.requirements?.purpose),
        });
        for (const l of listings) analytics.record("handoff_listing", { kind: l.kind }, l);

        const shared =
          "The message contains the listings above, the requirements you stated and your preferred viewing time — and no contact details. " +
          "Nothing is sent until you send it yourself from WhatsApp or your email app.";
        const handoff = {
          reference_code,
          language: a.language,
          message,
          listings: listings.map((l) => ({ kind: l.kind, slug: l.slug, title: l.title, url: l.url, price_label: l.price_label, verified_at: l.verified_at })),
          unavailable,
          channels,
          shared_information: shared,
          live_submission_available: config.inquiryMode === "live",
        };
        const textOut = [
          `Prepared message (reference ${reference_code}). Show it to the customer exactly as below; they send it themselves:`,
          "-----",
          message,
          "-----",
          unavailable.length ? `No longer available (left out): ${unavailable.map((u) => u.slug).join(", ")}` : "",
          `Send via WhatsApp to Savoir: ${channels.whatsapp_company}`,
          channels.whatsapp_agent ? `Or WhatsApp the listing agent ${channels.whatsapp_agent.name}: ${channels.whatsapp_agent.url}` : "",
          `Or email: ${channels.email.split("?")[0]} · Phone: ${channels.phone.replace("tel:", "")}`,
          shared,
          "This is not a booking: a Savoir consultant will reply to confirm availability and any viewing time.",
        ]
          .filter(Boolean)
          .join("\n");
        return { content: text(textOut), structuredContent: { view: "inquiry" as const, status: "ok" as const, handoff, error: null } };
      },
    ),
  );
}

export type { AmenityKey };
