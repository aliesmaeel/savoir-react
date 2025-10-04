import path from "path";
import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function FooterAbout() {
  const icon = useIcons();

  const icons = [
    {
      icon: icon.facebookFooter,
      path: "#",
    },
    {
      icon: icon.instagramFooter,
      path: "#",
    },
    {
      icon: icon.twitterFooter,
      path: "#",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[23px] lg:gap-[30px] w-full max-w-[456px]">
      <img src={icon.logoFooter} alt="" className="w-[183px] brightness-[0.7]" />
      <p className="text-[13px] lg:text-[18.7px] leading-[200%]">
        Savoir Properties is committed to delivering a high level of expertise, customer service,
        and attention to detail to the marketing and sales of luxury real estate and rental
        properties <span className="text-[#C6A45A] font-semibold underline">Read More</span>
      </p>
      <div className="flex items-center w-full rounded-full border border-[#C6A45A] bg-[#ebebeb] h-[39px] lg:h-[54px] overflow-hidden">
        <input
          type="text"
          className="border-0 outline-0 px-[16px] lg:px-[22px] py-[11px] lg:py-[15px] text-[14px] lg:text-[16px] w-full"
          placeholder="Your email"
        />
        <button className="py-[11px] lg:py-[15px] pr-[7px] lg:pr-[10px] pl-[13px] lg:pl-[18px] bg-[#C6A45A]  h-[39px] lg:h-[54px]">
          <p className="text-[14px] lg:text-[16px]">Subscribe</p>
        </button>
      </div>
      <div className="flex items-center gap-[14px] lg:gap-[19px]">
        {icons.map((icon: any, index: number) => (
          <Link key={index} to={icon.path}>
            <img src={icon.icon} alt="" className="w-[35px] lg:w-[48px]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
