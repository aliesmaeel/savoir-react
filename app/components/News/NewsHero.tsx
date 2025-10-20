import React from "react";

export default function NewsHero() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen relative">
      <img
        loading="lazy"
        src="/images/placeholders/hero.webp"
        alt=""
        className="w-full h-screen object-cover"
      />
      <div className="flex flex-col items-center justify-center w-full h-screen absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[53.68px] w-full max-w-[1226px]">
          <h1 className="text-white text-[16px] lg:text-[51.04px] text-center ">
            Savoir Newsroom: Shaping the Future of Real Estate
          </h1>
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
