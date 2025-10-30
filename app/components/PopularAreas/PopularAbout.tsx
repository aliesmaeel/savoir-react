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
      <Header className="text-[20px] lg:text-[34px]">About {area.name}</Header>
      <div
        className="text-[#353635] text-[15px] lg:text-[22px] leading-[233.333%]"
        dangerouslySetInnerHTML={{ __html: area.description }}
      ></div>
    </div>
  );
}
