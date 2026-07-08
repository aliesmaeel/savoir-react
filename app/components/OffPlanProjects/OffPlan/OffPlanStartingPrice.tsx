import React, { useState } from "react";
import { useLoaderData } from "react-router";
import Popup from "~/UI/Popup";
import OffPlanPopup from "./OffPlanPopup";
import { formatCompactPrice } from "~/utils/formatPrice";

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
    <div className="relative z-10 flex w-full shrink-0 flex-col gap-[28px] overflow-hidden rounded-[15px] border border-[#111111] bg-white px-[24px] py-[34px] shadow-[0_18px_45px_rgba(17,17,17,0.06)] lg:w-[360px]">
      <div className="flex flex-col">
        <p className="CormorantGaramond text-[28px] font-[900] leading-[1.08] text-[#050505] [text-shadow:0_0_0.45px_#050505] lg:text-[34px]">
          Starting Price
        </p>

        <p className="text-[32px] font-semibold">
          {formatCompactPrice(property.starting_price) || "N/A"}
        </p>
      </div>

      <div className="flex w-full flex-col items-start gap-[16px]">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="flex min-h-[44px] w-full items-center border-l-[3px] border-[#111111] px-[14px] py-[9px] lg:px-[16px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(17, 17, 17, 0.08) 52%, rgba(255, 255, 255, 0) 100%)",
            }}
          >
            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[3px]">
              <p className="text-[14px] font-medium text-[#3F3F3F]">
                {feature.title}
              </p>

              <p className="text-[14px] font-normal text-[#111111]">
                {feature.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-center gap-[16px]">
        <button
          type="button"
          onClick={() => setOpenPopup(true)}
          className="flex h-[48px] w-full items-center justify-center rounded-[10.5px] bg-[#2B2B2B] px-[18px] text-[18px] font-semibold text-white shadow-[0_12px_28px_rgba(43,43,43,0.18)] transition-all duration-300 hover:bg-[#242424]"
        >
          Discover more
        </button>

        <button
          type="button"
          className="flex h-[48px] w-full items-center justify-center rounded-[10.5px] bg-[#2B2B2B] px-[18px] text-[18px] font-semibold text-white shadow-[0_12px_28px_rgba(43,43,43,0.18)] transition-all duration-300 hover:bg-[#242424]"
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