import React from "react";
import { useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function OffPlanPaymentPlans() {
  const { property } = useLoaderData() as { property: any };
  const icon = useIcons();

  const plans = [
    {
      title: "First Installment",
      icon: icon.FirstInstallment,
      value: property.first_installment || "0%",
    },
    {
      title: "During Construction",
      icon: icon.UnderConstruction,
      value: property.during_construction || "N/A",
    },
    {
      title: "On Handover",
      icon: icon.OnHandover,
      value: property.on_handover || "N/A",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[29px] w-full mt-[50px]">
      <p className="text-[21px] font-semibold">Payment plans</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px] w-full">
        {plans.map((plan: any, index: any) => (
          <div
            key={index}
            className="flex items-start gap-[12px] px-[30px] py-[24px] w-full border border-[#C6A45A] rounded-[7px]"
          >
            <img loading="lazy" src={plan.icon} alt="" className="w-[45px]" />
            <div className="flex flex-col items-start gap-[7px] mt-[5px]">
              <p className="text-[15px] font-semibold min-h-[42px] flex items-center">{plan.title}</p>
              <p className="text-[#C6A45A] text-[24px] font-medium">{plan.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
