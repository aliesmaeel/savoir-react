import {
  buildCanonicalUrl,
  buildDynamicCanonicalUrl,
  PRODUCTION_ORIGIN,
} from "./canonical";

export const SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9";
export const MAX_URLS_PER_SITEMAP = 50_000;

export type SitemapRecord = Record<string, unknown>;

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

export type SitemapLogger = Pick<Console, "warn">;

const FALSE_VALUES = new Set<unknown>([false, 0, "0", "false", "no", "off"]);
const PUBLICATION_BOOLEAN_FIELDS = [
  "published",
  "is_published",
  "publish_to_web_site",
  "is_public",
  "public",
  "active",
  "is_active",
  "visible",
  "is_visible",
] as const;
const VISIBILITY_FIELDS = ["visibility", "publication_status"] as const;
const NON_PUBLIC_VISIBILITY_VALUES = new Set([
  "private",
  "internal",
  "hidden",
  "draft",
  "unpublished",
  "preview",
]);
const MODIFIED_DATE_FIELDS = [
  "updated_at",
  "updatedAt",
  "modified_at",
  "modifiedAt",
  "published_at",
  "publishedAt",
  "created_at",
  "createdAt",
] as const;

function hasOwn(record: SitemapRecord, field: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, field);
}

function isExplicitlyFalse(value: unknown): boolean {
  return FALSE_VALUES.has(
    typeof value === "string" ? value.trim().toLowerCase() : value,
  );
}

export function isPublicRecord(record: SitemapRecord): boolean {
  for (const field of PUBLICATION_BOOLEAN_FIELDS) {
    if (hasOwn(record, field) && isExplicitlyFalse(record[field])) return false;
  }

  for (const field of VISIBILITY_FIELDS) {
    const value = record[field];
    if (
      typeof value === "string" &&
      NON_PUBLIC_VISIBILITY_VALUES.has(value.trim().toLowerCase())
    ) {
      return false;
    }
  }

  return true;
}

export function normalizeLastmod(value: unknown): string | undefined {
  if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date)) {
    return undefined;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return parsed.toISOString();
}

export function getRecordLastmod(record: SitemapRecord): string | undefined {
  for (const field of MODIFIED_DATE_FIELDS) {
    const lastmod = normalizeLastmod(record[field]);
    if (lastmod) return lastmod;
  }

  return undefined;
}

export function recordsToSitemapEntries(
  records: readonly unknown[],
  pathPrefix: string,
  logger: SitemapLogger = console,
): SitemapEntry[] {
  const entries = new Map<string, SitemapEntry>();

  for (const candidate of records) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      logger.warn(`[sitemap] Skipping malformed ${pathPrefix} record: expected an object.`);
      continue;
    }

    const record = candidate as SitemapRecord;
    if (!isPublicRecord(record)) continue;

    const loc = buildDynamicCanonicalUrl(pathPrefix, record.slug);
    if (!loc) {
      logger.warn(
        `[sitemap] Skipping malformed ${pathPrefix} record${record.id ? ` ${String(record.id)}` : ""}: invalid slug.`,
      );
      continue;
    }

    const nextEntry: SitemapEntry = { loc };
    const lastmod = getRecordLastmod(record);
    if (lastmod) nextEntry.lastmod = lastmod;

    const existingEntry = entries.get(loc);
    if (!existingEntry || (nextEntry.lastmod ?? "") > (existingEntry.lastmod ?? "")) {
      entries.set(loc, nextEntry);
    }
  }

  return [...entries.values()].slice(0, MAX_URLS_PER_SITEMAP);
}

export function staticPagesToSitemapEntries(paths: readonly string[]): SitemapEntry[] {
  return [...new Set(paths.map(buildCanonicalUrl))].map((loc) => ({ loc }));
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&apos;");
}

function serializeEntry(entry: SitemapEntry, elementName: "url" | "sitemap"): string {
  const lastmod = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
  return `<${elementName}><loc>${escapeXml(entry.loc)}</loc>${lastmod}</${elementName}>`;
}

export function serializeUrlSet(entries: readonly SitemapEntry[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NAMESPACE}">`,
    ...entries.slice(0, MAX_URLS_PER_SITEMAP).map((entry) => serializeEntry(entry, "url")),
    "</urlset>",
  ].join("\n");
}

export function serializeSitemapIndex(entries: readonly SitemapEntry[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<sitemapindex xmlns="${SITEMAP_NAMESPACE}">`,
    ...entries.slice(0, MAX_URLS_PER_SITEMAP).map((entry) => serializeEntry(entry, "sitemap")),
    "</sitemapindex>",
  ].join("\n");
}

export function isProductionContentUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.origin === PRODUCTION_ORIGIN &&
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}
