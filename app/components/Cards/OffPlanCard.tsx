import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";
import { formatPrice } from "~/utils/formatPrice";

type props = {
  project: any;
};

export default function OffPlanCard({ project }: props) {
  const icon = useIcons();

  return (
    <Card className="w-full max-w-[390px] !bg-white !shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      <Link
        to={`/off-plan/${project.slug}`}
        className="block w-full px-[18px] pb-[20px] pt-[16px]"
      >
        <div className="relative w-full">
          <img
            loading="lazy"
            src={project.image}
            alt=""
            className="w-full aspect-[386/238] rounded-[10px] object-cover"
          />

          {/* Updated Off-plan Badge */}
          <span className="Jakarta absolute left-[14px] top-[14px] rounded-[7px] bg-black px-[13px] py-[7px] text-[14px] font-semibold leading-none text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
            Off-plan
          </span>
        </div>

        <p className="CormorantGaramond mt-[14px] max-w-[319px] text-[19px] font-semibold leading-[1.25] text-black">
          {project.title}
        </p>

        <div className="mt-[10px] flex flex-col items-start gap-[8px]">
          <div className="flex items-center gap-[6px]">
            <img
              loading="lazy"
              src={icon.locationBlack}
              alt=""
              className="w-[20px]"
            />
            <p className="Jakarta text-[15px] font-medium text-black">
              {project.location}
            </p>
          </div>

          <div className="flex items-center gap-[6px]">
            <p className="Jakarta text-[15px] font-medium text-black">
              {project.developer}
            </p>
          </div>
        </div> 

        <hr className="mt-[18px] w-full border-[#00000080]" />

        <p className="Jakarta mt-[14px] text-[16px] font-medium text-black">
          Handover in {project.completion_date}
        </p>

        <div className="Jakarta mt-[18px] flex h-[40px] w-full items-center justify-center rounded-[10.5px] bg-[#111111] px-[18px] text-[16px] font-semibold text-white shadow-[0_10px_22px_rgba(17,17,17,0.16)]">
          From {formatPrice(project.starting_price)}
        </div>
      </Link>
    </Card>
  );
}
