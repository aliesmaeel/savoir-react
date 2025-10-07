import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import useIcons from "~/hooks/imageHooks/useIcons";
import { Link } from "react-router";

type Props = {
  children: React.ReactNode;
  spaceBetween?: number;
};

export default function ThreeSwiper({ children, spaceBetween = 30 }: Props) {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const icon = useIcons();
  return (
    <div className="w-full">
      <Swiper
        slidesPerView={3}
        loop={true}
        spaceBetween={spaceBetween}
        modules={[Navigation]}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        className="w-full h-full"
      >
        {children}
      </Swiper>

      <div className="flex items-center justify-between gap-[44px] w-full mt-6">
        <button
          type="button"
          className="cursor-pointer focus:outline-none"
          onClick={() => swiperInstance?.slidePrev()}
        >
          <img src={icon.propertiesPrev} alt="Previous" />
        </button>

        <button
          type="button"
          className="cursor-pointer focus:outline-none"
          onClick={() => swiperInstance?.slideNext()}
        >
          <img src={icon.propertiesNext} alt="Next" />
        </button>
      </div>
    </div>
  );
}
