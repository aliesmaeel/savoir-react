import React from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";
import Title from "~/UI/Title";

export default function LuxuryPortfolio() {
  const arrow = useArrow();
  const icon = useIcons();
  return (
    <Card className="flex flex-col items-start gap-[30px] w-full pt-[33px] pb-[36px] px-[33px] relative overflow-hidden">
      <Title className="text-[30px]">EXPLORE RECENT OFF PLAN PROJECTS</Title>
      <div className="flex flex-col items-start gap-[22px] w-full">
        <div className="flex flex-col items-start w-full">
          <p className="text-[#353635] text-[25px] font-medium">LUXURY PORTFOLIO MAGAZINE</p>
          <p className="text-[#353635] text-[22px] leading-[233.333%]">
            Published biannually, Luxury Portfolio magazine features the latest luxury perspectives
            on Real Estate, Design, Travel and Lifestyle.
          </p>
        </div>
        <Button className="w-[299px]">
          View all <img src={arrow.longWhite} alt="" />
        </Button>
      </div>
      <img src={icon.Magazine} alt="" className="absolute bottom-0 right-0" />
    </Card>
  );
}
