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
    <div className="mt-[50px] flex w-full flex-col items-start gap-[24px]">
      <p className="CormorantGaramond text-[28px] font-[900] leading-[1.08] text-[#050505] [text-shadow:0_0_0.45px_#050505] lg:text-[34px]">
        Payment Plan
      </p>

      <div className="grid w-full max-w-[820px] grid-cols-1 gap-[12px] lg:grid-cols-3">
        {plans.map((plan: any, index: any) => (
          <div
            key={index}
            className="
              flex min-h-[150px] w-full items-start gap-[14px]
              rounded-[7px] border border-[#353635] bg-white
              px-[24px] py-[22px]
              shadow-[0_12px_30px_rgba(17,17,17,0.05)]
              transition-all duration-300
              hover:-translate-y-[2px]
              hover:shadow-[0_16px_34px_rgba(17,17,17,0.09)]
            "
          >
            <img
              loading="lazy"
              src={plan.icon}
              alt=""
              className="w-[45px] brightness-0 opacity-80"
            />

            <div className="mt-[5px] flex flex-col items-start gap-[7px]">
              <p
                className="flex min-h-[42px] items-center text-[15px]"
                style={{
                  color: "#353635",
                  fontWeight: 700,
                  opacity: 1,
                }}
              >
                {plan.title}
              </p>

              <p
                className="text-[24px]"
                style={{
                  color: "#353635",
                  fontWeight: 700,
                  opacity: 1,
                }}
              >
                {plan.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
