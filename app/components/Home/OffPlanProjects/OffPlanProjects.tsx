import React from "react";
import Card from "~/UI/Card";
import OffPlanProjectsSwiper from "./OffPlanProjectsSwiper";
import Title from "~/UI/Title";

export default function OffPlanProjects() {
  return (
    <Card>
      <div className="flex flex-col items-center gap-[30px] w-full pt-[33px] pb-[36px] ">
        <Title className="text-[30px]">EXPLORE RECENT OFF PLAN PROJECTS</Title>
        <OffPlanProjectsSwiper />
      </div>
    </Card>
  );
}
