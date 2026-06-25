import React from "react";
import { useLoaderData } from "react-router";

export default function PopularLocation() {
  const { area } = useLoaderData() as { area: any };

  return (
    <div className="flex flex-col items-start gap-[17px] w-full mt-[67px]">
      <p className="text-black text-[27px]">The Location</p>
      <div
        className="w-full aspect-[1333/558] rounded-[15px] object-cover"
        dangerouslySetInnerHTML={{ __html: area.location }}
      />
      <div
        className="w-full aspect-[1333/558] rounded-[15px] object-cover"
        dangerouslySetInnerHTML={{ __html: area.youtube }}
      />
    </div>
  );
}
