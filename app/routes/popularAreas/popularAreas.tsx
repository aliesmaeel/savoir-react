import React from "react";
import PopularAbout from "~/components/PopularAreas/PopularAbout";
import PopularAreasHero from "~/components/PopularAreas/PopularAreasHero";
import PopularForSale from "~/components/PopularAreas/PopularForSale";
import PopularLocation from "~/components/PopularAreas/PopularLocation";
import PageLayout from "~/layouts/PageLayout";
import FAQs from "~/UI/FAQs";

export default function popularAreas() {
  return (
    <div className="relative">
      <PopularAreasHero />
      <PageLayout>
        <PopularAbout />
        <PopularForSale />
        <PopularLocation />
        <div className="flex flex-col items-start gap-[41px] w-full mt-[108px]">
          <p className="text-black text-[20px] lg:text-[36px] font-medium">
            FAQs about rental properties in Dubai UAE
          </p>
          <FAQs />
        </div>
      </PageLayout>
    </div>
  );
}
