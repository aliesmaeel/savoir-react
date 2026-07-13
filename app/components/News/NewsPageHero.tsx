import React from "react";
import { useLoaderData } from "react-router";

export default function NewsPageHero() {
  const { newsItem } = useLoaderData() as { newsItem: any };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <img
        loading="lazy"
        src={newsItem.image}
        alt=""
        className="h-screen w-full object-cover object-[center_38%] brightness-[0.58]"
      />

      <div className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center px-[16px] lg:px-[45px]">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex w-full max-w-[900px] flex-col items-center">
          <h1 className="text-center text-[27px] leading-[1.18] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] lg:text-[48px]">
            {newsItem.title}
          </h1>
        </div>

        <div
          className="absolute bottom-0 left-0 z-10 h-[190px] w-full"
          style={{
            background:
              "linear-gradient(0deg, #FFF 0%, rgba(255,255,255,0.88) 14%, rgba(255,255,255,0.48) 40%, rgba(255,255,255,0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}