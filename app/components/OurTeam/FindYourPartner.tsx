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
    <section className="flex w-full flex-col items-start gap-[22px] lg:flex-row lg:items-start lg:gap-[24px]">
      <div className="hidden shrink-0 flex-col items-start gap-[14px] lg:flex lg:w-[348px] lg:pt-[18px]">
        <div className="flex flex-col items-start gap-[10px]">
          <h2 className="CormorantGaramond text-left text-[28px] leading-[1.05] text-[#111111] lg:text-[44px]">
            FIND YOUR
            <br />
            PARTNER
          </h2>

          <span className="block h-px w-[285px] bg-[linear-gradient(90deg,#C6A45A_0%,rgba(198,164,90,0)_100%)]" />
        </div>

        <p className="max-w-[320px] text-[14px] leading-[160%] text-[#111111] lg:text-[18px]">
          Our team is highly experienced and knowledgeable across all aspects of
          the real estate industry.
        </p>
      </div>

      <div className="relative w-full overflow-hidden lg:block">
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={4}
          centeredSlides={false}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          slidesOffsetBefore={0}
          slidesOffsetAfter={0}
          slideToClickedSlide
          className="!px-0 !py-0"
        >
          {teams.map((member: any, index: number) => (
            <SwiperSlide
              key={index}
              className="!w-[275px] cursor-grab select-none"
            >
              <TeamCard member={member} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-5 flex items-center justify-center gap-[20px] lg:gap-[26px]">
          <button
            type="button"
            className="cursor-pointer transition-all duration-300 hover:scale-[1.03] focus:outline-none"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous slide"
          >
            <img
              loading="lazy"
              src={icon.propertiesPrev}
              alt="Previous"
              className="h-auto w-[105px] lg:w-[145px]"
            />
          </button>

          <button
            type="button"
            className="cursor-pointer transition-all duration-300 hover:scale-[1.03] focus:outline-none"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next slide"
          >
            <img
              loading="lazy"
              src={icon.propertiesNext}
              alt="Next"
              className="h-auto w-[105px] lg:w-[145px]"
            />
          </button>
        </div>
      </div>
    </section>
  );
}