import { createSitemapIndexResponse } from "~/seo/sitemap.server";

export function loader() {
  return createSitemapIndexResponse();
}
