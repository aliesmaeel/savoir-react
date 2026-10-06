/**
 * Low-level HTTP client for the Savoir CMS.
 *
 * Verified CMS behaviour (Oct 2026) this client accounts for:
 * - Public read endpoints need no authentication.
 * - The API throttles at 60 requests/minute per client IP (HTTP 429,
 *   X-RateLimit-Limit: 60). We keep our own budget below that.
 * - Unknown slugs on /api/property/{slug} and /api/offplan-projects/{slug}
 *   answer HTTP 500 with a Laravel debug payload ("Attempt to read property
 *   ... on null") including stack traces. Those bodies are never surfaced.
 * - Some invalid inputs (e.g. limit=0, arrays where strings are expected)
 *   also produce 500s, so inputs are validated before calling.
 */
import type { Logger } from "../logger.js";

export type CmsErrorCode =
  | "cms_timeout"
  | "cms_unreachable"
  | "cms_rate_limited"
  | "cms_not_found"
  | "cms_rejected"
  | "cms_error"
  | "cms_invalid_response"
  | "local_rate_limited";

const PUBLIC_MESSAGES: Record<CmsErrorCode, string> = {
  cms_timeout: "The Savoir listings service did not respond in time. Please try again shortly.",
  cms_unreachable: "The Savoir listings service could not be reached. Please try again shortly.",
  cms_rate_limited: "The Savoir listings service is busy. Please wait a minute and try again.",
  cms_not_found: "That listing was not found. It may have been removed or the reference is incorrect.",
  cms_rejected: "The Savoir listings service rejected the request.",
  cms_error: "The Savoir listings service returned an error. Please try again later.",
  cms_invalid_response: "The Savoir listings service returned an unexpected response.",
  local_rate_limited: "Too many listing requests right now. Please wait a minute and try again.",
};

export class CmsError extends Error {
  readonly code: CmsErrorCode;
  readonly status: number | undefined;
  /** Safe, user-facing message. Never contains CMS bodies, traces or file paths. */
  readonly publicMessage: string;
  /** Validation messages from a 422 response (field-level, safe to show). */
  readonly fieldErrors: Record<string, string[]> | undefined;

  constructor(code: CmsErrorCode, status?: number, fieldErrors?: Record<string, string[]>) {
    super(`${code}${status ? ` (HTTP ${status})` : ""}`);
    this.name = "CmsError";
    this.code = code;
    this.status = status;
    this.publicMessage = PUBLIC_MESSAGES[code];
    this.fieldErrors = fieldErrors;
  }
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export interface CmsClientOptions {
  baseUrl: string;
  timeoutMs: number;
  maxRequestsPerMinute: number;
  logger: Logger;
  fetchImpl?: FetchLike;
  now?: () => number;
}

/** Sliding one-minute window of outbound request timestamps. */
class RequestBudget {
  private stamps: number[] = [];
  constructor(private readonly limit: number, private readonly now: () => number) {}
  take(): boolean {
    const t = this.now();
    this.stamps = this.stamps.filter((s) => t - s < 60_000);
    if (this.stamps.length >= this.limit) return false;
    this.stamps.push(t);
    return true;
  }
}

/** Small TTL cache with a size cap (insertion-order eviction). */
export class TtlCache<V> {
  private map = new Map<string, { value: V; expires: number }>();
  constructor(private readonly max: number, private readonly now: () => number) {}
  get(key: string): V | undefined {
    const hit = this.map.get(key);
    if (!hit) return undefined;
    if (hit.expires <= this.now()) {
      this.map.delete(key);
      return undefined;
    }
    return hit.value;
  }
  set(key: string, value: V, ttlMs: number): void {
    if (this.map.size >= this.max) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
    this.map.set(key, { value, expires: this.now() + ttlMs });
  }
}

/** The CMS signals a missing record by dereferencing null in its controller. */
function looksLikeMissingRecord(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const message = (body as { message?: unknown }).message;
  return typeof message === "string" && /on null/i.test(message);
}

export class CmsClient {
  private readonly fetchImpl: FetchLike;
  private readonly budget: RequestBudget;
  private readonly cache: TtlCache<unknown>;
  private readonly logger: Logger;

  constructor(private readonly opts: CmsClientOptions) {
    const now = opts.now ?? Date.now;
    this.fetchImpl = opts.fetchImpl ?? ((input, init) => fetch(input, init));
    this.budget = new RequestBudget(opts.maxRequestsPerMinute, now);
    this.cache = new TtlCache(500, now);
    this.logger = opts.logger;
  }

  async get<T = unknown>(path: string, opts: { cacheTtlMs?: number; notFoundOnMissingRecord?: boolean } = {}): Promise<T> {
    return this.request<T>("GET", path, undefined, opts);
  }

  async post<T = unknown>(path: string, body: unknown, opts: { cacheTtlMs?: number; acceptNonJsonSuccess?: boolean } = {}): Promise<T> {
    return this.request<T>("POST", path, body, opts);
  }

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    body: unknown,
    opts: { cacheTtlMs?: number; notFoundOnMissingRecord?: boolean; acceptNonJsonSuccess?: boolean },
  ): Promise<T> {
    const cacheKey = opts.cacheTtlMs ? `${method} ${path} ${body === undefined ? "" : JSON.stringify(body)}` : undefined;
    if (cacheKey) {
      const hit = this.cache.get(cacheKey);
      if (hit !== undefined) return hit as T;
    }

    if (!this.budget.take()) {
      this.logger.warn("cms.request.local_rate_limited", { method, endpoint: endpointLabel(path) });
      throw new CmsError("local_rate_limited");
    }

    const started = Date.now();
    let res: Response;
    try {
      res = await this.fetchImpl(`${this.opts.baseUrl}${path}`, {
        method,
        headers: {
          Accept: "application/json",
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(this.opts.timeoutMs),
        redirect: "error",
      });
    } catch (err) {
      const name = (err as { name?: string })?.name;
      const code: CmsErrorCode = name === "TimeoutError" || name === "AbortError" ? "cms_timeout" : "cms_unreachable";
      this.logger.warn("cms.request.failed", { method, endpoint: endpointLabel(path), code, ms: Date.now() - started });
      throw new CmsError(code);
    }

    let parsed: unknown = undefined;
    let parseFailed = false;
    try {
      const text = await res.text();
      parsed = text ? JSON.parse(text) : undefined;
    } catch {
      parseFailed = true;
    }

    const logFields = { method, endpoint: endpointLabel(path), status: res.status, ms: Date.now() - started };

    if (!res.ok) {
      let code: CmsErrorCode;
      let fieldErrors: Record<string, string[]> | undefined;
      if (res.status === 429) code = "cms_rate_limited";
      else if (res.status === 404) code = "cms_not_found";
      else if (res.status === 500 && opts.notFoundOnMissingRecord && looksLikeMissingRecord(parsed)) code = "cms_not_found";
      else if (res.status === 422 || res.status === 400) {
        code = "cms_rejected";
        fieldErrors = extractFieldErrors(parsed);
      } else code = "cms_error";
      this.logger.warn("cms.request.error", { ...logFields, code });
      throw new CmsError(code, res.status, fieldErrors);
    }

    if ((parseFailed || parsed === undefined) && opts.acceptNonJsonSuccess) {
      // Writes: a 2xx means the CMS accepted the request even if the body is not JSON.
      this.logger.info("cms.request.ok_non_json", logFields);
      return {} as T;
    }
    if (parseFailed || parsed === undefined) {
      this.logger.warn("cms.request.invalid_response", logFields);
      throw new CmsError("cms_invalid_response", res.status);
    }

    this.logger.debug("cms.request.ok", logFields);
    if (cacheKey && opts.cacheTtlMs) this.cache.set(cacheKey, parsed, opts.cacheTtlMs);
    return parsed as T;
  }
}

/** Strip slugs/query strings from paths so logs never carry identifiers or filters. */
export function endpointLabel(path: string): string {
  const p = path.split("?")[0] ?? path;
  return p.replace(/^(\/api\/(?:property|offplan-projects))\/.+$/, "$1/:slug");
}

/** Laravel-style 422: { errors: { field: ["msg"] } }. Keep only short string messages. */
function extractFieldErrors(body: unknown): Record<string, string[]> | undefined {
  if (!body || typeof body !== "object") return undefined;
  const errors = (body as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return undefined;
  const out: Record<string, string[]> = {};
  for (const [field, msgs] of Object.entries(errors as Record<string, unknown>)) {
    if (!/^[a-z_]{1,40}$/i.test(field) || !Array.isArray(msgs)) continue;
    out[field] = msgs.filter((m): m is string => typeof m === "string").map((m) => m.slice(0, 200)).slice(0, 3);
  }
  return Object.keys(out).length ? out : undefined;
}
