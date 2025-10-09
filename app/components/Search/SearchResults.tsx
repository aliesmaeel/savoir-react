import React from "react";
import SearchSortBy from "./SearchSortBy";
import ProjectCard from "../Cards/ProjectCard";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";
import { useIsMobile } from "~/hooks/functionHooks/useIsMobile";

export default function SearchResults() {
  const arrow = useArrow();
  const icon = useIcons();
  const isMobile = useIsMobile();
  const projects = [
    {
      id: 1,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "$ 450,000",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.webp",
      beds: "3",
      bathrooms: "3",
      square: "136456 sqft",
      listedBy: "Wade Warren",
      listedByImage: "/images/placeholders/listedBy.svg",
      isLuxury: false,
    },
    {
      id: 2,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "$ 450,000",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.webp",
      beds: "3",
      bathrooms: "3",
      square: "136456 sqft",
      listedBy: "Wade Warren",
      listedByImage: "/images/placeholders/listedBy.svg",
      isLuxury: false,
    },
    {
      id: 3,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "$ 450,000",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.webp",
      beds: "3",
      bathrooms: "3",
      square: "136456 sqft",
      listedBy: "Wade Warren",
      listedByImage: "/images/placeholders/listedBy.svg",
      isLuxury: false,
    },
    {
      id: 4,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "$ 450,000",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.webp",
      beds: "3",
      bathrooms: "3",
      square: "136456 sqft",
      listedBy: "Wade Warren",
      listedByImage: "/images/placeholders/listedBy.svg",
      isLuxury: true,
    },
    {
      id: 5,
      title: "Luxury 4-Bedroom | Sea and Park Views in Blue Waters",
      price: "$ 450,000",
      location: "Marina, Dubai",
      date: "2years ago",
      image: "/images/placeholders/properties.webp",
      beds: "3",
      bathrooms: "3",
      square: "136456 sqft",
      listedBy: "Wade Warren",
      listedByImage: "/images/placeholders/listedBy.svg",
      isLuxury: false,
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[50px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start gap-[9px] lg:gap-[15px] w-full">
          <div className="flex items-center justify-between w-full">
            <p className="text-[16px] lg:text-[27px] font-medium">Properties for sale in Dubai</p>
            {isMobile && <SearchSortBy />}
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[#505050] text-[12px] lg:text-[21px]">
              Dubai’s property market offers an exceptional variety of homes suited...
            </p>
            <p className="text-[12px] lg:text-[21px] font-semibold">1094 results</p>
          </div>
        </div>
        {!isMobile && <SearchSortBy />}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-x-[48px] gap-y-[45px]">
        <div
          className="relative hidden lg:flex flex-col items-start gap-[22px] px-[30px] py-[45px] w-full rounded-[46.534px] col-start-3 row-start-1
               md:col-start-3 md:row-start-1
               sm:col-start-auto sm:row-start-auto"
          style={{
            background:
              "linear-gradient(98deg, rgba(198, 164, 90, 0.70) 65.68%, rgba(198, 164, 90, 0.00) 161.57%)",
          }}
        >
          <div className="flex flex-col items-start gap-[13px] w-full">
            <p className="text-[33px] max-w-[220px]">List your property with Savoir</p>
            <p className="text-[18px] leading-[166.667%]">
              We unlock a world of real estate opportunities with leading agents and real estateWe
              unlock a world of real estate opportunities with leading agents and re.
            </p>
          </div>
          <button className="flex items-center gap-[3px] px-[24px] py-[9px] h-[45px] rounded-[10px] bg-[#fefefd]">
            <p className="text-[#C6A45A] text-[16px] font-semibold">List your property</p>
            <img src={arrow.longGold} alt="" className="w-[16px] rotate-[-45deg]" />
          </button>
          <img src={icon.Magazine} alt="" className="absolute bottom-0 right-0 w-[200px]" />
        </div>
        {projects.map((project: any, index: number) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
      <hr className="w-full border-[#26262680]" />
    </div>
  );
}
