import React from "react";

export default function PopularLocation() {
  return (
    <div className="flex flex-col items-start gap-[17px] w-full mt-[67px]">
      <p className="text-black text-[27px]">The Location</p>
      <img
        src="/images/placeholders/map.webp"
        alt=""
        className="w-full aspect-[1333/558] rounded-[15px] object-cover"
      />
      <iframe
        src="https://www.youtube.com/embed/VtwwDG5GNFg?si=dYLQoNfgh65JfO7O"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        className="w-full aspect-[1333/558] rounded-[15px] mt-[100px]"
      ></iframe>
    </div>
  );
}
