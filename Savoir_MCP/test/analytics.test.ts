import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AggregateAnalytics, dimKey, dubaiDay, parseDimKey } from "../src/analytics.js";
import { silentLogger } from "../src/logger.js";

describe("dimension keys", () => {
  it("are sorted, and replace anything that is not vocabulary-like with 'other'", () => {
    expect(dimKey({ purpose: "buy", area: "Dubai Creek Harbour (The Lagoons)", n: 3, ok: true })).toBe("area=Dubai Creek Harbour (The Lagoons)|n=3|ok=true|purpose=buy");
    expect(dimKey({ x: "jane@example.com" })).toBe("x=other");
    expect(dimKey({ x: "+971 50 123 4567" })).toBe("x=other");
    expect(dimKey({ x: "a|b=c" })).toBe("x=other");
    expect(dimKey({ BadKey: "v", skip: undefined })).toBe("");
    expect(parseDimKey("a=1|b=x y")).toEqual({ a: "1", b: "x y" });
  });

  it("buckets by Dubai calendar day", () => {
    expect(dubaiDay(Date.parse("2026-10-06T19:59:00Z"))).toBe("2026-10-06");
    expect(dubaiDay(Date.parse("2026-10-06T20:01:00Z"))).toBe("2026-10-07");
  });
});

describe("AggregateAnalytics", () => {
  it("counts events per day and dimension, and per public listing", () => {
    const a = new AggregateAnalytics(null, silentLogger, () => Date.parse("2026-10-06T08:00:00Z"));
    a.record("search", { purpose: "buy", outcome: "ok" });
    a.record("search", { purpose: "buy", outcome: "ok" });
    a.record("detail_view", { kind: "property" }, { kind: "property", slug: "nice-flat-1" });
    a.record("not_an_event", { x: 1 });
    a.record("detail_view", {}, { kind: "person", slug: "x" }); // invalid listing kind: event counted, listing ignored
    const d = a.snapshot().days["2026-10-06"]!;
    expect(d.events.search).toEqual({ "outcome=ok|purpose=buy": 2 });
    expect(d.events.not_an_event).toBeUndefined();
    expect(d.listings).toEqual({ "property:nice-flat-1": { detail_view: 1 } });
  });

  it("caps distinct dimension sets per event per day", () => {
    const a = new AggregateAnalytics(null, silentLogger, () => Date.parse("2026-10-06T08:00:00Z"));
    for (let i = 0; i < 520; i++) a.record("search_area", { area: `Area ${String.fromCharCode(65 + (i % 26))}${i}` });
    const keys = Object.keys(a.snapshot().days["2026-10-06"]!.events.search_area!);
    expect(keys).toHaveLength(501);
    expect(a.snapshot().days["2026-10-06"]!.events.search_area!["overflow=true"]).toBe(20);
  });

  it("persists atomically, drops data older than the retention period and survives a corrupt file", () => {
    const dir = mkdtempSync(join(tmpdir(), "an-"));
    let now = Date.parse("2025-01-01T08:00:00Z");
    const a = new AggregateAnalytics(dir, silentLogger, () => now);
    a.record("search", { purpose: "rent" });
    now = Date.parse("2026-10-06T08:00:00Z");
    a.record("search", { purpose: "buy" });
    a.flush();
    const stored = JSON.parse(readFileSync(join(dir, "analytics.json"), "utf8"));
    expect(Object.keys(stored.days)).toEqual(["2026-10-06"]);
    expect(readdirSync(dir).some((f) => f.endsWith(".tmp"))).toBe(false);
    writeFileSync(join(dir, "analytics.json"), "{broken");
    const b = new AggregateAnalytics(dir, silentLogger);
    expect(b.snapshot().days).toEqual({});
    expect(readdirSync(dir).some((f) => f.startsWith("analytics.json.corrupt-"))).toBe(true);
  });
});
