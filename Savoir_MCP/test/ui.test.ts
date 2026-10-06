import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildWidgetHtml } from "../src/ui/widget.js";

const clientPath = (f: string) => fileURLToPath(new URL(`../src/ui/client/${f}`, import.meta.url));

describe("widget client", () => {
  it("has the same UI strings in English and Arabic", () => {
    const i18n = JSON.parse(readFileSync(clientPath("i18n.json"), "utf8")) as { en: Record<string, unknown>; ar: Record<string, unknown> };
    expect(Object.keys(i18n.ar).sort()).toEqual(Object.keys(i18n.en).sort());
    for (const [k, v] of Object.entries(i18n.ar)) if (typeof v === "string") expect(v.trim(), k).not.toBe("");
  });

  it("is valid JavaScript and never builds markup from data", () => {
    execFileSync(process.execPath, ["--check", clientPath("app.js")]);
    const src = readFileSync(clientPath("app.js"), "utf8");
    // The only innerHTML use is the static heart SVG.
    expect(src.match(/\.innerHTML\s*=/g)).toHaveLength(1);
    expect(src).toContain("b.innerHTML = saved ? HEART : HEART_O;");
  });

  it("inlines everything into one MCP Apps page", () => {
    const html = buildWidgetHtml("globalThis.__savoirMcpApps={};");
    expect(html).toContain('<script type="application/json" id="sv-i18n">');
    expect(html).toContain('id="sv-live" class="sr" role="status"');
    expect(html).not.toMatch(/<script[^>]+src=/); // no external scripts
  });
});
