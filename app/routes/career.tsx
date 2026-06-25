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
import Header from "~/UI/Header";

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

        <div className="flex w-full flex-col items-start gap-[34px] mt-[51px]">
          <div className="career-why-heading-black">
            <Header className="text-[28px] leading-[1.05] lg:text-[44px]">
              Why Choose Us
            </Header>
          </div>

          <div className="flex w-full flex-col items-start gap-[52px]">
            <div className="w-full">
              <CareerGlobalExposure />
            </div>

            <div className="w-full">
              <CareerCreativity />
            </div>

            <div className="w-full">
              <CareerFamilyCenter />
            </div>

            <div className="w-full">
              <CareerEnduringLegacy />
            </div>
          </div>
        </div>

        <style>
          {`
            .career-why-heading-black,
            .career-why-heading-black *,
            .career-why-heading-black p,
            .career-why-heading-black span,
            .career-why-heading-black h1,
            .career-why-heading-black h2 {
              color: #111111 !important;
              -webkit-text-fill-color: #111111 !important;
              opacity: 1 !important;
            }

            .career-why-heading-black *::before,
            .career-why-heading-black *::after {
              background: #111111 !important;
              border-color: #111111 !important;
            }
          `}
        </style>
      </PageLayout>

      <CareerAgentExpectations />

      <PageLayout>
        <CareerCurrentVacancies vacancies={careers} />
      </PageLayout>
    </div>
  );
}