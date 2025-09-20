import React from "react";
import CareerAbout from "~/components/Career/CareerAbout";
import CareerAgentExpectations from "~/components/Career/CareerAgentExpectations";
import CareerCreativity from "~/components/Career/CareerCreativity";
import CareerCurrentVacancies from "~/components/Career/CareerCurrentVacancies";
import CareerEnduringLegacy from "~/components/Career/CareerEnduringLegacy";
import CareerFamilyCenter from "~/components/Career/CareerFamilyCenter";
import CareerGlobalExposure from "~/components/Career/CareerGlobalExposure";
import CareerHero from "~/components/Career/CareerHero";
import PageLayout from "~/layouts/PageLayout";

export default function career() {
  return (
    <div>
      <CareerHero />
      <PageLayout>
        <CareerAbout />
        <div className="flex flex-col items-start gap-[18px] w-full mt-[51px]">
          <p className="text-[#C6A45A] text-[45px]">why choose us</p>
          <div className="flex flex-col items-start gap-[52px] w-full">
            <CareerGlobalExposure />
            <CareerCreativity />
            <CareerFamilyCenter />
            <CareerEnduringLegacy />
          </div>
        </div>
      </PageLayout>
      <CareerAgentExpectations />
      <PageLayout>
        <CareerCurrentVacancies />
      </PageLayout>
    </div>
  );
}
