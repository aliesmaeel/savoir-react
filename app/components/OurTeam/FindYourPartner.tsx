// FindYourPartner.tsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import TeamCard from "./TeamCard";
import useIcons from "~/hooks/imageHooks/useIcons";
import { useLoaderData } from "react-router";

export default function FindYourPartner() {
  const { teams } = useLoaderData() as { teams: any };
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const icon = useIcons();

  return (
    <section className="flex flex-col lg:flex-row items-center gap-[33px] w-full">
      <div className="flex flex-col items-start gap-[15px] lg:w-[447px] shrink-0">
        <p className="text-black text-[20px] lg:text-[52px] font-medium">FIND YOUR PARTNER</p>
        <p className="text-[15px] lg:text-[37px] leading-[170%]">
          Our team is highly experienced and knowledgeable across all aspects of the real estate
          industry
        </p>
      </div>

      <div
        className="
         hidden lg:block
          relative w-full
          [&_.swiper]:!overflow-hidden
          [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-500 [&_.swiper-slide]:will-change-transform
          [&_.swiper-slide]:z-0 [&_.swiper-slide]:opacity-60 [&_.swiper-slide]:scale-95
          /* LEFT — focused (active) */
          [&_.swiper-slide-active]:z-30 [&_.swiper-slide-active]:opacity-100 [&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active]:translate-x-0
          /* MIDDLE — directly after active (behind + slightly smaller + shifted left) */
          [&_.swiper-slide-active+_.swiper-slide]:z-20 [&_.swiper-slide-active+_.swiper-slide]:opacity-80
          [&_.swiper-slide-active+_.swiper-slide]:scale-95 [&_.swiper-slide-active+_.swiper-slide]:-translate-x-8
          /* THIRD — two after active (further behind + smaller + more left) */
          [&_.swiper-slide-active+_.swiper-slide+_.swiper-slide]:z-10 [&_.swiper-slide-active+_.swiper-slide+_.swiper-slide]:opacity-70
          [&_.swiper-slide-active+_.swiper-slide+_.swiper-slide]:scale-90 [&_.swiper-slide-active+_.swiper-slide+_.swiper-slide]:-translate-x-16
        "
      >
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3} // always 3
          centeredSlides={false} // active is LEFT
          loop={true}
          autoplay={{
            delay: 5000, // ⏱ autoplay every 5 seconds
            disableOnInteraction: false, // keeps autoplay running even after user interacts
          }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          slidesOffsetBefore={0} // ensure far-left alignment
          slidesOffsetAfter={0}
          slideToClickedSlide
          className="!px-0 !py-0" // remove padding that was pushing slides in
        >
          {teams.map((member: any, index: number) => (
            <SwiperSlide key={index} className="cursor-grab select-none">
              <TeamCard member={member} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex items-center justify-center gap-[44px] mt-6">
          <button
            type="button"
            className="cursor-pointer focus:outline-none"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous slide"
          >
            <img loading="lazy" src={icon.propertiesPrev} alt="Previous" />
          </button>
          <button
            type="button"
            className="cursor-pointer focus:outline-none"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next slide"
          >
            <img loading="lazy" src={icon.propertiesNext} alt="Next" />
          </button>
        </div>
      </div>

    </section>
  );
}
