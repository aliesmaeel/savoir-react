import React from "react";
import OffPlanHero from "~/components/OffPlanProjects/OffPlanHero";
import OffPlanResults from "~/components/OffPlanProjects/OffPlanResults";
import PageLayout from "~/layouts/PageLayout";

export default function offPlanProjects() {
  return (
    <div className="relative">
      <OffPlanHero />
      <PageLayout>
        <OffPlanResults />
      </PageLayout>
    </div>
  );
}
