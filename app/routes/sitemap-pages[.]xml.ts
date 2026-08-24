import { createPagesSitemapResponse } from "~/seo/sitemap.server";

export function loader() {
  return createPagesSitemapResponse();
}
