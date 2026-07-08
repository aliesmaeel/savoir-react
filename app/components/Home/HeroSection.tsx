import React from "react";
import SearchFilter from "~/layouts/Filter/SearchFilter";
import HeroSwiper from "./HeroSwiper";

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full">
      <HeroSwiper />

      <div className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center px-[16px] lg:px-[45px]">
        <div className="relative z-20 flex w-full flex-col items-center gap-[18px] lg:gap-[43.68px]">
          <div
            className="relative flex flex-col items-center gap-[12px]"
            data-aos="fade-down"
          >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[82px] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[28px] lg:h-[118px] lg:w-[112%] lg:blur-[42px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(17,17,17,0.34) 0%, rgba(17,17,17,0.18) 42%, rgba(17,17,17,0) 74%)",
              }}
            />

            <h1
              className="
                CormorantGaramond
                relative z-10
                text-center text-[26px] leading-[1.08] text-white
                lg:text-[51.04px]
              "
              style={{
                textShadow:
                  "0 3px 16px rgba(0,0,0,0.82), 0 8px 34px rgba(0,0,0,0.45), 0 0 1px rgba(255,255,255,0.95)",
              }}
            >
              Search Luxury Homes in Dubai
            </h1>

            <div className="relative z-10 h-[1.5px] w-[120px] bg-[linear-gradient(90deg,rgba(198,164,90,0)_0%,rgba(198,164,90,1)_50%,rgba(198,164,90,0)_100%)] lg:w-[210px]" />
          </div>

          <SearchFilter />
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-[176px] w-full"
          style={{
            background:
              "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}