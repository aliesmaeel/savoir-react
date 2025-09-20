import React from "react";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";

export default function CareerGlobalExposure() {
  return (
    <Card className="!rounded-[67px] py-[59px] px-[45px]">
      <div className="flex items-center gap-[35px] w-full">
        <div className="flex flex-col items-start gap-[31px] w-full">
          <GoldTitle className="text-[">Global Exposure, Local Expertise</GoldTitle>
          <p className="text-black text-[22px] leading-[200%]">
            As a proud member of Leading Real Estate Companies of the World®, our agents enjoy
            unparalleled global exposure. This membership opens doors to a vast international
            network, providing agents with access to a global portal where they can showcase their
            listings and connect with elite professionals worldwide.
          </p>
        </div>
        <img
          src="/images/placeholders/CareerGlobalExposure.png"
          alt=""
          className="w-[396px] aspect-[396/336] rounded-[15px] object-cover"
        />
      </div>
    </Card>
  );
}
