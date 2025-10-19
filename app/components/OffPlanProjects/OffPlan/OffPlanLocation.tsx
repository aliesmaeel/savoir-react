import React from "react";

export default function OffPlanLocation() {
  return (
    <div className="flex flex-col items-start gap-[17px] w-full mt-[67px]">
      <p className="text-black text-[27px]">The Location</p>
      <img
        loading="lazy"
        src="/images/placeholders/map.webp"
        alt=""
        className="w-full aspect-[794/464] rounded-[15px] object-cover"
      />
    </div>
  );
}
