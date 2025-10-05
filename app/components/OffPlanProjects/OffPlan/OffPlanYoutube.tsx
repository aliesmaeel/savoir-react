import React from "react";

export default function OffPlanYoutube() {
  return (
    <div className="flex flex-col items-start gap-[17px] w-full mt-[67px]">
      <p className="text-black text-[27px]">Watch this video</p>

      <iframe
        src="https://www.youtube.com/embed/mQL_oDITgx4?si=fe-0SjZ1dWKZ18s0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        className="w-full aspect-[794/464] rounded-[15px] object-cover"
      ></iframe>
    </div>
  );
}
