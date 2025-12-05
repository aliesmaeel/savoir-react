import React from "react";
import { useLoaderData } from "react-router";

export default function NewsPageHero() {
  const { newsItem } = useLoaderData() as { newsItem: any };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[48vh] lg:h-screen relative">
      <img loading="lazy" src={newsItem.image} alt="" className="w-full h-screen object-contain lg:object-cover" />
      <div className="flex flex-col items-center justify-center w-full h-[50vh] lg:h-screen absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[53.68px] w-full max-w-[1226px]">
          <h1 className="text-white text-[16px] lg:text-[51.04px] text-center ">
            {newsItem.title}
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
