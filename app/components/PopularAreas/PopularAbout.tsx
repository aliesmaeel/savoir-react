import React from "react";
import { useLoaderData } from "react-router";
import useArrow from "~/hooks/imageHooks/useArrow";
import Button from "~/UI/Button";
import Header from "~/UI/Header";

export default function PopularAbout() {
  const { area } = useLoaderData() as { area: any };
  const arrow = useArrow();
  return (
    <div className="flex flex-col items-start gap-[18px] w-full">
      <Header className="text-[28px] leading-[1.05] lg:text-[44px]">About {area.name}</Header>
      <div
        className="text-[14px] font-semibold leading-[160%] text-[#111111] lg:text-[18px]"
        dangerouslySetInnerHTML={{ __html: area.description }}
      ></div>
    </div>
  );
}
