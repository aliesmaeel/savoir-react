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
    <div className="flex flex-col items-start gap-[30px] w-full max-w-[456px]">
      <p className="text-[18.7px] leading-[200%]">
        Savoir Properties is committed to delivering a high level of expertise, customer service,
        and attention to detail to the marketing and sales of luxury real estate and rental
        properties <span className="text-[#C6A45A] font-semibold underline">Read More</span>
      </p>
      <div className="flex items-center w-full rounded-full border border-[#C6A45A] bg-[#ebebeb] h-[54px] overflow-hidden">
        <input
          type="text"
          className="border-0 outline-0 px-[22px] py-[15px] text-[16px] w-full"
          placeholder="Your email"
        />
        <button className="py-[15px] pr-[10px] pl-[18px] bg-[#C6A45A] h-[54px]">
          <p className="text-[16px]">Subscribe</p>
        </button>
      </div>
      <div className="flex items-center gap-[19px]">
        {icons.map((icon: any, index: number) => (
          <Link key={index} to={icon.path}>
            <img src={icon.icon} alt="" className="w-[48px]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
