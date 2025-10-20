import React from "react";
import GoldTitle from "~/UI/GoldTitle";

export default function ListGlobalNetwork() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-[52px] w-full mt-[108px]">
      <div className="flex flex-col items-start gap-[37px] w-full">
        <GoldTitle>A Global Network, A Local Touch</GoldTitle>
        <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
          Within the LeadingRE umbrella, a diverse set of sub-companies and affiliates work together
          to shape the future of real estate. These organizations offer a wide range of services,
          including luxury real estate, commercial property, and worldwide relocation services. Each
          sub-company contributes a distinct thread to this exceptional tapestry of aggregate
          expertise, strengthening LeadingRE's position as a holistic resource for both real estate
          professionals and clients.
        </p>
      </div>
      <img
        loading="lazy"
        src="/images/placeholders/CareerFamilyCenter.png"
        alt=""
        className="w-[576px] aspect-[576/336] object-cover"
      />
    </div>
  );
}
