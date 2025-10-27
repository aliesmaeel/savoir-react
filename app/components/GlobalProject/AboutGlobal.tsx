import React from "react";
import { useLoaderData } from "react-router";
import GoldTitle from "~/UI/GoldTitle";

export default function AboutGlobal() {
  const { global, country } = useLoaderData() as { global: any; country: string };

  return (
    <div className="flex flex-col items-start gap-[33px] w-full">
      <GoldTitle className="!text-[34px] capitalize">About {country}</GoldTitle>
      <p className="text-[15px] lg:text-[27px] ">{global.project.description}</p>
    </div>
  );
}
