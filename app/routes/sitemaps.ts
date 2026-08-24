import {
  createContentSitemapResponse,
  isSitemapType,
} from "~/seo/sitemap.server";

export function loader({ params }: { params: { type?: string; page?: string } }) {
  if (!isSitemapType(params.type)) {
    return new Response("Sitemap not found.", { status: 404 });
  }

  const page = Number(params.page);
  return createContentSitemapResponse(params.type, page);
}
