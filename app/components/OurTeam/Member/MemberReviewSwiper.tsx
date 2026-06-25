import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
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
          className={`w-full max-w-[1150px] mx-auto transition-colors duration-200 ${
            isGrabbing ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <Swiper
            slidesPerView="auto"
            centeredSlides={false}
            loop={enableLoop}
            spaceBetween={28}
            slidesOffsetBefore={8}
            slidesOffsetAfter={8}
            modules={[Navigation, Autoplay]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="
              w-full
              [&_.swiper-wrapper]:overflow-visible
              [&_.swiper-slide]:transition-[transform,opacity]
              [&_.swiper-slide]:duration-300
              [&_.swiper-slide-active]:z-30
              [&_.swiper-slide-next]:z-10
              [&_.swiper-slide-prev]:z-10
            "
            onTouchStart={() => setIsGrabbing(true)}
            onTouchEnd={() => setIsGrabbing(false)}
            onSliderFirstMove={() => setIsGrabbing(true)}
            onTransitionEnd={() => setIsGrabbing(false)}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className="!w-[31.5%]">
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
  const rating = typeof data.rating === "number" ? Math.round(data.rating) : 5;

  return (
    <div
      className={`
        relative flex h-[365px] w-full flex-col justify-between
        rounded-[12px]
        border border-[#E7DCC8]
        bg-white
        px-[30px]
        py-[32px]
        shadow-[0_16px_45px_rgba(17,17,17,0.06)]
        transition-all
        duration-300
        ${isActive ? "scale-100 opacity-100" : "scale-[0.98] opacity-95"}
      `}
    >
      <div className="flex h-[215px] w-full flex-col items-start">
        <p className="mb-[24px] h-[22px] text-[42px] font-semibold leading-none text-[#C6A45A]">
          “
        </p>

        <p className="line-clamp-6 max-w-[330px] text-left text-[20px] italic leading-[1.48] text-[#3F3F3F]">
          “{data.text}”
        </p>
      </div>

      <div className="flex min-h-[64px] w-full items-center gap-[14px]">
        {data.avatar ? (
          <img
            loading="lazy"
            src={data.avatar}
            alt={data.author}
            className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#6AA43A] text-[24px] font-semibold text-white">
            {data.author?.charAt(0) || "U"}
          </div>
        )}

        <div className="flex min-w-0 flex-col items-start">
          <p className="line-clamp-1 text-[15px] font-semibold leading-[1.2] text-[#111111]">
            {data.author}
          </p>

          <p className="line-clamp-1 text-[13px] leading-[1.35] text-[#555555]">
            {data.role}
          </p>

          <div className="mt-[7px] flex items-center gap-[3px]">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`text-[13px] leading-none ${
                  index < rating ? "text-[#C6A45A]" : "text-[#D8D8D8]"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}