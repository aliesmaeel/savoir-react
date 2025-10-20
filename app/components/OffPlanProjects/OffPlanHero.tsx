import React from "react";
import SearchFilter from "~/layouts/Filter/SearchFilter";

export default function OffPlanHero() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen relative">
      <img
        loading="lazy"
        src="/images/placeholders/hero.webp"
        alt=""
        className="w-full h-screen object-cover"
      />
      <div className="flex flex-col items-center justify-center w-full h-screen absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[12px] lg:gap-[61px] w-full">
          <div className="flex flex-col items-center gap-[7.92px] lg:gap-[17px] w-full">
            <p className="text-white text-[16px] lg:text-[58px] text-center">
              Discover the Best Off-Plan Projects in Dubai
            </p>
            <p className="text-white text-[12px] lg:text-[22px] text-center">
              Explore Dubai’s Diverse Communities: Where Tradition Meets Innovation in Every
              Neighborhood.
            </p>
          </div>
          <SearchFilter />
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[200px]"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}
