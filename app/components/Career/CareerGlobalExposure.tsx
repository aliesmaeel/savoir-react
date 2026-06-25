import React from "react";
import Card from "~/UI/Card";

export default function CareerGlobalExposure() {
  return (
    <Card className="mx-auto !max-w-[1080px] overflow-hidden !rounded-[22px] border border-[#e9dfcf] px-[16px] py-[20px] shadow-[0_16px_42px_rgba(17,17,17,0.07)] lg:px-[30px] lg:py-[28px]">
      <div className="grid w-full grid-cols-1 items-start gap-[24px] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[34px]">
        <div className="flex w-full flex-col items-start gap-[22px]">
          <div
            className="flex w-full items-center border-l-[3px] border-[#111111] px-[14px] py-[12px] lg:px-[18px] lg:py-[15px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)",
            }}
          >
            <p
              className="CormorantGaramond text-[20px] leading-[1.12] lg:text-[30px]"
              style={{
                color: "#111111",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              Global Exposure, Local Expertise
            </p>
          </div>

          <p
            className="max-w-[650px] text-[14px] leading-[175%] lg:text-[18px]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            As a proud member of Leading Real Estate Companies of the World, our
            agents enjoy unparalleled global exposure.
            <br />
            This membership opens doors to a vast international network,
            providing agents with access to a global portal where they can
            showcase their listings and connect with elite professionals
            worldwide.
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-[20px] shadow-[0_16px_36px_rgba(17,17,17,0.07)] lg:w-[360px] lg:justify-self-end">
          <img
            loading="lazy"
            src="/images/Career/Globalexposure.jpg"
            alt=""
            className="aspect-[396/336] w-full rounded-[20px] object-cover"
          />
        </div>
      </div>
    </Card>
  );
}