import React from "react";
import { Link } from "react-router";

export default function FooterLatestListings() {
  const items = [
    {
      title: "Stunning Palm Views | Upgraded",
      image: "/images/placeholders/properties.webp",
      prise: "$24.000",
    },
    {
      title: "Stunning Palm Views | Upgraded",
      image: "/images/placeholders/properties.webp",
      prise: "$24.000",
    },
    {
      title: "Stunning Palm Views | Upgraded",
      image: "/images/placeholders/properties.webp",
      prise: "$24.000",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[8px] lg:gap-[20px] w-full max-w-[315px]">
      <p className="text-[#C6A45A] text-[14px] lg:text-[24px] font-semibold">LATEST LISTINGS</p>
      <div className="flex flex-col items-start gap-[18px] lg:gap-[30px] w-full">
        {items.map((item: any, index: number) => (
          <Link to={`/projects/1`} key={index} className="flex items-center gap-[10px] w-full">
            <img
              src={item.image}
              alt=""
              className=" w-[57px] lg:w-[99px] h-[49px] lg:h-[84px] rounded-[7px] lg:rounded-[12px] object-cover"
            />
            <div className="flex flex-col items-start gap-[6px] lg:gap-[11px] w-full">
              <p className="text-[11px] lg:text-[18px]">{item.title}</p>
              <p className="text-[#C6A45A] text-[10px] lg:text-[18px]">{item.prise}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
