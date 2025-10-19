import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function PropertiesSearch() {
  const icon = useIcons();
  return (
    <div className="flex items-center gap-[9px] lg:gap-[18px] w-full rounded-full px-[27px] lg:px-[50px] py-[11px] lg:py-[20px] border border-[#C6A45A] bg-[#f2f2f2] h-[42px] lg:h-[79px]">
      <img loading="lazy" src={icon.propertiesSearch} alt="" className="w-[20px] lg:w-[38px]" />
      <input
        type="text"
        placeholder="Search here"
        className="border-0 outline-0 text-[#353635] text-[16px] lg:text-[23px] "
      />
    </div>
  );
}
