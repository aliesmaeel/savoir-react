import React from "react";
import SearchFilter from "~/layouts/Filter/SearchFilter";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen relative">
      <video
        className="w-full h-screen object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/images/placeholders/header.mp4" type="video/mp4" />
        {/* Fallback for very old browsers */}
        <img loading="lazy" src="/images/placeholders/hero.webp" alt="" />
      </video>

      <div className="flex flex-col items-center justify-center w-full h-screen absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[12px] lg:gap-[53.68px] w-full">
          <div className="flex flex-col items-center gap-[7.92px]" data-aos="fade-down">
            <h1 className="text-white text-[16px] lg:text-[51.04px]">
              Search Luxury Homes In Dubai
            </h1>
            <p className="text-white text-[12px] lg:text-[18.48px] text-center">
              Explore Dubai's Diverse Communities: Where Tradition Meets Innovation in Every
              Neighborhood.
            </p>
          </div>
          <SearchFilter />
        </div>

        <div
          className="absolute bottom-0 left-0 w-full h-[176px] z-10"
          style={{ background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)" }}
        />
      </div>
    </div>
  );
}
