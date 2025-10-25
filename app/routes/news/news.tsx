import React from "react";
import { useLoaderData } from "react-router";
import { getAllNews } from "~/api/news.service";
import NewsAbout from "~/components/News/NewsAbout";
import NewsCard from "~/components/News/NewsCard";
import NewsHero from "~/components/News/NewsHero";
import PageLayout from "~/layouts/PageLayout";

export async function clientLoader({ request }: { request: Request }) {
  try {
    const res: any = await getAllNews();

    const news = res.data;

    return { news };
  } catch (error) {
    return { news: [] };
  }
}

export default function news() {
  const { news } = useLoaderData() as { news: any };

  return (
    <div className="relative">
      <NewsHero />
      <PageLayout>
        {/* <NewsAbout /> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] w-full ">
          {news.map((newsItem: any) => (
            <NewsCard newsItem={newsItem} />
          ))}
        </div>
      </PageLayout>
    </div>
  );
}
