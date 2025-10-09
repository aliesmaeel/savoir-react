import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function ProjectFeatures() {
  const icon = useIcons();
  const features = [
    "Children's play area",
    "Shared spa",
    "Built-in kitchen appliances",
    "Shared gym",
    "Walk-in closet",
    "Built-in wardrobe",
    "Shared swimming pool",
    "Barbecue area",
    "Concierge service",
    "Balcony",
    "Private garden",
    "Pets allowed",
    "Central air conditioning",
    "Cable-ready",
    "Sea/water view",
  ];

  return (
    <div className="flex flex-col items-start gap-[23px] w-full mt-[45px]">
      <p className="text-[27px] font-semibold">Features & amenities</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-x-[45px] gap-y-[22px]">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-[7px] px-[18px] py-[10px] w-full h-[47px] border-l border-[#C6A45A]"
            style={{
              background:
                "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(240, 232, 214, 1) 50%, rgba(255, 255, 255, 0) 100%)",
            }}
          >
            <img src={icon.zap} alt="" className="w-[18px]" />
            <p className="text-[#999999] text-[15px] font-medium">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
