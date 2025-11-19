import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "~/UI/Button";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";

export default function CareerFamilyCenter() {
  const icon = useIcons();

  const items = [
    "Savoir : A comprehensive 4-month practical education program for new agents, supplemented by ongoing accountability coaching.",
    "Consistent Engagement: Weekly sessions featuring agent-driven training  and management-led sales meetings to keep everyone informed and  motivated.",
    "Executive Mentorship: Personalized one-on-one coaching to help agents streamline their business and achieve their goals.",
  ];

  return (
    <Card className="!rounded-[15px] lg:!rounded-[67px] py-[30px] lg:py-[59px] px-[16px] lg:px-[45px]">
      <div className="flex flex-col items-start gap-[34px] w-full">
        <GoldTitle> Family Centric Culture</GoldTitle>
        <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
          Unlike larger corporations, we cherish the intimacy of a family-centric culture. We
          believe in the power of personal connections, and our team is more than just colleagues –
          we are a closely-knit family that supports each other's growth and success .
        </p>
        <div className="flex flex-col lg:flex-row items-center gap-[52px] w-full">
          <div className="flex flex-col items-start gap-[11px] lg:gap-[37px] w-full">
            {items.map((item: string, index: number) => (
              <div className="flex items-start gap-[18px] w-full">
                <img loading="lazy" src={icon.dotGold} alt="" />
                <p className="text-black text-[12px] lg:text-[19px] leading-[192%]">{item}</p>
              </div>
            ))}
          </div>
          <img
            loading="lazy"
            src="/images/placeholders/CareerFamilyCenter.png"
            alt=""
            className="w-[576px] aspect-[576/336] object-cover"
          />
        </div>
        <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
          Additionally, we conduct bi-weekly company-wide training sessions covering a range of
          topics, from real estate-specific knowledge to social media and marketing, often featuring
          keynote speakers. Join us and stay ahead of the curve!
        </p>
        <a href="/our-team"
        style={{ background: 'linear-gradient(94deg, #C6A45A 3.17%, rgba(255, 255, 255, 0.60) 224.54%)' }}
        className="!rounded-[4px] text-white !py-[9px] !px-[81px] text-[18px] h-[44px]">
          Meet Our Team
        </a>
      </div>
    </Card>
  );
}
