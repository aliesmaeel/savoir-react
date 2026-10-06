/**
 * Post-deployment verification of a public MCP endpoint. Read-only: ~8 CMS reads.
 * Exits non-zero if any required check fails.
 *
 *   npm run verify:deployment -- https://mcp.savoirproperties.com [expected-ip]
 */
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { lookup, resolve4 } from "node:dns/promises";

const base = (process.argv[2] ?? "https://mcp.savoirproperties.com").replace(/\/+$/, "");
const expectedIp = process.argv[3];
const EXPECTED_TOOLS = [
  "compare_listings", "delete_shortlist", "get_area_guide", "get_contact_options", "get_offplan_project_details", "get_property_details",
  "get_shortlist", "prepare_inquiry", "search_offplan_projects", "search_properties", "share_shortlist", "update_shortlist",
];
// Tools that may change server state (the anonymous shortlist only). Everything else must be read-only.
const SHORTLIST_WRITE_TOOLS = ["delete_shortlist", "share_shortlist", "update_shortlist"];

let failures = 0;
const pass = (m: string) => console.log(`  PASS  ${m}`);
const fail = (m: string) => {
  failures++;
  console.log(`  FAIL  ${m}`);
};
const info = (m: string) => console.log(`  info  ${m}`);
const check = (cond: unknown, m: string) => (cond ? pass(m) : fail(m));

type Result = { structuredContent?: Record<string, any>; content?: Array<{ type: string; text?: string }>; isError?: boolean };

async function main() {
  const url = new URL(base);
  console.log(`Verifying ${base}\n`);

  console.log("DNS / TLS");
  try {
    // OS resolver first (what real clients use); c-ares resolve4 as fallback.
    const ips = await lookup(url.hostname, { all: true, family: 4 })
      .then((r) => r.map((x) => x.address))
      .catch(() => resolve4(url.hostname));
    info(`A ${url.hostname} -> ${ips.join(", ")}`);
    if (expectedIp) check(ips.includes(expectedIp), `resolves to ${expectedIp}`);
  } catch {
    fail(`DNS lookup for ${url.hostname}`);
  }
  check(url.protocol === "https:", "endpoint uses https");

  console.log("\nHTTP endpoints");
  const health = await fetch(`${base}/health`).catch(() => null); // fetch validates the TLS certificate
  check(health?.status === 200, `/health 200 (got ${health?.status ?? "no response / TLS error"})`);
  const hj = health ? ((await health.json().catch(() => ({}))) as Record<string, unknown>) : {};
  check(hj.status === "ok", "/health status ok");
  check(hj.inquiry_mode === "disabled", `inquiries disabled (inquiry_mode=${String(hj.inquiry_mode)})`);
  const ready = await fetch(`${base}/ready`).catch(() => null);
  check(ready?.status === 200, `/ready 200 — CMS reachable from server (got ${ready?.status})`);
  const hsts = health?.headers.get("strict-transport-security");
  hsts ? pass("HSTS header present") : info("no HSTS header (recommended)");
  const challenge = await fetch(`${base}/.well-known/openai-apps-challenge`).catch(() => null);
  info(`/.well-known/openai-apps-challenge -> ${challenge?.status} (${challenge?.status === 200 ? "token configured" : "not configured yet"})`);
  const getMcp = await fetch(`${base}/mcp`).catch(() => null);
  info(`GET /mcp -> ${getMcp?.status} (405 expected for stateless serving)`);

  console.log("\nMCP protocol");
  const client = new Client({ name: "savoir-deploy-verify", version: "1.0.0" });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/mcp`)));
    pass("connected over Streamable HTTP");
  } catch (e) {
    fail(`MCP connect: ${e instanceof Error ? e.message : String(e)}`);
    return;
  }

  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  check(JSON.stringify(names) === JSON.stringify(EXPECTED_TOOLS), `exactly the expected ${EXPECTED_TOOLS.length} tools (${names.join(", ")})`);
  check(!names.includes("submit_property_inquiry"), "no write tool advertised");
  const readTools = tools.filter((t) => !SHORTLIST_WRITE_TOOLS.includes(t.name));
  check(readTools.every((t) => t.annotations?.readOnlyHint === true && t.annotations?.destructiveHint === false), "all non-shortlist tools annotated read-only");
  check(tools.filter((t) => SHORTLIST_WRITE_TOOLS.includes(t.name)).every((t) => t.annotations?.readOnlyHint === false), "shortlist tools declare that they write");

  const uris = [...new Set(tools.map((t) => (t._meta as any)?.ui?.resourceUri).filter(Boolean))] as string[];
  check(uris.length === 1, `one widget resource referenced by tools (${uris.join(", ")})`);
  const res = await client.readResource({ uri: uris[0] ?? "ui://savoir/missing" });
  const item = res.contents[0] as { mimeType?: string; text?: string };
  check(item?.mimeType === "text/html;profile=mcp-app" && (item.text?.length ?? 0) > 1000, "widget resource served (text/html;profile=mcp-app)");

  const call = async (name: string, args: Record<string, unknown>) => (await client.callTool({ name, arguments: args })) as Result;

  const search = await call("search_properties", { purpose: "buy", page_size: 3 });
  const items = (search.structuredContent?.items ?? []) as Array<{ slug: string; photo: string | null; url: string }>;
  check(search.structuredContent?.status === "ok" && items.length > 0, `search_properties returns listings (${items.length})`);
  check(items.every((i) => i.url.startsWith("https://savoirproperties.com/project/")), "listing URLs are canonical website links");
  const photo = items.find((i) => i.photo)?.photo;
  if (photo) {
    const img = await fetch(photo, { method: "GET" }).catch(() => null);
    check(img?.ok && img.headers.get("content-type")?.startsWith("image/"), `listing photo loads (${img?.status} ${img?.headers.get("content-type")})`);
  } else fail("no listing photo returned");

  if (items[0]) {
    const d = await call("get_property_details", { slug: items[0].slug });
    check(d.structuredContent?.status === "ok" && (d.structuredContent?.property?.photos?.length ?? 0) > 0, "get_property_details returns details with photos");
  }
  const nf = await call("get_property_details", { slug: "verify-nonexistent-listing-000" });
  check(nf.structuredContent?.status === "not_found" && !JSON.stringify(nf).match(/HomeController|htdocs|trace/), "unknown slug -> not_found without leaking CMS internals");
  const empty = await call("search_properties", { areas: ["Atlantis on Mars"] });
  check(empty.structuredContent?.status === "no_results" && !empty.isError, "unknown area -> honest no_results");
  const off = await call("search_offplan_projects", { page_size: 2 });
  check(off.structuredContent?.status === "ok", "search_offplan_projects works");
  const contact = await call("get_contact_options", {});
  check(contact.structuredContent?.contact?.online_inquiries_enabled === false, "contact options report inquiries disabled");

  await client.close();
}

main()
  .catch((e) => fail(`unexpected: ${e instanceof Error ? e.message : String(e)}`))
  .finally(() => {
    console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll required checks passed");
    process.exit(failures ? 1 : 0);
  });
