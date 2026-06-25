import React from "react";
import { useLoaderData } from "react-router";
import { SwiperSlide } from "swiper/react";
import { getNewsPage } from "~/api/news.service";
import NewsBody from "~/components/News/NewsBody";
import NewsCard from "~/components/News/NewsCard";
import NewsPageHero from "~/components/News/NewsPageHero";
import NewsShare from "~/components/News/NewsShare";
import useIcons from "~/hooks/imageHooks/useIcons";
import PageLayout from "~/layouts/PageLayout";
import ThreeSwiper from "~/UI/ThreeSwiper";

export async function clientLoader({ params }: { params: { newsSlug: string } }) {
  const newsSlug = params.newsSlug;
  try {
    const res: any = await getNewsPage(newsSlug);

    const newsItem = res.news_item;
    const news = res.suggested_news;

    return { newsItem, news };
  } catch (error) {
    return { newsItem: [], news: [] };
  }
}

export default function newsPage() {
  const icon = useIcons();
  const { news } = useLoaderData() as { news: any };

  return (
    <div className="relative overflow-y-hidden">
      <img loading="lazy" src={icon.vLetter} alt="" className="absolute left-0 top-[30%] z-[-1]" />

      <NewsPageHero />
      <PageLayout>
        <div className="flex flex-col lg:flex-row items-start gap-[33px] w-full">
          <NewsShare />
          <NewsBody />
        </div>
        <div className="flex flex-col items-start gap-[37px] w-full mt-[75px]">
          <p className="text-black text-[31px] font-medium">You might also be interested in...</p>
          <ThreeSwiper>
            {news.map((newsItem: any, index: number) => (
              <SwiperSlide key={newsItem.id || index}>
                <NewsCard newsItem={newsItem} />
              </SwiperSlide>
            ))}
          </ThreeSwiper>
        </div>
      </PageLayout>
    </div>
  );
}
