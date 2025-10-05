import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";

type props = {
  project: any;
};

export default function OffPlanCard({ project }: props) {
  const icon = useIcons();
  return (
    <Card className="!rounded-[46.534px]">
      <Link to={`/off-plan/${project.id}`} className="block px-[23px] pt-[27px] pb-[30px] w-full">
        <img
          src={project.image}
          alt=""
          className="w-full aspect-[375/277] rounded-[10px] object-cover"
        />
        <p className="text-[#C6A45A] text-[15px] font-semibold max-w-[319px] mt-[21px]">
          {project.title}
        </p>
        <div className="flex flex-col items-start gap-[11px] mt-[11px]">
          <div className="flex items-center gap-[7px]">
            <img src={icon.locationBlack} alt="" className="w-[30px]" />
            <p className="text-[22px] font-medium">{project.location}</p>
          </div>
          <div className="flex items-center gap-[7px]">
            <img src={icon.maintain} alt="" className="w-[30px]" />
            <p className="text-[22px] font-medium">Meraas</p>
          </div>
        </div>
        <hr className="w-full border-[#00000080] mt-[23px]" />
        <p className="text-[#666] text-[22px] mt-[21px]">Handover in Q1 2029</p>
        <Button className="w-full text-[21px] !py-[6px] h-[45px] mt-[24px]">From AED 45 M</Button>
      </Link>
    </Card>
  );
}
