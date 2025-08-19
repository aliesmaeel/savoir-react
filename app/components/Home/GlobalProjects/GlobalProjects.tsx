import React from "react";
import { Link } from "react-router";
import useArrow from "~/hooks/imageHooks/useArrow";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import GlobalProjectsSwiper from "./GlobalProjectsSwiper";

export default function GlobalProjects() {
  const arrow = useArrow();
  return (
    <Card className="w-full max-w-[591px]">
      <div className="flex flex-col items-start gap-[39px] w-full pt-[33px] pb-[55px]">
        <div className="flex items-center justify-between w-full px-[33px]">
          <Title className="text-[34px]">Global Projects</Title>
          <Link to="#" className="flex items-center gap-[9px]">
            <p className="text-[18px] underline">See all</p>
            <img src={arrow.smallGold} alt="" />
          </Link>
        </div>
        <GlobalProjectsSwiper />
      </div>
    </Card>
  );
}
