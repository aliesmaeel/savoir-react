import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function SearchButton() {
  const icon = useIcons();
  return (
    <button className="flex items-center gap-[11.44px] rounded-[13.2px] bg-[#C6A45A] px-[17.6px] py-[7.92px] w-[205.92px] h-[49.28px]">
      <img src={icon.seachWhite} alt="" className="w-[15.84px]" />
      <p className="text-white text-[19.55px]">Search</p>
    </button>
  );
}
