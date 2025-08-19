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

export default function PropertiesSwiper() {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const icon = useIcons();
  return (
    <div className="w-full">
      <Swiper
        slidesPerView={1}
        loop={true}
        spaceBetween={30}
        modules={[Navigation]}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        className="w-full h-full"
      >
        <SwiperSlide>
          <div className="flex flex-col items-start gap-[29px] w-full">
            <div className="flex flex-col items-start w-full">
              <div className="flex items-center justify-between w-full py-[23px]">
                <p className="text-[#353635] text-[26px] Jakarta font-bold">$ 450,000</p>
                <div
                  className="px-[11.8px] py-[5px] rounded-[10px] h-[33px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #C6A45A 0.02%, rgba(255, 255, 255, 0.00) 180.22%)",
                  }}
                >
                  <p className="Text-[#353635] text-[17px] Jakarta font-bold leading-[22px]">
                    For SALE
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-[5px] Jakarta text-[20px] font-medium">
                  <p>4 beds</p>
                  <div className="w-[5px] h-[5px] bg-[#353635] rounded-full" />
                  <p>1 baths</p>
                  <div className="w-[5px] h-[5px] bg-[#353635] rounded-full" />
                  <p>1931 sqft</p>
                  <div className="w-[5px] h-[5px] bg-[#353635] rounded-full" />
                  <p>Eco-friendly</p>
                </div>
                <div className="flex items-center gap-[8px]">
                  <img src={icon.Clock} alt="" className="w-[23px]" />
                  <p className="text-[20px] font-medium Jakarta">2years ago</p>
                </div>
              </div>
            </div>
            <img
              src="/images/placeholders/properties.png"
              alt=""
              className="w-full aspect-[618/398] rounded-[18px] object-cover"
            />
            <Link
              to="#"
              className="text-[#C6A45A] text-[23px] font-medium leading-[35px] underline"
            >
              Luxury 4-Bedroom | Sea and Park Views in Blue Waters
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col items-start gap-[29px] w-full">
            <div className="flex flex-col items-start w-full">
              <div className="flex items-center justify-between w-full py-[23px]">
                <p className="text-[#353635] text-[26px] Jakarta font-bold">$ 450,000</p>
                <div
                  className="px-[11.8px] py-[5px] rounded-[10px] h-[33px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #C6A45A 0.02%, rgba(255, 255, 255, 0.00) 180.22%)",
                  }}
                >
                  <p className="Text-[#353635] text-[17px] Jakarta font-bold leading-[22px]">
                    For SALE
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-[5px] Jakarta text-[20px] font-medium">
                  <p>4 beds</p>
                  <div className="w-[5px] h-[5px] bg-[#353635] rounded-full" />
                  <p>1 baths</p>
                  <div className="w-[5px] h-[5px] bg-[#353635] rounded-full" />
                  <p>1931 sqft</p>
                  <div className="w-[5px] h-[5px] bg-[#353635] rounded-full" />
                  <p>Eco-friendly</p>
                </div>
                <div className="flex items-center gap-[8px]">
                  <img src={icon.Clock} alt="" className="w-[23px]" />
                  <p className="text-[20px] font-medium Jakarta">2years ago</p>
                </div>
              </div>
            </div>
            <img
              src="/images/placeholders/properties.png"
              alt=""
              className="w-full aspect-[618/398] rounded-[18px] object-cover"
            />
            <Link
              to="#"
              className="text-[#C6A45A] text-[23px] font-medium leading-[35px] underline"
            >
              Luxury 4-Bedroom | Sea and Park Views in Blue Waters
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="flex items-center justify-center gap-[44px] w-full mt-6">
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
