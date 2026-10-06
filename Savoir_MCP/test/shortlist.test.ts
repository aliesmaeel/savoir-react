import { mkdtempSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { silentLogger } from "../src/logger.js";
import { SHORTLIST_MAX_ITEMS, SHORTLIST_TTL_MS, ShortlistStore, type ListingSnapshot } from "../src/shortlist.js";

const snap = (title: string): ListingSnapshot => ({ title, url: `https://savoirproperties.com/project/${title}`, price_label: "AED 1", photo: null, location_label: null, bedrooms_label: null, captured_at: "2026-10-06T00:00:00.000Z" });
const item = (slug: string) => ({ kind: "property" as const, slug, snapshot: snap(slug) });

describe("ShortlistStore", () => {
  it("creates a shortlist with an unguessable 128-bit id and dedupes items", () => {
    const s = new ShortlistStore(null, silentLogger);
    const r = s.update(undefined, [item("a"), item("a"), item("b")], [])!;
    expect(r.created).toBe(true);
    expect(r.record.id).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(r.record.items.map((i) => i.slug)).toEqual(["a", "b"]);
    expect(s.update(r.record.id, [], [{ kind: "property", slug: "a" }])!.record.items.map((i) => i.slug)).toEqual(["b"]);
  });

  it("enforces the item limit and rejects invalid slugs", () => {
    const s = new ShortlistStore(null, silentLogger);
    const many = Array.from({ length: SHORTLIST_MAX_ITEMS + 2 }, (_, i) => item(`s${i}`));
    const r = s.update(undefined, [...many, item("../x")], [])!;
    expect(r.record.items).toHaveLength(SHORTLIST_MAX_ITEMS);
    expect(r.rejected).toEqual(["s12", "s13", "../x"]);
  });

  it("expires 30 days after the last change", () => {
    let now = Date.parse("2026-10-06T00:00:00Z");
    const s = new ShortlistStore(null, silentLogger, () => now);
    const id = s.update(undefined, [item("a")], [])!.record.id;
    now += SHORTLIST_TTL_MS - 1000;
    s.update(id, [item("b")], []); // touching extends expiry
    now += SHORTLIST_TTL_MS - 1000;
    expect(s.get(id)).not.toBeNull();
    now += 2000;
    expect(s.get(id)).toBeNull();
  });

  it("uses a separate, revocable share token; deleting kills the link", () => {
    const s = new ShortlistStore(null, silentLogger);
    const id = s.update(undefined, [item("a")], [])!.record.id;
    const shared = s.share(id)!;
    expect(shared.share_token).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(shared.share_token).not.toBe(id);
    expect(s.getByShareToken(shared.share_token!)!.id).toBe(id);
    expect(s.getByShareToken(id)).toBeNull(); // the private id is not a share token
    const token = shared.share_token!;
    s.unshare(id);
    expect(s.getByShareToken(token)).toBeNull();
    const again = s.share(id)!.share_token!;
    expect(again).not.toBe(token);
    expect(s.delete(id)).toBe(true);
    expect(s.getByShareToken(again)).toBeNull();
    expect(s.get(id)).toBeNull();
  });

  it("persists atomically and stores no personal data", () => {
    const dir = mkdtempSync(join(tmpdir(), "sl-"));
    const s = new ShortlistStore(dir, silentLogger);
    const id = s.update(undefined, [item("a")], [])!.record.id;
    s.share(id);
    s.flush();
    const raw = readFileSync(join(dir, "shortlists.json"), "utf8");
    expect(Object.keys(JSON.parse(raw).records[0]).sort()).toEqual(["created_at", "expires_at", "id", "items", "share_token", "updated_at"]);
    expect(readdirSync(dir).filter((f) => f.endsWith(".tmp"))).toEqual([]);
    const reloaded = new ShortlistStore(dir, silentLogger);
    expect(reloaded.get(id)!.items[0]!.slug).toBe("a");
  });

  it("moves a corrupt file aside instead of crashing", () => {
    const dir = mkdtempSync(join(tmpdir(), "sl-"));
    writeFileSync(join(dir, "shortlists.json"), "{not json");
    const s = new ShortlistStore(dir, silentLogger);
    expect(s.size()).toBe(0);
    expect(readdirSync(dir).some((f) => f.startsWith("shortlists.json.corrupt-"))).toBe(true);
  });

  it("rejects malformed ids without lookup", () => {
    const s = new ShortlistStore(null, silentLogger);
    expect(s.get("short")).toBeNull();
    expect(s.update("not-a-valid-id-at-all!!", [], [])).toBeNull();
  });
});
