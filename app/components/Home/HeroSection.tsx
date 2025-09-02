import React from "react";
import SearchFilter from "~/layouts/Filter/SearchFilter";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen relative">
      <img
        src="/images/placeholders/hero.png"
        alt=""
        className="w-full h-screen object-cover fixed top-0 left-0 z-[-1]"
      />
      <div className="flex flex-col items-center justify-center w-full h-screen absolute top-0 left-0 px-[45px]">
        <div className="flex flex-col items-center gap-[61px] w-full">
          <div className="flex flex-col items-center gap-[9px]" data-aos="fade-down">
            <h1 className="text-white text-[58px]">Search Luxury Homes In Dubai</h1>
            <p className="text-white text-[21px]">
              Explore Dubai's Diverse Communities: Where Tradition Meets Innovation in Every
              Neighborhood.
            </p>
          </div>
          <SearchFilter />
        </div>
        {/* <div
          className="absolute bottom-0 left-0 w-full h-[200px]"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        /> */}
      </div>
    </div>
  );
}
