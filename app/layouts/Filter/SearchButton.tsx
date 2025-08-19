import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function SearchButton() {
  const icon = useIcons();
  return (
    <button className="flex items-center gap-[13px] rounded-[15px] bg-[#C6A45A] px-[20px] py-[9px] w-[234px] h-[56px]">
      <img src={icon.seachWhite} alt="" className="w-[18px]" />
      <p className="text-white text-[22.217px]">Search</p>
    </button>
  );
}
