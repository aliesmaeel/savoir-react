import React from "react";
import GlobalGlobe from "./GlobalGlobe";

export default function GlobalProjectHero() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] relative">
      <img
        src="/images/placeholders/memberBg.svg"
        alt=""
        className="w-full h-[100vh]  object-cover"
      />
      <div className="flex flex-col items-center justify-center w-full h-[100vh]  absolute top-0 left-0 px-[45px]">
        <GlobalGlobe size={559} globeScale={0.8} />
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
