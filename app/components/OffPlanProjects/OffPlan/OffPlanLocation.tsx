import React from "react";
import { useLoaderData } from "react-router";

export default function OffPlanLocation() {
  const { property } = useLoaderData() as { property: any };

  if (!property.map_link) {
    return null;
  }

  return (
    <div className="mt-[67px] flex w-full flex-col items-start gap-[17px]">
      <p className="CormorantGaramond text-[28px] font-[900] leading-[1.08] text-[#050505] [text-shadow:0_0_0.45px_#050505] lg:text-[34px]">
        The Location
      </p>

      {property.location && (
        <p
          className="text-[16px]"
          style={{
            color: "#111111",
            fontWeight: 700,
            opacity: 1,
          }}
        >
          {property.location}
        </p>
      )}

      <div
        className="aspect-[794/464] w-full overflow-hidden rounded-[15px]"
        dangerouslySetInnerHTML={{ __html: property.map_link }}
      />
    </div>
  );
}
