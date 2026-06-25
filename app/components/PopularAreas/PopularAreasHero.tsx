import React from "react";
import PopularRegisterWithUs from "./PopularRegisterWithUs";
import { useLoaderData } from "react-router";

export default function PopularAreasHero() {
  const { area } = useLoaderData() as { area: any };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen relative">
      <img loading="lazy" src={area.image} alt="" className="w-full h-screen object-cover" />
      <div className="flex flex-col items-center justify-center w-full h-screen absolute top-0 left-0 px-[16px] lg:px-[45px] ">
        <div className="flex flex-col items-end justify-center w-full max-w-[1226px] mx-auto">
          <PopularRegisterWithUs />
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[176px] z-10"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}
