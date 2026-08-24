export const PRODUCTION_ORIGIN = "https://savoirproperties.com";

export const PUBLIC_STATIC_PATHS = [
  "/",
  "/about-us",
  "/off-plan",
  "/news",
  "/our-team",
  "/contact-us",
  "/blogs",
  "/career",
  "/list-with-us",
  "/real-estate-advisory",
  "/property-management",
  "/interior-design-services",
  "/property-evaluation-services",
  "/mortgage-services",
  "/real-estate-guides",
  "/global-projects",
  "/savoirs-collection",
  "/privacy-policy",
] as const;

const PUBLIC_STATIC_PATH_SET = new Set<string>(PUBLIC_STATIC_PATHS);

const DYNAMIC_PUBLIC_PREFIXES = new Set([
  "/project",
  "/off-plan",
  "/news",
  "/our-team",
  "/blogs",
  "/popular-areas",
]);

export function normalizeSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const rawSlug = value.trim();
  if (!rawSlug || rawSlug.length > 240) return null;

  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch {
    return null;
  }

  if (
    !decodedSlug ||
    decodedSlug === "." ||
    decodedSlug === ".." ||
    /[\u0000-\u001f\u007f\s/\\?#]/u.test(decodedSlug)
  ) {
    return null;
  }

  return encodeURIComponent(decodedSlug);
}

export function buildCanonicalUrl(pathname: string): string {
  const withoutQueryOrHash = pathname.split(/[?#]/u, 1)[0] || "/";
  const withLeadingSlash = withoutQueryOrHash.startsWith("/")
    ? withoutQueryOrHash
    : `/${withoutQueryOrHash}`;
  const normalizedPath =
    withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/+$/u, "");

  return new URL(normalizedPath, PRODUCTION_ORIGIN).toString();
}

export function buildDynamicCanonicalUrl(prefix: string, slug: unknown): string | null {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug || !DYNAMIC_PUBLIC_PREFIXES.has(prefix)) return null;

  return buildCanonicalUrl(`${prefix}/${normalizedSlug}`);
}

export function getCanonicalUrlForPathname(pathname: string): string | null {
  const withoutQueryOrHash = pathname.split(/[?#]/u, 1)[0] || "/";
  const normalizedPath =
    withoutQueryOrHash === "/" ? "/" : withoutQueryOrHash.replace(/\/+$/u, "");

  if (PUBLIC_STATIC_PATH_SET.has(normalizedPath)) {
    return buildCanonicalUrl(normalizedPath);
  }

  const match = normalizedPath.match(/^\/(project|off-plan|news|our-team|blogs|popular-areas)\/([^/]+)$/u);
  if (!match) return null;

  return buildDynamicCanonicalUrl(`/${match[1]}`, match[2]);
}
