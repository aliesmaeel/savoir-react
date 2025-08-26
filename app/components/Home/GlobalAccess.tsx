import React from "react";
import Title from "~/UI/Title";

export default function GlobalAccess() {
  return (
    <div className="flex flex-col items-center gap-[52px] w-full mt-[167px] mb-[142px]">
      <div className="flex flex-col items-start gap-[21px] w-full" data-aos="fade-down">
        <Title className="text-[#C6A45A] text-[31px]">
          UNLOCK ENDLESS REAL ESTATE OPPORTUNITIES WITH GLOBAL ACCESS
        </Title>
        <p className="text-[#353635] text-[23px] leading-[225.806%]">
          We unlock a world of real estate opportunities with leading agents and real estate
          professionals through our membership in the largest real estate network in the world. We
          facilitate access to customers and provide luxury offers from more than 70 countries.
        </p>
      </div>
      <img src="/images/placeholders/GlobalAccess.svg" alt="" data-aos="fade-up" />
    </div>
  );
}
