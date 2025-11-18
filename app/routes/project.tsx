import React from "react";
import { useLoaderData } from "react-router";
import { getProject } from "~/api/project.service";
import AveragePrices from "~/components/Project/BookYourViewing/AveragePrices";
import BookYourViewing from "~/components/Project/BookYourViewing/BookYourViewing";
import SimilarListings from "~/components/Project/BookYourViewing/SimilarListings";
import MortgageCalculator from "~/components/Project/Calculator/MortgageCalculator";
import RentalYieldCalculator from "~/components/Project/Calculator/RentalYieldCalculator";
import ProjectDescription from "~/components/Project/ProjectDescription";
import ProjectFeatures from "~/components/Project/ProjectFeatures";
import ProjectPageSwiper from "~/components/Project/ProjectPageSwiper";
import useIcons from "~/hooks/imageHooks/useIcons";
import PageLayout from "~/layouts/PageLayout";
import DontMissBeat from "~/UI/DontMissBeat";

export async function clientLoader({ params }: { params: { projectSlug: string } }) {
  const projectSlug = params.projectSlug;
  try {
    const res: any = await getProject(projectSlug);

    const property = res.property;
    const similar = res.similar_properties;

    return { property, similar };
  } catch (error) {
    return { property: [], similar: [] };
  }
}

export default function project() {
  const { property, similar } = useLoaderData() as { property: any; similar: any };
  const icon = useIcons();
  
  return (
    <PageLayout>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[13px] w-full mt-[90px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[13px]">
          <p className="text-[24px] font-semibold">{property.title_en}</p>
          <div className="flex items-center gap-[7px]">
            <img loading="lazy" src={icon.locationBlack} alt="" className="w-[16px]" />
            <p className="text-[14px] font-medium">
              {property.community}, {property.city}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[2px]">
          <p className="text-[14px] font-medium">Price</p>
          <p className="text-[#C6A45A] text-[27px] font-bold">
            {property.price?.toLocaleString()} {property.currency}
          </p>
        </div>
      </div>
      <ProjectPageSwiper mainImage={property.photo} sliderImages={property.property_images} />
      <ProjectDescription />
      <ProjectFeatures />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[35px] w-full mt-[90px]">
        <MortgageCalculator />
        <RentalYieldCalculator />
      </div>
      <div style={{ backgroundImage: `url(${icon.vLetter})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <BookYourViewing />
      <AveragePrices />
      </div>
      {similar.length > 0 && <SimilarListings />}

      <DontMissBeat />
    </PageLayout>
  );
}
