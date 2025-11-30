import React from "react";
import { useLoaderData } from "react-router";
import { getArea } from "~/api/area.service";
import { getFAQ } from "~/api/faq.service";
import PopularAbout from "~/components/PopularAreas/PopularAbout";
import PopularAreasHero from "~/components/PopularAreas/PopularAreasHero";
import PopularForSale from "~/components/PopularAreas/PopularForSale";
import PopularLocation from "~/components/PopularAreas/PopularLocation";
import PageLayout from "~/layouts/PageLayout";
import FAQs from "~/UI/FAQs";

export async function clientLoader({ params }: { params: { areaSlug: string } }) {
  const areaSlug = params.areaSlug;
  const faqtype = "area";
  try {
    const res: any = await getArea(areaSlug);
    const resFAQ: any = await getFAQ(faqtype);

    const area = res.area;
    const properties = res.suggested_properties;

    return { area, properties, faq: resFAQ };
  } catch (error) {
    return { area: [], properties: [], faq: [] };
  }
}

export default function popularAreas() {
  const { faq } = useLoaderData() as { faq: any };

  return (
    <div className="relative">
      <PopularAreasHero />
      <PageLayout>
        <PopularAbout />
        <PopularForSale />
        <PopularLocation />
        <div className="flex flex-col items-start gap-[41px] w-full mt-[108px]">
          <p className="text-black text-[20px] lg:text-[36px] font-medium">
            FAQs about properties in Dubai
          </p>
          <FAQs questions={faq} />
        </div>
      </PageLayout>
    </div>
  );
}
