import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function PropertiesSearch() {
  const icon = useIcons();
  return (
    <div className="flex items-center gap-[18px] w-full rounded-full px-[50px] py-[20px] border border-[#C6A45A] bg-[#f2f2f2] h-[79px]">
      <img src={icon.propertiesSearch} alt="" />
      <input
        type="text"
        placeholder="Search here"
        className="border-0 outline-0 text-[#353635] text-[23px] "
      />
    </div>
  );
}
