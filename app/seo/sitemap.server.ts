import { envConfig } from "~/config/envConfig";
import { buildCanonicalUrl, PUBLIC_STATIC_PATHS } from "./canonical";
import {
  recordsToSitemapEntries,
  serializeSitemapIndex,
  serializeUrlSet,
  staticPagesToSitemapEntries,
  type SitemapEntry,
  type SitemapLogger,
} from "./sitemap";

export const SITEMAP_CACHE_CONTROL =
  "public, max-age=300, s-maxage=900, stale-while-revalidate=3600, stale-if-error=86400";

export const XML_RESPONSE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": SITEMAP_CACHE_CONTROL,
  "X-Content-Type-Options": "nosniff",
} as const;

export const SITEMAP_TYPES = [
  "properties",
  "off-plan",
  "blogs",
  "news",
  "agents",
  "areas",
] as const;

export type SitemapType = (typeof SITEMAP_TYPES)[number];

type FetchLike = typeof fetch;

type ContentPage = {
  records: unknown[];
  page: number;
  totalPages: number;
};

type CachedValue<T> = {
  value?: T;
  freshUntil: number;
  staleUntil: number;
  lastAccessed: number;
  pending?: Promise<T>;
};

const CMS_PAGE_SIZE = 500;
const CACHE_FRESH_MS = 15 * 60 * 1000;
const CACHE_STALE_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_CACHE_ENTRIES = 100;
const contentCache = new Map<string, CachedValue<ContentPage>>();

const CONTENT_CONFIG: Record<
  SitemapType,
  { pathPrefix: string; fetchPage: (page: number, fetcher: FetchLike) => Promise<ContentPage> }
> = {
  properties: { pathPrefix: "/project", fetchPage: fetchPropertiesPage },
  "off-plan": { pathPrefix: "/off-plan", fetchPage: fetchOffPlanPage },
  blogs: { pathPrefix: "/blogs", fetchPage: fetchBlogsPage },
  news: { pathPrefix: "/news", fetchPage: fetchNewsPage },
  agents: { pathPrefix: "/our-team", fetchPage: fetchAgentsPage },
  areas: { pathPrefix: "/popular-areas", fetchPage: fetchAreasPage },
};

function positiveInteger(value: unknown, fallback = 1): number {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function recordsFrom(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function setCacheEntry(key: string, entry: CachedValue<ContentPage>): void {
  contentCache.set(key, entry);
  if (contentCache.size <= MAX_CACHE_ENTRIES) return;

  const evictionCandidate = [...contentCache.entries()]
    .filter(([candidateKey, candidate]) => candidateKey !== key && !candidate.pending)
    .sort(([, left], [, right]) => left.lastAccessed - right.lastAccessed)[0];

  if (evictionCandidate) contentCache.delete(evictionCandidate[0]);
}

function getCmsBaseUrl(): string {
  const baseUrl = envConfig.baseUrl?.trim().replace(/\/+$/u, "");
  if (!baseUrl) throw new Error("VITE_BASE_URL is required for sitemap generation.");
  return baseUrl;
}

async function fetchCmsJson(
  pathname: string,
  init: RequestInit | undefined,
  fetcher: FetchLike,
): Promise<unknown> {
  const response = await fetcher(`${getCmsBaseUrl()}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    signal: init?.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`CMS request failed with ${response.status} for ${pathname}.`);
  }

  return response.json();
}

function searchBody(): string {
  return JSON.stringify({
    query: [],
    offering_type: null,
    completion_status: null,
    type: null,
    bedroom: null,
    bathroom: null,
    min_price: null,
    max_price: null,
  });
}

async function fetchPropertiesPage(page: number, fetcher: FetchLike): Promise<ContentPage> {
  const result = (await fetchCmsJson(
    `/api/search?page=${page}&limit=${CMS_PAGE_SIZE}&sort_field=updated_at&sort_order=desc`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: searchBody() },
    fetcher,
  )) as Record<string, unknown>;

  return {
    records: recordsFrom(result.data),
    page: positiveInteger(result.page, page),
    totalPages: positiveInteger(result.total_pages),
  };
}

async function fetchOffPlanPage(page: number, fetcher: FetchLike): Promise<ContentPage> {
  const result = (await fetchCmsJson(
    `/api/search-offplan?page=${page}&limit=${CMS_PAGE_SIZE}&sort_field=updated_at&sort_order=desc`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ developers: null, completion_date: null, locations: null }),
    },
    fetcher,
  )) as Record<string, unknown>;
  const pagination = (result.pagination ?? {}) as Record<string, unknown>;

  return {
    records: recordsFrom(result.data),
    page: positiveInteger(pagination.current_page, page),
    totalPages: positiveInteger(pagination.last_page ?? pagination.total_pages),
  };
}

async function fetchBlogsPage(page: number, fetcher: FetchLike): Promise<ContentPage> {
  const result = (await fetchCmsJson(
    `/api/blogs?page=${page}&limit=${CMS_PAGE_SIZE}&sort_field=title&sort_order=asc`,
    undefined,
    fetcher,
  )) as Record<string, unknown>;
  const pagination = (result.pagination ?? {}) as Record<string, unknown>;

  return {
    records: recordsFrom(result.data),
    page: positiveInteger(pagination.current_page, page),
    totalPages: positiveInteger(pagination.last_page ?? pagination.total_pages),
  };
}

async function fetchNewsPage(page: number, fetcher: FetchLike): Promise<ContentPage> {
  const result = (await fetchCmsJson(
    `/api/news?page=${page}&limit=${CMS_PAGE_SIZE}`,
    undefined,
    fetcher,
  )) as Record<string, unknown>;
  const pagination = (result.pagination ?? {}) as Record<string, unknown>;

  return {
    records: recordsFrom(result.data),
    page: positiveInteger(pagination.current_page, page),
    totalPages: positiveInteger(pagination.last_page ?? pagination.total_pages),
  };
}

async function fetchAgentsPage(page: number, fetcher: FetchLike): Promise<ContentPage> {
  const result = await fetchCmsJson("/api/teams", undefined, fetcher);
  return { records: page === 1 ? recordsFrom(result) : [], page, totalPages: 1 };
}

async function fetchAreasPage(page: number, fetcher: FetchLike): Promise<ContentPage> {
  const result = (await fetchCmsJson("/api/home", undefined, fetcher)) as Record<string, unknown>;
  return { records: page === 1 ? recordsFrom(result.areas) : [], page, totalPages: 1 };
}

async function getCachedContentPage(
  type: SitemapType,
  page: number,
  fetcher: FetchLike,
  logger: SitemapLogger,
): Promise<ContentPage> {
  const key = `${type}:${page}`;
  const now = Date.now();
  const cached = contentCache.get(key);

  if (cached?.value && cached.freshUntil > now) {
    cached.lastAccessed = now;
    return cached.value;
  }
  if (cached?.pending) return cached.pending;

  const pending = CONTENT_CONFIG[type]
    .fetchPage(page, fetcher)
    .then((value) => {
      setCacheEntry(key, {
        value,
        freshUntil: Date.now() + CACHE_FRESH_MS,
        staleUntil: Date.now() + CACHE_STALE_MS,
        lastAccessed: Date.now(),
      });
      return value;
    })
    .catch((error: unknown) => {
      if (cached?.value && cached.staleUntil > now) {
        logger.warn(`[sitemap] Serving stale ${key} data after a CMS error.`, error);
        setCacheEntry(key, { ...cached, lastAccessed: Date.now(), pending: undefined });
        return cached.value;
      }
      contentCache.delete(key);
      throw error;
    });

  setCacheEntry(key, {
    ...cached,
    freshUntil: cached?.freshUntil ?? 0,
    staleUntil: cached?.staleUntil ?? 0,
    lastAccessed: now,
    pending,
  });

  return pending;
}

export function isSitemapType(value: string | undefined): value is SitemapType {
  return SITEMAP_TYPES.includes(value as SitemapType);
}

export function resetSitemapCache(): void {
  contentCache.clear();
}

export function createPagesSitemapResponse(): Response {
  return new Response(
    serializeUrlSet(staticPagesToSitemapEntries(PUBLIC_STATIC_PATHS)),
    { status: 200, headers: XML_RESPONSE_HEADERS },
  );
}

export async function createSitemapIndexResponse(
  fetcher: FetchLike = fetch,
  logger: SitemapLogger = console,
): Promise<Response> {
  const childSitemaps: SitemapEntry[] = [{ loc: buildCanonicalUrl("/sitemap-pages.xml") }];
  const results = await Promise.allSettled(
    SITEMAP_TYPES.map(async (type) => ({
      type,
      firstPage: await getCachedContentPage(type, 1, fetcher, logger),
    })),
  );

  for (const result of results) {
    if (result.status === "rejected") {
      logger.warn("[sitemap] Skipping a temporarily unavailable sitemap source.", result.reason);
      continue;
    }

    const { type, firstPage } = result.value;
    for (let page = 1; page <= firstPage.totalPages; page += 1) {
      childSitemaps.push({ loc: buildCanonicalUrl(`/sitemaps/${type}/${page}.xml`) });
    }
  }

  return new Response(serializeSitemapIndex(childSitemaps), {
    status: 200,
    headers: XML_RESPONSE_HEADERS,
  });
}

export async function createContentSitemapResponse(
  type: SitemapType,
  page: number,
  fetcher: FetchLike = fetch,
  logger: SitemapLogger = console,
): Promise<Response> {
  if (!Number.isSafeInteger(page) || page < 1) {
    return new Response("Sitemap not found.", { status: 404 });
  }

  const contentPage = await getCachedContentPage(type, page, fetcher, logger);
  if (page > contentPage.totalPages) {
    return new Response("Sitemap not found.", { status: 404 });
  }

  const entries = recordsToSitemapEntries(
    contentPage.records,
    CONTENT_CONFIG[type].pathPrefix,
    logger,
  );

  return new Response(serializeUrlSet(entries), {
    status: 200,
    headers: XML_RESPONSE_HEADERS,
  });
}
