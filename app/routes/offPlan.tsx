import React from "react";
import OffPlanDescription from "~/components/OffPlanProjects/OffPlan/OffPlanDescription";
import OffPlanLocation from "~/components/OffPlanProjects/OffPlan/OffPlanLocation";
import OffPlanPaymentPlans from "~/components/OffPlanProjects/OffPlan/OffPlanPaymentPlans";
import OffPlanStartingPrice from "~/components/OffPlanProjects/OffPlan/OffPlanStartingPrice";
import ProjectFeatures from "~/components/Project/ProjectFeatures";
import ProjectPageSwiper from "~/components/Project/ProjectPageSwiper";
import PageLayout from "~/layouts/PageLayout";
import FAQs from "~/UI/FAQs";

export default function offPlan() {
  return (
    <div>
      <div
        className="flex flex-col items-center gap-[72px] w-full pt-[192px] px-[45px]"
        style={{
          background:
            "linear-gradient(180deg,rgba(198, 164, 90, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 1) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-[17px] w-full">
          <p className="text-white text-[58px]">Discover the Best Off-Plan Projects in Dubai</p>
          <p className="text-white text-[22px]">
            Explore Dubai’s Diverse Communities: Where Tradition Meets Innovation in Every
            Neighborhood.
          </p>
        </div>
        <ProjectPageSwiper />
      </div>
      <PageLayout>
        <div className="flex items-start gap-[100px] w-full">
          <div>
            <OffPlanDescription />
            <OffPlanPaymentPlans />
            <OffPlanLocation />
          </div>
          <OffPlanStartingPrice />
        </div>
        <ProjectFeatures />
        <div className="flex flex-col items-start gap-[53px] w-full mt-[90px]">
          <p className="text-black text-[36px] font-medium">
            FAQs about rental properties in Dubai UAE
          </p>
          <FAQs />
        </div>
      </PageLayout>
    </div>
  );
}
