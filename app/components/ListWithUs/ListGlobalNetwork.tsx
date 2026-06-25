import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";

export default function ListGlobalNetwork() {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const icon = useIcons();

  const images = [
    "/images/listwithus/1.jpg",
    "/images/listwithus/2.jpg",
    "/images/listwithus/3.jpg",
  ];

  return (
    <Card className="mt-[82px] mx-auto !max-w-[1080px] !rounded-[22px] border border-[#e9dfcf] px-[16px] py-[20px] shadow-[0_16px_42px_rgba(17,17,17,0.07)] lg:mt-[96px] lg:px-[30px] lg:py-[28px]">
      <div className="grid w-full grid-cols-1 items-start gap-[24px] lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-[34px]">
        <div className="flex w-full flex-col items-start justify-start gap-[22px] lg:gap-[26px]">
          <div
            className="flex w-full items-center border-l-[3px] border-[#111111] px-[14px] py-[12px] lg:px-[18px] lg:py-[15px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)",
            }}
          >
            <p
              className="CormorantGaramond text-[18px] leading-[1.12] lg:text-[28px]"
              style={{
                color: "#111111",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              A Global Network, A Local Touch
            </p>
          </div>

          <p
            className="max-w-[780px] text-[15px] leading-[1.82] lg:text-[17px]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            Within the LeadingRE umbrella, a diverse set of sub-companies and
            affiliates work together to shape the future of real estate.
            <br />
            These organizations offer a wide range of services, including luxury
            real estate, commercial property, and worldwide relocation services.
            <br />
            Each sub-company contributes a distinct thread to this exceptional
            tapestry of aggregate expertise, strengthening LeadingRE's position
            as a holistic resource for both real estate professionals and
            clients.
          </p>
        </div>

        <div className="w-full lg:w-[390px] lg:justify-self-end">
          <Swiper
            slidesPerView={1}
            loop={images.length > 1}
            spaceBetween={0}
            modules={[Navigation]}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            className="w-full overflow-hidden rounded-[20px] border border-[#efe6d8] bg-white p-[7px] shadow-[0_16px_36px_rgba(17,17,17,0.07)]"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  loading="lazy"
                  src={image}
                  alt=""
                  className="aspect-[576/360] w-full rounded-[16px] object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {images.length > 1 && (
            <div className="mt-[18px] flex w-full items-center justify-center gap-[58px]">
              <button
                type="button"
                className="flex h-[78px] w-[78px] cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.06] focus:outline-none lg:h-[86px] lg:w-[86px]"
                onClick={() => swiperInstance?.slidePrev()}
                aria-label="Previous slide"
              >
                <img
                  loading="lazy"
                  src={icon.propertiesPrev}
                  alt="Previous"
                  className="w-[74px] lg:w-[82px]"
                />
              </button>

              <button
                type="button"
                className="flex h-[78px] w-[78px] cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.06] focus:outline-none lg:h-[86px] lg:w-[86px]"
                onClick={() => swiperInstance?.slideNext()}
                aria-label="Next slide"
              >
                <img
                  loading="lazy"
                  src={icon.propertiesNext}
                  alt="Next"
                  className="w-[74px] lg:w-[82px]"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}