import React from "react";
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

export default function project() {
  const icon = useIcons();
  return (
    <PageLayout>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[13px] w-full mt-[90px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[13px]">
          <p className="text-[24px] font-semibold">Seaside Serenity Villa</p>
          <div className="flex items-center gap-[7px]">
            <img src={icon.locationBlack} alt="" className="w-[16px]" />
            <p className="text-[14px] font-medium">Malibu, California</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[2px]">
          <p className="text-[14px] font-medium">Price</p>
          <p className="text-[#C6A45A] text-[27px] font-bold">$1,250,000</p>
        </div>
      </div>
      <ProjectPageSwiper />
      <ProjectDescription />
      <ProjectFeatures />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[35px] w-full mt-[90px]">
        <MortgageCalculator />
        <RentalYieldCalculator />
      </div>
      <BookYourViewing />
      <AveragePrices />
      <SimilarListings />
      <DontMissBeat />
    </PageLayout>
  );
}
