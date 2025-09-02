import React from "react";
import Title from "~/UI/Title";
import SponsorsSwiper from "./SponsorsSwiper";

export default function Sponsors() {
  return (
    <div className="flex flex-col items-center gap-[100px] w-full mb-[118px]">
      <div className="flex flex-col items-center gap-[67px] w-full" data-aos="fade-up">
        <Title className="text-[45px]">MARKETING CHANNELS</Title>
        <SponsorsSwiper />
      </div>
      <div className="flex flex-col items-center gap-[67px] w-full" data-aos="fade-up">
        <Title className="text-[45px]">LISTING SYNDICATION AND AFFILIATED WEBSITES</Title>
        <SponsorsSwiper />
      </div>
    </div>
  );
}
