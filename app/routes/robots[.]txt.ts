import { buildCanonicalUrl } from "~/seo/canonical";

const PRIVATE_ROUTE_RULES = [
  "Disallow: /admin/",
  "Disallow: /api/",
  "Disallow: /auth/",
  "Disallow: /dashboard/",
  "Disallow: /ai-tool",
] as const;

export function loader() {
  const rules = [
    "User-agent: *",
    "Allow: /",
    ...PRIVATE_ROUTE_RULES,
    "",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    ...PRIVATE_ROUTE_RULES,
    "",
    `Sitemap: ${buildCanonicalUrl("/sitemap.xml")}`,
    "",
  ];

  return new Response(rules.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
