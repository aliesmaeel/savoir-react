import React, { useState } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import useArrow from "~/hooks/imageHooks/useArrow";

import "swiper/css";
import "swiper/css/navigation";
import { Link, useLoaderData } from "react-router";

export default function OffPlanProjectsSwiper() {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const arrow = useArrow();
  const { home } = useLoaderData() as { home: any };

  return (
    <div
      className={`w-full transition-colors duration-200 ${
        isGrabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <Swiper
        slidesPerView="auto"
        centeredSlides
        loop
        spaceBetween={-60} // overlap
        slidesOffsetBefore={8}
        slidesOffsetAfter={8}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        className="
    w-full
    [&_.swiper-wrapper]:overflow-visible
    [&_.swiper-slide]:transition-[transform,opacity] [&_.swiper-slide]:duration-300
    [&_.swiper-slide-active]:z-30            /* 💡 center on top */
    [&_.swiper-slide-next]:z-10              /* both sides below */
    [&_.swiper-slide-prev]:z-10
  "
        onTouchStart={() => setIsGrabbing(true)}
        onTouchEnd={() => setIsGrabbing(false)}
        onSliderFirstMove={() => setIsGrabbing(true)}
        onTransitionEnd={() => setIsGrabbing(false)}
      >
        {home.offplan_projects.map((item: any) => (
          <SwiperSlide key={item.id} className="!w-[76.5%]">
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
    <div
      className={`relative flex flex-col gap-[12px] transition-all duration-300
      ${isActive ? "scale-100 opacity-100" : "scale-[0.85] opacity-80"}`}
    >
      <div className="relative overflow-hidden rounded-[8px] lg:rounded-[15px] shadow-lg">
        <img loading="lazy" src={item.image} className="w-full aspect-[549/413] object-cover" />
        <Link
          to={`/off-plan/${item.link}`}
          className="absolute bottom-0 left-0 w-full py-[8px] lg:py-[15px] bg-[#6c645a] flex items-center justify-center gap-[6px] lg:gap-[15px]"
        >
          <p className="text-[#C6A45A] text-[14px] lg:text-[20px]">{item.title}</p>
          <img
            loading="lazy"
            src={useArrow().veryLongGold}
            alt=""
            className="w-[35px] lg:w-[50px] mt-[-5px]"
          />
        </Link>
      </div>
    </div>
  );
}
