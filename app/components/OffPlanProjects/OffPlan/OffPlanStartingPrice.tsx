import React, { useState } from "react";
import { useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Popup from "~/UI/Popup";
import OffPlanPopup from "./OffPlanPopup";
import { formatPrice } from "~/utils/formatPrice";

export default function OffPlanStartingPrice() {
  const { property } = useLoaderData() as { property: any };
  const icon = useIcons();
  const [openPopup, setOpenPopup] = useState(false);
  const features = [
    {
      title: "Developer :",
      value: property.developer || "N/A",
    },
    {
      title: "Completion :",
      value: property.completion_date || "N/A",
    },
    {
      title: "Lifestyle :",
      value: property.lifestyle || "N/A",
    },
    {
      title: "Title type :",
      value: property.title_type || "N/A",
    },
  ];
  return (
    <div className="flex flex-col gap-[40px] px-[30px] py-[45px] border border-[#C6A45A] rounded-[15px] w-full lg:w-[439px] shrink-0 bg-[#FBFBFB] relative overflow-hidden z-10">
      <img loading="lazy" src={icon.Ellipse9} alt="" className="absolute top-0 left-0 z-[-1]" />
      <img loading="lazy" src={icon.Ellipse8} alt="" className="absolute bottom-0 right-0 z-[-1]" />

      <div className="flex flex-col">
        <p className="text-[25px]">Starting Price</p>
        <p className="text-[37px] font-semibold">{formatPrice(property.starting_price) || "N/A"}</p>
      </div>
      <div className="flex flex-col items-start gap-[21px] w-full">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-[15px] px-[18px] py-[10px] w-full h-[47px] border-l-[3px] border-[#C6A45A]"
            style={{
              background:
                "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(240, 232, 214, 1) 50%, rgba(255, 255, 255, 0) 100%)",
            }}
          >
            <img loading="lazy" src={icon.zap} alt="" className="w-[18px]" />
            <div className="flex gap-[12px]">
              <p className="text-[#999999] text-[15px] font-medium">{feature.title}</p>
              <p className="text-[15px] font-medium">{feature.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-[24px] w-full">
        <Button
          onClick={() => setOpenPopup(true)}
          className="w-full gap-[6px] !py-[10px] !text-[21px]"
        >
          Discover more
        </Button>
        <Button className="w-full gap-[6px] !py-[8px] !text-[21px]">Download brochure</Button>
      </div>

      {openPopup && (
        <Popup title="Get Faster Response!" onClose={() => setOpenPopup(false)}>
          <OffPlanPopup recipientNumber="+971505074686" />
        </Popup>
      )}
    </div>
  );
}
