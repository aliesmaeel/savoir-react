import React from "react";
import AboutGlobal from "~/components/GlobalProject/AboutGlobal";
import GlobalProjectHero from "~/components/GlobalProject/GlobalProjectHero";
import GlobeLuxuryProperties from "~/components/GlobalProject/GlobeLuxuryProperties";
import OffPlanStartingPrice from "~/components/OffPlanProjects/OffPlan/OffPlanStartingPrice";
import PageLayout from "~/layouts/PageLayout";

export default function globalProject() {
  return (
    <div>
      <GlobalProjectHero />
      <PageLayout>
        <div className="flex flex-col lg:flex-row items-start gap-[50px] w-full">
          <AboutGlobal />
          <OffPlanStartingPrice />
        </div>
        <GlobeLuxuryProperties />
      </PageLayout>
    </div>
  );
}
