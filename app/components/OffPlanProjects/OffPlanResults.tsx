import React from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";
import SearchSortBy from "../Search/SearchSortBy";
import OffPlanCard from "../Cards/OffPlanCard";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";
import { useLoaderData } from "react-router";

type Props = {
  offPlan: any;
};

export default function OffPlanResults({ offPlan }: Props) {
  const arrow = useArrow();
  const icon = useIcons();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col items-start gap-[50px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start gap-[9px] lg:gap-[15px] w-full">
          <div className="flex items-center justify-between w-full">
            {isMobile && <SearchSortBy />}
          </div>
        </div>
        {!isMobile && <SearchSortBy />}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-[37px]">
        {offPlan.map((project: any, index: number) => (
          <OffPlanCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
}
