import React from "react";
import { SwiperSlide } from "swiper/react";
import NewsBody from "~/components/News/NewsBody";
import NewsCard from "~/components/News/NewsCard";
import NewsPageHero from "~/components/News/NewsPageHero";
import NewsShare from "~/components/News/NewsShare";
import useIcons from "~/hooks/imageHooks/useIcons";
import PageLayout from "~/layouts/PageLayout";
import ThreeSwiper from "~/UI/ThreeSwiper";

export default function newsPage() {
  const icon = useIcons();

  return (
    <div className="relative overflow-y-hidden">
      <img src={icon.vLetter} alt="" className="absolute left-0 top-[30%] z-[-1]" />

      <NewsPageHero />
      <PageLayout>
        <div className="flex flex-col lg:flex-row items-start gap-[33px] w-full">
          <NewsShare />
          <NewsBody />
        </div>
        <div className="flex flex-col items-start gap-[37px] w-full mt-[75px]">
          <p className="text-black text-[31px] font-medium">You might also be interested in...</p>
          <ThreeSwiper>
            <SwiperSlide>
              <NewsCard />
            </SwiperSlide>
            <SwiperSlide>
              <NewsCard />
            </SwiperSlide>
            <SwiperSlide>
              <NewsCard />
            </SwiperSlide>
            <SwiperSlide>
              <NewsCard />
            </SwiperSlide>
          </ThreeSwiper>
        </div>
      </PageLayout>
    </div>
  );
}
