/**
 * Live customer-journey smoke test against a running server (read-only on the CMS;
 * creates/deletes one shortlist on that server). Paced for the shared CMS rate limit.
 *
 *   MCP_URL=http://127.0.0.1:8788/mcp npm run smoke:journey
 */
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const url = process.env.MCP_URL ?? "http://127.0.0.1:8787/mcp";
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
type R = { structuredContent?: Record<string, any>; content?: Array<{ text?: string }>; isError?: boolean };

async function main() {
  const c = new Client({ name: "savoir-journey-smoke", version: "1.0.0" });
  await c.connect(new StreamableHTTPClientTransport(new URL(url)));
  let failures = 0;
  const call = async (name: string, args: Record<string, unknown>) => {
    const r = (await c.callTool({ name, arguments: args })) as R;
    await pause(2500);
    return r;
  };
  const check = (ok: unknown, msg: string) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${msg}`);
    if (!ok) failures++;
  };

  console.log("1. Newcomer: where should I look? (buy, up to AED 3M, 2 bedrooms)");
  const guide = await call("get_area_guide", { purpose: "buy", budget_max_aed: 3_000_000, bedrooms: 2, limit: 5 });
  const areas = guide.structuredContent?.guide?.areas ?? [];
  console.log("     " + areas.map((a: any) => `${a.area} (${a.matching_listings}${a.tags.length ? ", " + a.tags.join("/") : ""})`).join("; "));
  check(areas.length > 0, "area guide returns areas with live counts");

  console.log("2. Guided search in the top area");
  const top = areas[0]?.area ?? "Dubai Marina";
  const s = await call("search_properties", { areas: [top], purpose: "buy", bedrooms: 2, max_price_aed: 3_000_000, page_size: 4 });
  const items = s.structuredContent?.items ?? [];
  check(s.structuredContent?.status === "ok" && items.length > 0, `search returns listings (${items.length}) as of ${s.structuredContent?.data_as_of}`);

  console.log("3. No exact match → labelled alternatives");
  const nr = await call("search_properties", { areas: ["Palm Jumeirah"], purpose: "rent", bedrooms: "studio", max_price_aed: 40_000 });
  console.log("     " + (nr.structuredContent?.alternatives ?? []).map((a: any) => `${a.description}: ${a.total_results}`).join(" | "));
  check(nr.structuredContent?.status === "no_results", "exact search reports no results (not an error)");

  console.log("4. Lifestyle need verified on listings (water view)");
  const mh = await call("search_properties", { areas: ["Dubai Marina"], purpose: "buy", must_have: ["water_view"], page_size: 3 });
  const checked = (mh.structuredContent?.items ?? []).filter((i: any) => i.amenity_check);
  console.log("     " + checked.map((i: any) => `${i.title.slice(0, 30)}: ${i.amenity_check.matched.length ? "has water view" : "not listed"}`).join(" | "));
  check(checked.length > 0 && /cannot search by amenity/.test(mh.structuredContent?.amenity_note ?? ""), "amenities checked per listing and labelled as not a filter");

  console.log("5. Compare the first two listings against the stated needs");
  const two = items.slice(0, 2).map((i: any) => ({ kind: "property", slug: i.slug }));
  if (two.length === 2) {
    const cmp = await call("compare_listings", { items: two, requirements: { purpose: "buy", budget_max_aed: 3_000_000, bedrooms: 2 } });
    for (const it of cmp.structuredContent?.items ?? []) console.log(`     ${it.property?.title?.slice(0, 32)} · ${it.property?.price_label} · ${it.property?.price_per_sqft_aed ?? "n/a"} AED/sqft · ${it.suitability?.summary}`);
    check(cmp.structuredContent?.status === "ok", "comparison ready");
  }

  console.log("6. Shortlist, share link, then clean up");
  const sl = await call("update_shortlist", { add: two.slice(0, 1) });
  const id = sl.structuredContent?.shortlist?.shortlist_id;
  check(!!id, "shortlist created with an unguessable id");
  const sh = await call("share_shortlist", { shortlist_id: id });
  const shareUrl = sh.structuredContent?.shortlist?.share_url;
  if (shareUrl) {
    const page = await fetch(shareUrl);
    check(page.status === 200 && page.headers.get("x-robots-tag") === "noindex, nofollow", `share page served (${new URL(shareUrl).pathname.slice(0, 6)}…)`);
  }

  console.log("7. Contact handoff (nothing is sent)");
  const ho = await call("prepare_inquiry", { listings: two.slice(0, 1), requirements: { purpose: "buy", budget_max_aed: 3_000_000, bedrooms: 2 }, viewing_preference: "Saturday morning" });
  const h = ho.structuredContent?.handoff;
  console.log("     " + (h?.message ?? "").split("\n").slice(0, 6).join(" ⏎ "));
  check(h && /^SAV-/.test(h.reference_code) && h.live_submission_available === false, "message prepared with reference code; live submission disabled");

  console.log("8. Off-plan within budget + payment schedule from a quoted unit price");
  const op = await call("search_offplan_projects", { max_starting_price_aed: 1_500_000, page_size: 3 });
  const proj = op.structuredContent?.items?.[0];
  console.log("     " + (op.structuredContent?.items ?? []).map((p: any) => `${p.title} from ${p.starting_price_label}`).join(" | "));
  if (proj) {
    const d = await call("get_offplan_project_details", { slug: proj.slug, unit_price_aed: 1_500_000 });
    const sch = d.structuredContent?.payment_schedule;
    console.log("     " + (sch ? sch.stages.map((x: any) => `${x.label} ${x.percent}% = AED ${x.amount_aed.toLocaleString("en-US")}`).join(" · ") : d.structuredContent?.payment_schedule_note));
    check(d.structuredContent?.status === "ok", "off-plan detail with schedule (or an honest reason)");
  }

  if (id) {
    const del = await call("delete_shortlist", { shortlist_id: id });
    check(del.structuredContent?.deleted === true, "shortlist deleted");
    if (shareUrl) check((await fetch(shareUrl)).status === 404, "share link stops working after delete");
  }
  await c.close();
  console.log(failures ? `\n${failures} check(s) FAILED` : "\nJourney smoke passed");
  process.exit(failures ? 1 : 0);
}
main().catch((e) => {
  console.error("journey smoke failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
