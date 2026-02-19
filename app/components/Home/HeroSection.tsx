import React from "react";
import SearchFilter from "~/layouts/Filter/SearchFilter";
import HeroSwiper from "./HeroSwiper";

export default function HeroSection() {
  return (
    <div className="relative w-full h-screen">
      <HeroSwiper />

      <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 z-10 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[12px] lg:gap-[43.68px] w-full">
          <div className="flex flex-col items-center gap-[7.92px]" data-aos="fade-down">
            <h1 className="text-white text-[16px] lg:text-[51.04px]">
              Search Luxury Homes in Dubai
            </h1>
          </div>
          <SearchFilter />
        </div>

        <div
          className="absolute bottom-0 left-0 w-full h-[176px]"
          style={{ background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)" }}
        />
      </div>
    </div>
  );
}
