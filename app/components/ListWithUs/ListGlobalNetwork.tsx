import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import GoldTitle from "~/UI/GoldTitle";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function ListGlobalNetwork() {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const icon = useIcons();

  const images = [
    "/images/listwithus/1.jpg",
    "/images/listwithus/2.jpg",
    "/images/listwithus/3.jpg",
  
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center gap-[52px] w-full mt-[108px]">
      <div className="flex flex-col items-start gap-[37px] w-full">
        <GoldTitle>A Global Network, A Local Touch</GoldTitle>
        <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
          Within the LeadingRE umbrella, a diverse set of sub-companies and affiliates work together
          to shape the future of real estate. These organizations offer a wide range of services,
          including luxury real estate, commercial property, and worldwide relocation services. Each
          sub-company contributes a distinct thread to this exceptional tapestry of aggregate
          expertise, strengthening LeadingRE's position as a holistic resource for both real estate
          professionals and clients.
        </p>
      </div>
      <div className="w-[576px]">
        <Swiper
          slidesPerView={1}
          loop={images.length > 1}
          spaceBetween={0}
          modules={[Navigation]}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          className="w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                loading="lazy"
                src={image}
                alt=""
                className="w-full aspect-[576/336] object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-[44px] w-full mt-6">
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
        )}
      </div>
    </div>
  );
}
