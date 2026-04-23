import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import useIcons from "~/hooks/imageHooks/useIcons";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";
import ThreeSwiper from "~/UI/ThreeSwiper";
import { useLoaderData } from "react-router";

type TestimonialApi = {
  id: number;
  name: string;
  position: string;
  image: string;
  message: string;
  rating?: number;
};

type ReviewSlide = {
  id: number;
  text: string;
  author: string;
  role: string;
  avatar: string;
  rating?: number;
};

export default function MemberReviewSwiper() {
  const { testimonials = [] } = useLoaderData() as { testimonials?: TestimonialApi[] };
  const [isGrabbing, setIsGrabbing] = useState(false);
  const isMobile = useIsMobile();

  const items: ReviewSlide[] = useMemo(
    () =>
      (testimonials ?? []).map((t) => ({
        id: t.id,
        text: t.message ?? "",
        author: t.name ?? "",
        role: t.position ?? "",
        avatar: t.image ?? "",
        rating: typeof t.rating === "number" ? t.rating : undefined,
      })),
    [testimonials]
  );

  const enableLoop = items.length > 2;

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden lg:flex flex-col items-center gap-[37px] w-full mt-[112px]">
        <p className="text-black text-[42px] font-medium">The Reviews</p>
        <div
          className={`w-full transition-colors duration-200  max-w-[1150px] mx-auto ${
            isGrabbing ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <Swiper
            slidesPerView="auto"
            centeredSlides
            loop={enableLoop}
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
            {items.map((item) => (
              <SwiperSlide key={item.id} className="!w-[45%]">
                <SlideCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {isMobile && (
        <div className="flex flex-col items-center gap-[37px] w-full mt-[112px]">
          <p className="text-black text-[42px] font-medium">The Reviews</p>

          <ThreeSwiper>
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <SlideCard data={item} />
              </SwiperSlide>
            ))}
          </ThreeSwiper>
        </div>
      )}
    </>
  );
}

function SlideCard({ data }: { data: ReviewSlide }) {
  const { isActive } = useSwiperSlide();
  const icon = useIcons();

  return (
    <div
      className={`relative flex flex-col gap-[12px] transition-all duration-300 lg:aspect-[517/453] backdrop-blur-[60px] rounded-[44px] px-[39px] py-[29px]
      ${isActive ? "scale-100 opacity-100" : "scale-[0.85] opacity-80"}`}
      style={{
        background:
          "linear-gradient(141deg, rgba(53, 54, 53, 0.05) 0.94%, rgba(255, 255, 255, 0.07) 102.98%)",
        boxShadow:
          "49.15px -49.15px 49.15px 0 rgba(53, 54, 53, 0.10) inset, -49.15px 49.15px 49.15px 0 rgba(255, 255, 255, 0.07) inset",
      }}
    >
      <div
        className={`flex flex-col items-start justify-between w-full h-full ${isActive ? "opacity-100" : "opacity-30"}`}
      >
        <div className="flex flex-col items-start gap-[18px]">
          {typeof data.rating === "number" ? (
            <div className="ml-[12px] flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-[#c6a45a] px-3 py-1 text-[10px] font-medium leading-[12px] text-white">
                {data.rating}
                <img loading="lazy" src={icon.startWhite} alt="" />
              </span>
            </div>
          ) : null}

          <div className="flex flex-col items-start gap-[6px]">
            <img loading="lazy" src={icon.quotes} alt="" />
            <p className="text-[#232222] text-[15px] leading-[156.667%] px-[7px]">{data.text}</p>
          </div>
          <hr className="w-[85%] border-2 border-[#3536354D] mx-auto" />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <img
            loading="lazy"
            src={data.avatar}
            alt={data.author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">{data.author}</p>
            <p className="text-sm text-gray-500">{data.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
