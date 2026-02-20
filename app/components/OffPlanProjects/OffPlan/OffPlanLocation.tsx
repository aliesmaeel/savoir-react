import React from "react";
import { useLoaderData } from "react-router";

export default function OffPlanLocation() {
  const { property } = useLoaderData() as { property: any };

  if (!property.map_link) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-[17px] w-full mt-[67px]">
      <p className="text-[21px] font-semibold">The Location</p>
      {property.location && (
        <p className="text-[#505050] text-[16px] font-medium">{property.location}</p>
      )}
      <div
        className="w-full aspect-[794/464] rounded-[15px] overflow-hidden"
        dangerouslySetInnerHTML={{ __html: property.map_link }}
      />
    </div>
  );
}
