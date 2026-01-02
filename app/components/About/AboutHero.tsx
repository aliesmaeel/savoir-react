import React from "react";
import SearchFilter from "~/layouts/Filter/SearchFilter";

export default function AboutHero() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[85vh] lg:h-screen relative">
      <img
        loading="lazy"
        src="/images/placeholders/our-team2.jpg"
        alt=""
        className="w-full h-[85vh] lg:h-screen object-contain lg:object-cover brightness-50"
      />
      <div className="flex flex-col items-center justify-center w-full h-[85vh] lg:h-screen absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[61px] w-full">
          <div className="flex flex-col items-center gap-[9px]">
            <h1 className="text-white text-[25px] lg:text-[91px]">About US</h1>
            <p className="text-white text-[18px] lg:text-[68px]">Savoir Beyond Excellence</p>
          </div>
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
