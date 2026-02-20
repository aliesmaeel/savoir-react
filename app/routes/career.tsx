import React from "react";
import { useLoaderData } from "react-router";
import { getAllCareers } from "~/api/career.service";
import CareerAbout from "~/components/Career/CareerAbout";
import CareerAgentExpectations from "~/components/Career/CareerAgentExpectations";
import CareerCreativity from "~/components/Career/CareerCreativity";
import CareerCurrentVacancies from "~/components/Career/CareerCurrentVacancies";
import CareerEnduringLegacy from "~/components/Career/CareerEnduringLegacy";
import CareerFamilyCenter from "~/components/Career/CareerFamilyCenter";
import CareerGlobalExposure from "~/components/Career/CareerGlobalExposure";
import CareerHero from "~/components/Career/CareerHero";
import PageLayout from "~/layouts/PageLayout";

export async function clientLoader() {
  try {
    const res: any = await getAllCareers();
    const careers = res.data ?? res ?? [];
    return { careers };
  } catch {
    return { careers: [] };
  }
}

export default function career() {
  const { careers } = useLoaderData() as { careers: any[] };
  return (
    <div>
      <CareerHero />
      <PageLayout>
        <CareerAbout />
        <div className="flex flex-col items-start gap-[18px] w-full mt-[51px]">
          <p className="font-bold Theseasons _title_13r73_1 text-[20px] lg:text-[34px]">why choose us</p>
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
        <CareerCurrentVacancies vacancies={careers} />
      </PageLayout>
    </div>
  );
}
