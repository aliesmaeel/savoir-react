import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function FooterContactUs() {
  const icon = useIcons();
  return (
    <div className="flex flex-col items-start gap-[8px] lg:gap-[20px] w-full max-w-[272px]">
      <p className="text-[#C6A45A]  text-[14px] lg:text-[24px] font-semibold">Contact Us</p>
      <div className="flex flex-col items-start gap-[20px] lg:gap-[27px] w-full">
        <Link to={`tel:+71505074686`} className="flex items-center gap-[10px]">
          <img loading="lazy" src={icon.phoneGold} alt="" className="w-[16px] lg:w-[18px]" />
          <p className="text-[16px] lg:text-[18px] underline">971505074686</p>
        </Link>
        <Link to={`mailto:info@saviorproperties.com`} className="flex items-center gap-[10px]">
          <img loading="lazy" src={icon.emailGold} alt="" className="w-[16px] lg:w-[18px]" />
          <p className="text-[16px] lg:text-[18px]">info@saviorproperties.com</p>
        </Link>
      </div>
    </div>
  );
}
