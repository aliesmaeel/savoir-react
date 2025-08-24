import React from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";
import SearchSortBy from "../Search/SearchSortBy";
import OffPlanCard from "../Cards/OffPlanCard";

export default function OffPlanResults() {
  const arrow = useArrow();
  const icon = useIcons();
  const projects = [
    {
      id: 1,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "45 M",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.png",
    },
    {
      id: 2,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "45 M",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.png",
    },
    {
      id: 3,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "45 M",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.png",
    },
    {
      id: 4,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "45 M",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.png",
    },
    {
      id: 5,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "45 M",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.png",
    },
    {
      id: 6,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "45 M",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.png",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[50px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start gap-[15px]">
          <p className="text-[27px] font-medium">Properties off-plan in Dubai</p>
          <div className="flex flex-col items-start">
            <p className="text-[#505050] text-[21px]">
              Dubai’s property market offers an exceptional variety of homes suited...
            </p>
            <p className="text-[21px] font-semibold">1094 results</p>
          </div>
        </div>
        <SearchSortBy />
      </div>
      <div className="grid grid-cols-3 w-full gap-[37px]">
        {projects.map((project: any, index: number) => (
          <OffPlanCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
}
