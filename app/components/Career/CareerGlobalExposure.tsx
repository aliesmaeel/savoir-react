import React from "react";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";

export default function CareerGlobalExposure() {
  return (
    <Card className="!rounded-[15px] lg:!rounded-[67px] py-[30px] lg:py-[59px] px-[16px] lg:px-[45px]">
      <div className="flex flex-col lg:flex-row items-center gap-[35px] w-full">
        <div className="flex flex-col items-start gap-[31px] w-full">
          <GoldTitle className="text-[">Global Exposure, Local Expertise</GoldTitle>
          <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
            As a proud member of Leading Real Estate Companies of the World®, our agents enjoy
            unparalleled global exposure. This membership opens doors to a vast international
            network, providing agents with access to a global portal where they can showcase their
            listings and connect with elite professionals worldwide.
          </p>
        </div>
        <img
          loading="lazy"
          src="/images/Career/Globalexposure.jpg"
          alt=""
          className="w-[396px] aspect-[396/336] rounded-[15px] object-cover"
        />
      </div>
    </Card>
  );
}
