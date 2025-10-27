import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import ProjectListedByContact from "./ProjectListedByContact";
import { useLoaderData } from "react-router";

export default function ProjectDescription() {
  const { property } = useLoaderData() as { property: any };

  const icon = useIcons();

  const items = [
    {
      title: "Bedrooms",
      icon: icon.searchBedroom,
      value: property.bedroom,
    },
    {
      title: "Bathrooms",
      icon: icon.searchBathRoom,
      value: property.bathroom,
    },
    {
      title: "Area",
      icon: icon.searchSquare,
      value: `${property.size?.toLocaleString()} Square Feet`,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-start gap-[53px] w-full mt-[34px]">
      <div className="flex flex-col items-start gap-[31px] w-full">
        <div className="flex flex-col items-start gap-[17px] w-full">
          <p className="text-black text-[21px]">{property.title_en}</p>
          <div className="flex flex-col items-start gap-[4px] w-full">
            <p className="text--[27px] font-semibold">Description</p>
            <div
              className="text-[#505050] text-[14px] lg:text-[18px] leading-[180%]"
              dangerouslySetInnerHTML={{ __html: property.description_en }}
            />
          </div>
        </div>
        <div className="flex items-start gap-[17px]">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-start gap-[4px] lg:gap-[8px] pr-[26px] lg:pr-[52px] border-r border-[#353635]"
            >
              <div className="flex items-center gap-[3px] lg:gap-[7px]">
                <img loading="lazy" src={item.icon} alt="" className="w-[12px] lg:w-[25px]" />
                <p className="text-[#505050] text-[8px] lg:text-[16px] font-medium">{item.title}</p>
              </div>
              <p className="text-[10px] lg:text-[18px] font-semibold">{item.value}</p>
            </div>
          ))}
          <div className="flex flex-col items-start gap-[3px] lg:gap-[8px]">
            <p className="text-[#505050] text-[8px] lg:text-[16px] font-medium">
              Completion Status:
            </p>
            <p className="text-[#C6A45A] text-[10px] lg:text-[18px] font-semibold">Offplan</p>
          </div>
        </div>
      </div>
      <ProjectListedByContact />
    </div>
  );
}
