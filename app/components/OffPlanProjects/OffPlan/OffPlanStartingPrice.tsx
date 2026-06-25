import React, { useState } from "react";
import { useLoaderData } from "react-router";
import Popup from "~/UI/Popup";
import OffPlanPopup from "./OffPlanPopup";
import { formatPrice } from "~/utils/formatPrice";

export default function OffPlanStartingPrice() {
  const { property } = useLoaderData() as { property: any };
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
      title: "Title type :",
      value: property.title_type || "N/A",
    },
  ];

  return (
    <div className="flex flex-col gap-[28px] px-[24px] py-[34px] border border-[#111111] rounded-[15px] w-full lg:w-[360px] shrink-0 bg-white relative overflow-hidden z-10 shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
      {/* <img loading="lazy" src={icon.Ellipse9} alt="" className="absolute top-0 left-0 z-[-1]" />
      <img loading="lazy" src={icon.Ellipse8} alt="" className="absolute bottom-0 right-0 z-[-1]" /> */}

      <div className="flex flex-col">
        <p className="text-[22px]">Starting Price</p>
        <p className="text-[32px] font-semibold">
          {formatPrice(property.starting_price) || "N/A"}
        </p>
      </div>

      <div className="flex flex-col items-start gap-[16px] w-full">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="flex items-center px-[14px] lg:px-[16px] py-[9px] w-full min-h-[44px] border-l-[3px] border-[#111111]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(17, 17, 17, 0.08) 52%, rgba(255, 255, 255, 0) 100%)",
            }}
          >
            <div className="flex flex-wrap gap-x-[10px] gap-y-[3px]">
              <p className="text-[#3F3F3F] text-[14px] font-medium">
                {feature.title}
              </p>
              <p className="text-[14px] font-semibold text-[#111111]">
                {feature.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-[16px] w-full">
        <button
          type="button"
          onClick={() => setOpenPopup(true)}
          className="flex h-[48px] w-full items-center justify-center rounded-[10.5px] bg-[#111111] px-[18px] text-[18px] font-semibold text-white shadow-[0_12px_28px_rgba(17,17,17,0.18)]"
        >
          Discover more
        </button>

        <button
          type="button"
          className="flex h-[48px] w-full items-center justify-center rounded-[10.5px] bg-[#111111] px-[18px] text-[18px] font-semibold text-white shadow-[0_12px_28px_rgba(17,17,17,0.18)]"
        >
          Download brochure
        </button>
      </div>

      {openPopup && (
        <Popup title="Get Faster Response!" onClose={() => setOpenPopup(false)}>
          <OffPlanPopup recipientNumber="+971505074686" />
        </Popup>
      )}
    </div>
  );
}