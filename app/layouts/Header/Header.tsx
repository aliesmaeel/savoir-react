import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function Header() {
  const icon = useIcons();
  return (
    <div
      className="flex items-center justify-between w-full px-[45px] py-[19px] 
      bg-[#0000005e] backdrop-blur-[10px] fixed top-0 z-30 
      shadow-[0_4px_54px_0_rgba(0,0,0,0.15),0_31.242px_62.484px_-15.621px_rgba(143,144,188,0.15)]"
    >
      <img src={icon.logo} alt="" className="w-[141px]" />
      <img src={icon.menu} alt="" className="w-[43px]" />
    </div>
  );
}
