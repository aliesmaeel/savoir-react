import React, { useState } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { Link, useLoaderData } from "react-router";

export default function NewsInsightsSwiper() {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const { home } = useLoaderData() as { home: any };

  const insights = home?.insights || [];

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div
      className={`w-full transition-colors duration-200 ${
        isGrabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <Swiper
        slidesPerView="auto"
        centeredSlides
        loop={insights.length > 1}
        spaceBetween={1}
        slidesOffsetBefore={8}
        slidesOffsetAfter={8}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 5000, // 5 sec
          disableOnInteraction: false, // keeps autoplay after drag
          pauseOnMouseEnter: true, // 👈 pause autoplay on hover
        }}
        className="w-full"
        onTouchStart={() => setIsGrabbing(true)}
        onTouchEnd={() => setIsGrabbing(false)}
        onSliderFirstMove={() => setIsGrabbing(true)}
        onTransitionEnd={() => setIsGrabbing(false)}
      >
        {insights.map((item: any) => (
          <SwiperSlide key={item.id || item.slug} className="!w-[88%] md:!w-[82%] lg:!w-[72%] xl:!w-[66%]">
            <SlideCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function SlideCard({ item }: { item: any }) {
  const { isActive } = useSwiperSlide();

  return (
    <Link
      to={`/news/${item.slug}`}
      className={[
        "transition-all duration-300 ease-out flex flex-col items-start gap-[8px] lg:gap-[12px]",
        isActive ? "scale-100 opacity-100" : "scale-[0.85]",
      ].join(" ")}
    >
      <div className="relative w-full">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="w-full aspect-[396/330] rounded-[16px] object-cover"
        />
      </div>

      <p className="text-[#353635] text-[10px] lg:text-[15px] max-w-[353px] leading-[170%] ml-[10px]">
        {item.title}
      </p>
    </Link>
  );
}
