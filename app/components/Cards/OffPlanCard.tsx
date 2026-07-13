import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";
import { formatCompactPrice } from "~/utils/formatPrice";

type props = {
  project: any;
};

export default function OffPlanCard({ project }: props) {
  const icon = useIcons();

  return (
    <Card className="w-full max-w-[390px] !bg-white !shadow-[0_4px_16px_rgba(0,0,0,0.12)] lg:max-w-[352px]">
      <Link
        to={`/off-plan/${project.slug}`}
        className="block w-full px-[18px] pb-[20px] pt-[16px] lg:px-[14px] lg:pb-[14px] lg:pt-[13px]"
      >
        <div className="relative w-full">
          <img
            loading="lazy"
            src={project.image}
            alt=""
            className="aspect-[386/238] w-full rounded-[10px] object-cover lg:aspect-[386/210]"
          />

          <span className="Jakarta absolute left-[14px] top-[14px] rounded-[7px] bg-[#2B2B2B] px-[13px] py-[7px] text-[14px] font-semibold leading-none text-white shadow-[0_2px_8px_rgba(43,43,43,0.16)] lg:left-[12px] lg:top-[12px] lg:px-[11px] lg:py-[6px] lg:text-[13px]">
            Off-plan
          </span>
        </div>

        <p
          className="CormorantGaramond mt-[14px] max-w-[319px] text-[19px] leading-[1.25] text-black lg:mt-[10px] lg:text-[18px] lg:leading-[1.18]"
          style={{
            fontWeight: 700,
            opacity: 1,
            textShadow: "0 0 0.18px #111111",
          }}
        >
          {project.title}
        </p>

        <div className="mt-[10px] flex flex-col items-start gap-[8px] lg:mt-[7px] lg:gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <img
              loading="lazy"
              src={icon.locationBlack}
              alt=""
              className="w-[20px] lg:w-[17px]"
            />

            <p
              className="Jakarta text-[15px] text-black lg:text-[14px]"
              style={{
                fontWeight: 550,
                opacity: 1,
                textShadow: "0 0 0.1px #111111",
              }}
            >
              {project.location}
            </p>
          </div>

          <div className="flex items-center gap-[6px]">
            <p
              className="Jakarta text-[15px] text-black lg:text-[14px]"
              style={{
                fontWeight: 550,
                opacity: 1,
                textShadow: "0 0 0.1px #111111",
              }}
            >
              {project.developer}
            </p>
          </div>
        </div>

        <hr className="mt-[18px] w-full border-[#00000080] lg:mt-[12px]" />

        <p
          className="Jakarta mt-[14px] text-[16px] text-black lg:mt-[10px] lg:text-[14px]"
          style={{
            fontWeight: 550,
            opacity: 1,
            textShadow: "0 0 0.1px #111111",
          }}
        >
          Handover in {project.completion_date}
        </p>

        <div className="Jakarta mt-[18px] flex h-[40px] w-full items-center justify-center rounded-[10.5px] bg-[#2B2B2B] px-[18px] text-[16px] font-semibold text-white shadow-[0_10px_22px_rgba(43,43,43,0.16)] transition-all duration-300 hover:bg-[#242424] lg:mt-[12px] lg:h-[36px] lg:px-[14px] lg:text-[14px]">
          From {formatCompactPrice(project.starting_price)}
        </div>
      </Link>
    </Card>
  );
}