import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";

export default function ListGlobalPartners() {
  const icon = useIcons();

  const items = [
    {
      icon: icon.leading,
      text: "As a cornerstone of the  global real estate landscape, LeadingRE shapes industry standards,  fosters innovation, and facilitates cross-border collaboration. Bringing together top real estate professionals worldwide, LeadingRE serves as a vital conduit for sharing information and promoting excellence beyond  geographical confines.",
      image: "/images/placeholders/CareerFamilyCenter.png",
      link: "#",
    },
    {
      icon: icon.luxuryPortfolio,
      text: "Luxury Portfolio, the  premium arm of Leading Real Estate Companies of the World®️, empowers  agents to provide exclusive access, insights, and refined guidance to  discerning global clientele. Through our direct association, our  top-performing agents gain access to invaluable information, giving  clients a competitive edge in the market and facilitating connections  with fellow successful Realtors.",
      image: "/images/placeholders/CareerFamilyCenter.png",
      link: "#",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-[46px] w-full mt-[108px]">
      <p className="text-black text-[20px] lg:text-[42px] font-medium">Why List With Us ?</p>
      <div className="flex flex-col items-start gap-[52px] w-full">
        {items.map((item: any, index: number) => (
          <Card key={index} className="!rounded-[15px] lg:!rounded-[67.5px] w-full group">
            <div className="flex flex-col lg:flex-row items-center gap-[35px] w-full px-[37px] py-[48px] group-even:lg:flex-row-reverse">
              <div className="flex flex-col items-start gap-[24px] w-full">
                <div className="flex flex-col items-start gap-[13px] w-full">
                  <img src={item.icon} alt="" />
                  <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
                    {item.text}
                  </p>
                </div>
                <Link to={item.link}>
                  <Button className="!rounded-[4px] !py-[15px] lg:!px-[81px] text-[18px] h-[44px]">
                    visit the site
                  </Button>
                </Link>
              </div>
              <img src={item.image} alt="" className="w-full max-w-[539px]" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
