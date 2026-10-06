/**
 * Validate submission/plugin.json + mcp.json against OpenAI's documented limits
 * and, only if everything passes, write submission/dist/savoir-properties-plugin.zip.
 * This never uploads or submits anything.
 *
 *   npm run submission:check                 # validate only
 *   npm run submission:check -- --check-urls # also fetch the listing URLs
 *   npm run submission:build                 # validate + zip
 */
import { deflateRawSync } from "node:zlib";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "submission";
const args = new Set(process.argv.slice(2));
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);

const TOOLS = new Set(["search_properties", "get_property_details", "search_offplan_projects", "get_offplan_project_details", "get_contact_options"]);

const plugin = JSON.parse(readFileSync(join(DIR, "plugin.json"), "utf8"));
const mcp = JSON.parse(readFileSync(join(DIR, "mcp.json"), "utf8"));
const oa = plugin?.extensions?.["com.openai"] ?? {};
const ui = oa.interface ?? {};
const review = oa.review ?? {};

// Unresolved placeholders anywhere.
const walk = (v, path) => {
  if (typeof v === "string" && /\bTODO\b/.test(v)) err(`${path}: unresolved — ${v}`);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k);
};
walk(plugin, "plugin.json");

const limit = (name, value, max, required = true) => {
  if (value === undefined || value === "") return required && err(`interface.${name} is required`);
  if (typeof value !== "string") return err(`interface.${name} must be a string`);
  if (value.length > max) err(`interface.${name} is ${value.length} chars (max ${max})`);
};
limit("displayName", ui.displayName, 30);
limit("shortDescription", ui.shortDescription, 30);
limit("longDescription", ui.longDescription, 4000);
limit("developerName", ui.developerName, 80);
limit("category", ui.category, 80);
if (/plugin/i.test(ui.displayName ?? "")) err('displayName must not contain "Plugin"');

const prompts = ui.defaultPrompt ?? [];
if (!Array.isArray(prompts) || prompts.length > 3) err("defaultPrompt: up to 3 prompts");
prompts.forEach((p, i) => p.length > 128 && err(`defaultPrompt[${i}] is ${p.length} chars (max 128)`));

const urls = ["websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"];
for (const k of urls) {
  const v = ui[k];
  if (/\bTODO\b/.test(String(v))) continue; // already reported as unresolved
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" || u.username || u.password) err(`${k} must be https without credentials`);
    if (v.length > 1024) err(`${k} too long`);
  } catch {
    if (!/\bTODO\b/.test(String(v))) err(`${k} is not a valid URL`);
  }
}

// Logo: square PNG, 48..4096 px, <= 5 MiB.
const logoPath = join(DIR, String(ui.logo ?? "").replace(/^\.\//, ""));
if (!ui.logo) err("interface.logo is required");
else if (!existsSync(logoPath)) err(`logo file missing: ${logoPath} (square PNG, >= 48x48; 512x512 recommended)`);
else {
  const buf = readFileSync(logoPath);
  if (statSync(logoPath).size > 5 * 1024 * 1024) err("logo exceeds 5 MiB");
  if (buf.subarray(1, 4).toString() === "PNG") {
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    if (w !== h) err(`logo must be square (got ${w}x${h})`);
    if (w < 48 || w > 4096) err(`logo size ${w}px outside 48..4096`);
    if (w < 256) warnings.push(`logo is ${w}px; 512px recommended for crisp display`);
  } else warnings.push("logo is not PNG; only PNG dimensions are checked by this script");
}

// Test cases: exactly 5 positive, 3 negative.
const pos = review.test_cases?.positive ?? [];
const neg = review.test_cases?.negative ?? [];
if (pos.length !== 5) err(`need exactly 5 positive test cases (have ${pos.length})`);
if (neg.length !== 3) err(`need exactly 3 negative test cases (have ${neg.length})`);
pos.forEach((t, i) => {
  for (const f of ["description", "prompt", "tools_triggered", "expected_behavior"]) if (!t[f]) err(`positive[${i}].${f} is required`);
  if (typeof t.tools_triggered === "string")
    for (const name of t.tools_triggered.split(",").map((s) => s.trim())) if (!TOOLS.has(name)) err(`positive[${i}] names unknown tool "${name}"`);
  if ((t.description ?? "").length > 4000) err(`positive[${i}].description too long`);
});
neg.forEach((t, i) => ["description", "prompt"].forEach((f) => !t[f] && err(`negative[${i}].${f} is required`)));
if (!review.demo_recording_url) err("review.demo_recording_url is required");
if (typeof review.commerce !== "boolean") err("review.commerce must be true/false");

const server = Object.values(mcp.mcpServers ?? {})[0];
if (!server || server.type !== "streamable-http" || !/^https:\/\/[^/]+\/mcp$/.test(server.url ?? "")) err("mcp.json must declare one streamable-http server at https://<host>/mcp");

if (args.has("--check-urls")) {
  for (const k of urls) {
    if (!/^https:/.test(ui[k] ?? "")) continue;
    const r = await fetch(ui[k], { redirect: "follow" }).catch(() => null);
    if (!r?.ok) err(`${k} ${ui[k]} -> ${r?.status ?? "unreachable"}`);
  }
  const h = await fetch(server.url.replace(/\/mcp$/, "/health")).catch(() => null);
  if (!h?.ok) err(`MCP server health ${server.url.replace(/\/mcp$/, "/health")} -> ${h?.status ?? "unreachable"}`);
}

for (const w of warnings) console.log(`warn: ${w}`);
if (errors.length) {
  console.log(`\nSubmission package NOT ready (${errors.length} issue(s)):`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}
console.log("Submission metadata valid.");

if (args.has("--zip")) {
  const files = [
    ["plugin.json", readFileSync(join(DIR, "plugin.json"))],
    ["mcp.json", readFileSync(join(DIR, "mcp.json"))],
    [ui.logo.replace(/^\.\//, ""), readFileSync(logoPath)],
  ];
  mkdirSync(join(DIR, "dist"), { recursive: true });
  const out = join(DIR, "dist", "savoir-properties-plugin.zip");
  writeFileSync(out, zip(files));
  console.log(`wrote ${out} (not submitted)`);
}

// Minimal ZIP writer (deflate), enough for a handful of files.
function zip(entries) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (b) => {
    let c = 0xffffffff;
    for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const locals = [], centrals = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const comp = deflateRawSync(data);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(comp.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(nameBuf.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(8, 10);
    central.writeUInt32LE(crc, 16); central.writeUInt32LE(comp.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, nameBuf, comp);
    centrals.push(central, nameBuf);
    offset += 30 + nameBuf.length + comp.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}
