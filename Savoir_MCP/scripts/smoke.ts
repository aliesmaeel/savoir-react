/**
 * Read-only smoke test against a running server (default http://127.0.0.1:8787/mcp).
 * Makes a handful of CMS reads; never calls submit_property_inquiry with confirm=true.
 *
 *   npm run smoke                 # server must already be running
 *   MCP_URL=https://mcp.example.com/mcp npm run smoke
 */
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const url = process.env.MCP_URL ?? "http://127.0.0.1:8787/mcp";

type Result = { structuredContent?: Record<string, unknown>; content?: Array<{ type: string; text?: string }>; isError?: boolean };

async function main() {
  const client = new Client({ name: "savoir-smoke", version: "1.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL(url)));

  const tools = await client.listTools();
  console.log("tools:", tools.tools.map((t) => `${t.name}${t.annotations?.readOnlyHint ? " (read-only)" : " (WRITE)"}`).join(", "));

  const resources = await client.listResources();
  console.log("resources:", resources.resources.map((r) => `${r.uri} [${r.mimeType}]`).join(", "));

  const call = async (name: string, args: Record<string, unknown>) => {
    const r = (await client.callTool({ name, arguments: args })) as Result;
    const sc = r.structuredContent ?? {};
    const first = r.content?.find((c) => c.type === "text")?.text ?? "";
    console.log(`\n== ${name} ${JSON.stringify(args)}\nstatus=${String(sc.status)} isError=${Boolean(r.isError)}\n${first.split("\n").slice(0, 8).join("\n")}`);
    return sc;
  };

  const s = await call("search_properties", { areas: ["Dubai Marina"], purpose: "buy", page_size: 3 });
  await call("search_properties", { bedrooms: "studio", purpose: "rent", page_size: 2, sort: "price_low_to_high" });
  await call("search_properties", { areas: ["Atlantis on Mars"] });
  const items = (s.items as Array<{ slug: string }> | undefined) ?? [];
  if (items[0]) await call("get_property_details", { slug: items[0].slug });
  await call("get_property_details", { slug: "this-listing-does-not-exist-123" });
  const o = await call("search_offplan_projects", { developers: ["Sobha"], page_size: 3 });
  const oi = (o.items as Array<{ slug: string }> | undefined) ?? [];
  if (oi[0]) await call("get_offplan_project_details", { slug: oi[0].slug });
  await call("search_offplan_projects", { handover: "Q2 2028" });
  await call("get_contact_options", {});

  await client.close();
}

main().catch((err) => {
  console.error("smoke failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
