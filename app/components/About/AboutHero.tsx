import React from "react";

export default function AboutHero() {
  return (
    <div className="relative flex h-[85vh] w-full flex-col items-center justify-center overflow-hidden lg:h-screen">
      <img
        loading="lazy"
        src="/images/placeholders/our-team2.jpg"
        alt=""
        className="h-[85vh] w-full object-contain brightness-[0.42] lg:h-screen lg:object-cover"
      />

      <div className="absolute left-0 top-0 flex h-[85vh] w-full flex-col items-center justify-center px-[16px] lg:h-screen lg:px-[45px]">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex w-full flex-col items-center">
          <h1 className="text-center text-[30px] leading-[1.15] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] lg:text-[86px]">
            About Us
          </h1>

          <p className="mt-[12px] text-center text-[22px] leading-[1.2] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] lg:text-[58px]">
            Savoir Beyond Excellence
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 h-[200px] w-full"
          style={{
            background:
              "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}