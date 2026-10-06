import { z } from "zod";
import { AMENITY_KEYS } from "../cms/amenities.js";
import { CmsError } from "../cms/client.js";
import type { SavoirCms } from "../cms/service.js";
import type { AppConfig } from "../config.js";
import type { ConfirmationTokens } from "../inquiry.js";
import type { Logger } from "../logger.js";
import { ErrorInfoSchema } from "../schemas.js";
import type { ShortlistStore } from "../shortlist.js";
import { WIDGET_URI } from "../ui/widget.js";

/**
 * Privacy-safe business metrics sink (Milestone 2 implements it). Dimensions must be
 * low-cardinality, non-personal values: never free text, contact details or IDs of people.
 */
export interface Analytics {
  record(event: string, dims?: Record<string, string | number | boolean | undefined>, listing?: { kind: string; slug: string }): void;
}
export const noopAnalytics: Analytics = { record() {} };

export interface ToolDeps {
  cms: SavoirCms;
  config: AppConfig;
  logger: Logger;
  tokens: ConfirmationTokens;
  shortlists: ShortlistStore;
  analytics: Analytics;
}

export type ErrorInfo = z.infer<typeof ErrorInfoSchema>;

export const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

export function widgetMeta(invoking: string, invoked: string) {
  return {
    ui: { resourceUri: WIDGET_URI },
    // ChatGPT compatibility aliases (documented as legacy but still honoured).
    "openai/outputTemplate": WIDGET_URI,
    "openai/toolInvocation/invoking": invoking,
    "openai/toolInvocation/invoked": invoked,
  };
}

export function toErrorInfo(err: unknown): ErrorInfo {
  if (err instanceof CmsError) return { code: err.code, message: err.publicMessage };
  return { code: "internal_error", message: "Something went wrong while handling this request. Please try again." };
}

export const text = (t: string) => [{ type: "text" as const, text: t }];

/** Wrap a handler with timing/outcome logging. Arguments are never logged. */
export function instrument<A, R extends { structuredContent?: { status?: string } }>(logger: Logger, tool: string, fn: (args: A) => Promise<R>): (args: A) => Promise<R> {
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

// ---------- shared input schemas ----------

export const pageInput = {
  page: z.number().int().min(1).max(50).default(1).describe("1-based page number."),
  page_size: z.number().int().min(1).max(12).default(6).describe("Results per page (1–12)."),
};

export const slugInput = z.string().trim().min(1).max(240).describe("The listing slug exactly as returned by a tool result (the `slug` field), not a title.");

export const shortlistIdInput = z
  .string()
  .regex(/^[A-Za-z0-9_-]{22}$/)
  .optional()
  .describe("The customer's shortlist_id from update_shortlist, if they have one; used to mark saved listings.");

export const ListingRefInput = z.object({
  kind: z.enum(["property", "offplan"]).describe("property = a listing from search_properties; offplan = a project from search_offplan_projects."),
  slug: slugInput,
});

export const RequirementsInput = z
  .object({
    purpose: z.enum(["buy", "rent"]).optional(),
    budget_min_aed: z.number().min(0).max(10_000_000_000).optional(),
    budget_max_aed: z.number().min(0).max(10_000_000_000).optional(),
    bedrooms: z.number().int().min(0).max(10).optional().describe("0 = studio."),
    areas: z.array(z.string().trim().min(1).max(80)).max(5).optional(),
    completion: z.enum(["ready", "off_plan"]).optional(),
    must_have: z.array(z.enum(AMENITY_KEYS)).max(6).optional(),
    notes: z.string().max(300).optional().describe("Other needs the customer stated, in their words. Never put contact details here."),
  })
  .describe("Only what the customer has actually said. Leave out anything they did not state.");

export function cmsNotFound(err: unknown): boolean {
  return err instanceof CmsError && err.code === "cms_not_found";
}

export type { SavoirCms };

/**
 * Low-cardinality budget band for analytics (never the exact amount).
 * Sale bands and rent bands differ; without a purpose, amounts >= 500k are treated as sale.
 */
export function budgetBand(max: number | undefined, purpose: "buy" | "rent" | undefined): string {
  if (max === undefined) return "unspecified";
  const sale = purpose === "buy" || (purpose === undefined && max >= 500_000);
  const bands: Array<[number, string]> = sale
    ? [[1_000_000, "sale_<1M"], [2_000_000, "sale_1-2M"], [3_000_000, "sale_2-3M"], [5_000_000, "sale_3-5M"], [10_000_000, "sale_5-10M"]]
    : [[80_000, "rent_<80k"], [120_000, "rent_80-120k"], [180_000, "rent_120-180k"], [300_000, "rent_180-300k"]];
  for (const [limit, label] of bands) if (max <= limit) return label;
  return sale ? "sale_10M+" : "rent_300k+";
}
