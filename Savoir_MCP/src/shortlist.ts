/**
 * Conversation shortlists with optional read-only share links.
 *
 * Why server-side: MCP Apps / ChatGPT card state is per rendered card, the model only
 * sees it if pushed into model context, and the host provides no user identity. A small
 * record with an unguessable ID lets the shortlist survive across searches in a conversation.
 *
 * What is stored: listing references (kind + slug) and timestamps. No names, contact
 * details, conversation text, IP addresses or user identifiers.
 *
 * - shortlist_id (128-bit, base64url): needed to view/change/delete. Kept in the conversation.
 * - share_token (separate 128-bit): only for the read-only public page /s/<token>; it cannot
 *   change the list. Revocable; deleting the shortlist also kills the link.
 * - Expiry: 30 days after the last change. Expired records are purged.
 * - Storage: one JSON file, atomic writes (write temp + rename). Single-process server.
 */
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Logger } from "./logger.js";
import { isValidSlug } from "./cms/sanitize.js";

export const SHORTLIST_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const SHORTLIST_MAX_ITEMS = 12;
const MAX_RECORDS = 20_000;
const ID_RE = /^[A-Za-z0-9_-]{22}$/;

export type ListingKind = "property" | "offplan";
/**
 * Listing facts captured by the SERVER from the CMS when the item was added (never supplied by
 * the client, so a share page cannot be used to publish forged content under Savoir's domain).
 */
export interface ListingSnapshot {
  title: string;
  url: string;
  price_label: string | null;
  photo: string | null;
  location_label: string | null;
  bedrooms_label: string | null;
  captured_at: string;
}

export interface ShortlistItem {
  kind: ListingKind;
  slug: string;
  added_at: string;
  snapshot: ListingSnapshot;
}
export interface ShortlistRecord {
  id: string;
  share_token: string | null;
  items: ShortlistItem[];
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export const PERSISTENCE_NOTICE =
  "This shortlist is stored on Savoir's server for 30 days after its last change. It contains only listing references (no personal details). " +
  "Anyone who has the shortlist ID can view or change it, so keep it to this conversation. You can delete it at any time.";

const newToken = () => randomBytes(16).toString("base64url");

export class ShortlistStore {
  private byId = new Map<string, ShortlistRecord>();
  private byShare = new Map<string, string>();
  private saveTimer: NodeJS.Timeout | null = null;
  private readonly file: string | null;

  constructor(dataDir: string | null, private readonly logger: Logger, private readonly now: () => number = Date.now) {
    this.file = dataDir ? join(dataDir, "shortlists.json") : null;
    if (dataDir && !existsSync(dataDir)) mkdirSync(dataDir, { recursive: true, mode: 0o700 });
    this.load();
  }

  static isValidId(id: unknown): id is string {
    return typeof id === "string" && ID_RE.test(id);
  }

  get(id: string): ShortlistRecord | null {
    if (!ShortlistStore.isValidId(id)) return null;
    const r = this.byId.get(id);
    if (!r) return null;
    if (Date.parse(r.expires_at) <= this.now()) {
      this.remove(r.id);
      return null;
    }
    return r;
  }

  getByShareToken(token: string): ShortlistRecord | null {
    if (!ShortlistStore.isValidId(token)) return null;
    const id = this.byShare.get(token);
    return id ? this.get(id) : null;
  }

  /** Create (when id is absent) or modify a shortlist. Returns null if the id is unknown/expired. */
  update(id: string | undefined, add: Array<{ kind: ListingKind; slug: string; snapshot: ListingSnapshot }>, remove: Array<{ kind: ListingKind; slug: string }>, clear = false): { record: ShortlistRecord; created: boolean; rejected: string[] } | null {
    const t = new Date(this.now()).toISOString();
    let record: ShortlistRecord;
    let created = false;
    if (id) {
      const existing = this.get(id);
      if (!existing) return null;
      record = existing;
    } else {
      this.purgeExpired();
      if (this.byId.size >= MAX_RECORDS) throw new Error("shortlist capacity reached");
      record = { id: newToken(), share_token: null, items: [], created_at: t, updated_at: t, expires_at: t };
      this.byId.set(record.id, record);
      created = true;
    }
    const key = (x: { kind: string; slug: string }) => `${x.kind}:${x.slug}`;
    if (clear) record.items = [];
    const removeKeys = new Set(remove.map(key));
    record.items = record.items.filter((i) => !removeKeys.has(key(i)));
    const rejected: string[] = [];
    for (const a of add) {
      if (!isValidSlug(a.slug)) {
        rejected.push(a.slug);
        continue;
      }
      if (record.items.some((i) => key(i) === key(a))) continue;
      if (record.items.length >= SHORTLIST_MAX_ITEMS) {
        rejected.push(a.slug);
        continue;
      }
      record.items.push({ kind: a.kind, slug: a.slug, added_at: t, snapshot: a.snapshot });
    }
    record.updated_at = t;
    record.expires_at = new Date(this.now() + SHORTLIST_TTL_MS).toISOString();
    this.scheduleSave();
    return { record, created, rejected };
  }

  share(id: string): ShortlistRecord | null {
    const r = this.get(id);
    if (!r) return null;
    if (!r.share_token) {
      r.share_token = newToken();
      this.byShare.set(r.share_token, r.id);
      this.scheduleSave();
    }
    return r;
  }

  unshare(id: string): ShortlistRecord | null {
    const r = this.get(id);
    if (!r) return null;
    if (r.share_token) this.byShare.delete(r.share_token);
    r.share_token = null;
    this.scheduleSave();
    return r;
  }

  delete(id: string): boolean {
    if (!this.get(id)) return false;
    this.remove(id);
    this.scheduleSave();
    return true;
  }

  size(): number {
    return this.byId.size;
  }

  /** Write pending changes now (called on shutdown and by tests). */
  flush(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = null;
    if (!this.file) return;
    const tmp = `${this.file}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify({ version: 1, records: [...this.byId.values()] }), { mode: 0o600 });
    renameSync(tmp, this.file);
  }

  private remove(id: string): void {
    const r = this.byId.get(id);
    if (r?.share_token) this.byShare.delete(r.share_token);
    this.byId.delete(id);
  }

  private purgeExpired(): void {
    const t = this.now();
    for (const r of [...this.byId.values()]) if (Date.parse(r.expires_at) <= t) this.remove(r.id);
  }

  private scheduleSave(): void {
    if (!this.file || this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      try {
        this.flush();
      } catch (err) {
        this.logger.error("shortlist.save_failed", { error: err instanceof Error ? err.name : "unknown" });
      }
    }, 500);
    this.saveTimer.unref?.();
  }

  private load(): void {
    if (!this.file || !existsSync(this.file)) return;
    try {
      const parsed = JSON.parse(readFileSync(this.file, "utf8")) as { records?: ShortlistRecord[] };
      for (const r of parsed.records ?? []) {
        if (!ShortlistStore.isValidId(r.id) || !Array.isArray(r.items)) continue;
        r.items = r.items.filter((i) => i && typeof i.slug === "string" && i.snapshot && typeof i.snapshot.title === "string");
        this.byId.set(r.id, r);
        if (r.share_token && ShortlistStore.isValidId(r.share_token)) this.byShare.set(r.share_token, r.id);
      }
      this.purgeExpired();
      this.logger.info("shortlist.loaded", { records: this.byId.size });
    } catch {
      const aside = `${this.file}.corrupt-${this.now()}`;
      try {
        renameSync(this.file, aside);
      } catch {
        /* ignore */
      }
      this.logger.error("shortlist.load_failed", { moved_aside: true });
    }
  }
}
