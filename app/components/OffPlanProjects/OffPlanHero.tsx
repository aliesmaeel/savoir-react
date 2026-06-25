import React from "react";
import OffPlanFilter from "./OffPlanFilter";

export default function OffPlanHero() {
  return (
    <div className="relative flex h-[520px] w-full flex-col items-center justify-center overflow-hidden lg:h-[460px]">
      <img
        loading="lazy"
        src="/images/placeholders/hero.webp"
        alt=""
        className="h-full w-full object-cover brightness-[0.42]"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-start pt-[74px] lg:pt-[78px]">
        <div className="flex w-full flex-col items-center gap-[12px] lg:gap-[26px]">
          <OffPlanFilter />

          <div className="mt-[55px] flex w-full flex-col items-center px-[16px] lg:mt-[58px] lg:px-[45px]">
            <h1 className="max-w-[1250px] text-center text-[34px] leading-[1.15] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] lg:text-[76px]">
              Discover the Best Off-Plan Projects
            </h1>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 z-10 h-[140px] w-full lg:h-[160px]"
          style={{
            background:
              "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}