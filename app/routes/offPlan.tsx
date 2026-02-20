import React from "react";
import { useLoaderData } from "react-router";
import { getFAQ } from "~/api/faq.service";
import { getOffPlanPage } from "~/api/offPlan.service";
import OffPlanDescription from "~/components/OffPlanProjects/OffPlan/OffPlanDescription";
import OffPlanLocation from "~/components/OffPlanProjects/OffPlan/OffPlanLocation";
import OffPlanPaymentPlans from "~/components/OffPlanProjects/OffPlan/OffPlanPaymentPlans";
import OffPlanStartingPrice from "~/components/OffPlanProjects/OffPlan/OffPlanStartingPrice";
import OffPlanYoutube from "~/components/OffPlanProjects/OffPlan/OffPlanYoutube";
import ProjectFeatures from "~/components/Project/ProjectFeatures";
import ProjectPageSwiper from "~/components/Project/ProjectPageSwiper";
import useIcons from "~/hooks/imageHooks/useIcons";
import PageLayout from "~/layouts/PageLayout";
import FAQs from "~/UI/FAQs";
import { formatPrice } from "~/utils/formatPrice";

export async function clientLoader({ params }: { params: { offPlanSlug: string } }) {
  const offPlanSlug = params.offPlanSlug;
  const faqtype = "offplan";
  try {
    const res: any = await getOffPlanPage(offPlanSlug);
    const resFAQ: any = await getFAQ(faqtype);

    const property = res;
    // const similar = res.similar_properties;

    return { property, faq: resFAQ };
  } catch (error) {
    return { property: [], faq: [] };
  }
}

export default function offPlan() {
  const { property, faq } = useLoaderData() as { property: any; faq: any };
  const icon = useIcons();

  return (
    <div>
      <PageLayout>
        <div className="flex flex-col items-center">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[13px] w-full mt-[90px]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[13px]">
              <p className="text-[24px] font-semibold">{property.title}</p>
              <div className="flex items-center gap-[7px]">
                <img loading="lazy" src={icon.locationBlack} alt="" className="w-[16px]" />
                <p className="text-[14px] font-medium">{property.location}</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-[2px]">
              <p className="text-[14px] font-medium">Price</p>
              <p className="text-[#C6A45A] text-[27px] font-bold">
                {formatPrice(property.starting_price)}
              </p>
            </div>
          </div>
          <ProjectPageSwiper mainImage={property.image} sliderImages={property.header_images} />
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-[100px] w-full mt-[34px]">
          <div>
            <OffPlanDescription />
            <OffPlanPaymentPlans />
          </div>
          <OffPlanStartingPrice />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] w-full">
          <OffPlanLocation />
          <OffPlanYoutube />
        </div>
        <ProjectFeatures />
        <div className="flex flex-col items-center gap-[53px] w-full mt-[90px]">
          <p className="text-black text-[16px] lg:text-[36px] font-medium">
            FAQs about offPlan properties in Dubai
          </p>
          <FAQs questions={faq} />
        </div>
      </PageLayout>
    </div>
  );
}
