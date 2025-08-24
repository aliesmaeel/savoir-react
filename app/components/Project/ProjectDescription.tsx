import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import ProjectListedByContact from "./ProjectListedByContact";

export default function ProjectDescription() {
  const icon = useIcons();

  const items = [
    {
      title: "Bedrooms",
      icon: icon.searchBedroom,
      value: "04",
    },
    {
      title: "Bathrooms",
      icon: icon.searchBathRoom,
      value: "03",
    },
    {
      title: "Area",
      icon: icon.searchSquare,
      value: "2,500 Square Feet",
    },
  ];

  return (
    <div className="flex items-start gap-[53px] w-full mt-[34px]">
      <div className="flex flex-col items-start gap-[31px] w-full">
        <div className="flex flex-col items-start gap-[17px] w-full">
          <p className="text-black text-[21px]">April 2026 | Single Row | Area Specialist</p>
          <div className="flex flex-col items-start gap-[4px] w-full">
            <p className="text--[27px] font-semibold">Description</p>
            <p className="text-[#505050] text-[18px] leading-[180%]">
              Discover your own piece of paradise with the Seaside Serenity Villa. T With an open
              floor plan, breathtaking ocean views from every room, and direct access to a pristine
              sandy beach, this property is the epitome of coastal living.Discover your own piece of
              paradise with the Seaside Serenity Villa. T With an open floor plan, breathtaking
              ocean views from every room, and direct access to a pristine sandy beach, this
              property is the epitome of coastal living.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-[17px]">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-start gap-[8px] pr-[52px] border-r border-[#353635]"
            >
              <div className="flex items-center gap-[7px]">
                <img src={item.icon} alt="" className="w-[25px]" />
                <p className="text-[#505050] text-[16px] font-medium">{item.title}</p>
              </div>
              <p className="text-[18px] font-semibold">{item.value}</p>
            </div>
          ))}
          <div className="flex flex-col items-start gap-[8px]">
            <p className="text-[#505050] text-[16px] font-medium">Completion Status:</p>
            <p className="text-[#C6A45A] text-[18px] font-semibold">Offplan</p>
          </div>
        </div>
      </div>
      <ProjectListedByContact />
    </div>
  );
}
