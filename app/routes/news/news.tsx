import React from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { getAllNews } from "~/api/news.service";
import NewsCard from "~/components/News/NewsCard";
import NewsHero from "~/components/News/NewsHero";
import PageLayout from "~/layouts/PageLayout";
import CustomPagination from "~/UI/CustomPagination";

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = 6;

  try {
    const res: any = await getAllNews(page, limit);
    const news = res.data ?? [];
    const p = res.pagination ?? {};

    // Prefer server-provided total_pages. Fallback to total/per_page.
    const totalPages =
      p.total_pages ??
      Math.max(1, Math.ceil((Number(p.total) || news.length) / (Number(p.per_page) || limit)));

    return {
      news,
      currentPage: Number(p.current_page) || page,
      totalPages,
    };
  } catch {
    return { news: [], currentPage: 1, totalPages: 1 };
  }
}

export default function News() {
  const { news, currentPage, totalPages } = useLoaderData() as {
    news: any[];
    currentPage: number;
    totalPages: number;
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (nextPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(nextPage));
    navigate(`${location.pathname}?${url.searchParams.toString()}`, {
      preventScrollReset: true,
    });
  };

  return (
    <div className="relative">
      <NewsHero />
      <PageLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] w-full">
          {news.map((newsItem: any, i: number) => (
            <NewsCard key={newsItem?.id ?? newsItem?._id ?? i} newsItem={newsItem} />
          ))}
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </PageLayout>
    </div>
  );
}
