/**
 * Privacy-conscious business metrics: DAILY AGGREGATE COUNTERS only.
 *
 * Stored: counts per Dubai calendar day, per event, per low-cardinality dimension set
 * (e.g. purpose=buy, budget_band=sale_2-3M, area=Dubai Marina), plus per-listing counts
 * (public listing slugs). NOT stored: conversation text, search free text, names, emails,
 * phone numbers, IP addresses, user/session identifiers, shortlist ids, exact timestamps.
 *
 * Never exposed through MCP tools. Read only by the staff report / authenticated dashboard.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Logger } from "./logger.js";
import type { Analytics } from "./tools/common.js";

export const ANALYTICS_EVENTS = [
  "search",
  "search_area",
  "offplan_search",
  "area_guide",
  "detail_view",
  "compare",
  "compare_listing",
  "shortlist_created",
  "shortlist_add",
  "shortlist_remove",
  "shortlist_view",
  "shortlist_shared",
  "shortlist_unshared",
  "shortlist_deleted",
  "shared_page_view",
  "handoff_prepared",
  "handoff_listing",
  "contact_options",
  "link_click",
  "inquiry_submitted",
] as const;
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];
const EVENT_SET = new Set<string>(ANALYTICS_EVENTS);

const RETENTION_DAYS = 400;
const MAX_KEYS_PER_EVENT_PER_DAY = 500;
const MAX_LISTINGS_PER_DAY = 2000;
// Dimension values must look like CMS vocabulary, bands or codes — never free text.
const SAFE_VALUE = /^[\p{L}\p{N} _.,()&'+<>/-]{0,80}$/u;
const SAFE_KEY = /^[a-z_]{1,32}$/;
const SAFE_SLUG = /^[A-Za-z0-9._~%-]{1,240}$/;

export interface DayBucket {
  events: Record<string, Record<string, number>>;
  listings: Record<string, Record<string, number>>;
}
export interface AnalyticsData {
  version: 1;
  days: Record<string, DayBucket>;
}

/** Calendar day in Dubai (UTC+4, no DST). */
export function dubaiDay(ms: number): string {
  return new Date(ms + 4 * 3600_000).toISOString().slice(0, 10);
}

export function dimKey(dims: Record<string, string | number | boolean | undefined> | undefined): string {
  if (!dims) return "";
  return Object.keys(dims)
    .filter((k) => dims[k] !== undefined && SAFE_KEY.test(k))
    .sort()
    .map((k) => {
      const s = String(dims[k]);
      // Defence in depth: anything that is not vocabulary-like, or that could be a phone
      // number (7+ digits), is stored as "other".
      const ok = SAFE_VALUE.test(s) && (s.match(/\d/g)?.length ?? 0) < 7;
      return `${k}=${ok ? s : "other"}`;
    })
    .join("|");
}

export function parseDimKey(key: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!key) return out;
  for (const part of key.split("|")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i)] = part.slice(i + 1);
  }
  return out;
}

export class AggregateAnalytics implements Analytics {
  private data: AnalyticsData = { version: 1, days: {} };
  private timer: NodeJS.Timeout | null = null;
  private readonly file: string | null;

  constructor(dataDir: string | null, private readonly logger: Logger, private readonly now: () => number = Date.now) {
    this.file = dataDir ? join(dataDir, "analytics.json") : null;
    if (dataDir && !existsSync(dataDir)) mkdirSync(dataDir, { recursive: true, mode: 0o700 });
    this.load();
  }

  record(event: string, dims?: Record<string, string | number | boolean | undefined>, listing?: { kind: string; slug: string }): void {
    if (!EVENT_SET.has(event)) return;
    try {
      const day = this.bucket();
      const byKey = (day.events[event] ??= {});
      let key = dimKey(dims);
      if (!(key in byKey) && Object.keys(byKey).length >= MAX_KEYS_PER_EVENT_PER_DAY) key = "overflow=true";
      byKey[key] = (byKey[key] ?? 0) + 1;
      if (listing && (listing.kind === "property" || listing.kind === "offplan") && SAFE_SLUG.test(listing.slug)) {
        const lk = `${listing.kind}:${listing.slug}`;
        if (lk in day.listings || Object.keys(day.listings).length < MAX_LISTINGS_PER_DAY) {
          const l = (day.listings[lk] ??= {});
          l[event] = (l[event] ?? 0) + 1;
        }
      }
      this.scheduleSave();
    } catch {
      // Metrics must never break a customer request.
    }
  }

  snapshot(): AnalyticsData {
    return JSON.parse(JSON.stringify(this.data)) as AnalyticsData;
  }

  flush(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (!this.file) return;
    this.purge();
    const tmp = `${this.file}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(this.data), { mode: 0o600 });
    renameSync(tmp, this.file);
  }

  private bucket(): DayBucket {
    const d = dubaiDay(this.now());
    return (this.data.days[d] ??= { events: {}, listings: {} });
  }

  private purge(): void {
    const cutoff = dubaiDay(this.now() - RETENTION_DAYS * 86_400_000);
    for (const d of Object.keys(this.data.days)) if (d < cutoff) delete this.data.days[d];
  }

  private scheduleSave(): void {
    if (!this.file || this.timer) return;
    this.timer = setTimeout(() => {
      try {
        this.flush();
      } catch (err) {
        this.logger.error("analytics.save_failed", { error: err instanceof Error ? err.name : "unknown" });
      }
    }, 5000);
    this.timer.unref?.();
  }

  private load(): void {
    if (!this.file || !existsSync(this.file)) return;
    try {
      const parsed = JSON.parse(readFileSync(this.file, "utf8")) as AnalyticsData;
      if (parsed && parsed.version === 1 && parsed.days && typeof parsed.days === "object") this.data = parsed;
      this.purge();
    } catch {
      try {
        renameSync(this.file, `${this.file}.corrupt-${this.now()}`);
      } catch {
        /* ignore */
      }
      this.logger.error("analytics.load_failed", { moved_aside: true });
    }
  }
}

/** Read the stored aggregates without a running server (staff report CLI). */
export function readAnalyticsFile(dataDir: string): AnalyticsData {
  const file = join(dataDir, "analytics.json");
  if (!existsSync(file)) return { version: 1, days: {} };
  return JSON.parse(readFileSync(file, "utf8")) as AnalyticsData;
}
