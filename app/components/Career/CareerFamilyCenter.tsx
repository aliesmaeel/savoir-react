import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";

export default function CareerFamilyCenter() {
  const icon = useIcons();

  const items = [
    "Savoir: A comprehensive 4-month practical education program for new agents, supplemented by ongoing accountability coaching.",
    "Consistent Engagement: Weekly sessions featuring agent-driven training and management-led sales meetings to keep everyone informed and motivated.",
    "Executive Mentorship: Personalized one-on-one coaching to help agents streamline their business and achieve their goals.",
  ];

  return (
    <Card className="mx-auto !max-w-[1080px] overflow-hidden !rounded-[22px] border border-[#e9dfcf] px-[16px] py-[20px] shadow-[0_16px_42px_rgba(17,17,17,0.07)] lg:px-[30px] lg:py-[28px]">
      <div className="flex w-full flex-col items-start gap-[22px]">
        <div
          className="flex w-full items-center border-l-[3px] border-[#111111] px-[14px] py-[12px] lg:px-[18px] lg:py-[15px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)",
          }}
        >
          <p
            className="CormorantGaramond text-[20px] leading-[1.12] lg:text-[30px]"
            style={{
              color: "#111111",
              fontWeight: 700,
              opacity: 1,
            }}
          >
            Family Centric Culture
          </p>
        </div>

        <p
          className="text-[14px] leading-[175%] lg:text-[18px]"
          style={{
            color: "#111111",
            fontWeight: 600,
            opacity: 1,
          }}
        >
          Unlike larger corporations, we cherish the intimacy of a
          family-centric culture. We believe in the power of personal
          connections, and our team is more than just colleagues; we are a
          closely-knit family that supports each other's growth and success.
        </p>

        <div className="grid w-full grid-cols-1 items-start gap-[24px] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[34px]">
          <div className="flex w-full flex-col items-start gap-[14px] lg:gap-[18px]">
            {items.map((item: string, index: number) => (
              <div key={index} className="flex w-full items-start gap-[14px]">
                <span className="mt-[11px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#111111]" />

                <p
                  className="text-[13px] leading-[180%] lg:text-[18px]"
                  style={{
                    color: "#111111",
                    fontWeight: 600,
                    opacity: 1,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="w-full overflow-hidden rounded-[20px] bg-white shadow-[0_16px_36px_rgba(17,17,17,0.07)] lg:w-[360px] lg:justify-self-end">
            <img
              loading="lazy"
              src="/images/Career/Familycentric.jpeg"
              alt=""
              className="h-[230px] w-full rounded-[20px] object-cover object-center lg:h-[250px]"
              style={{
                imageRendering: "auto",
                transform: "translateZ(0)",
                filter: "none",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        </div>

        <p
          className="text-[14px] leading-[175%] lg:text-[18px]"
          style={{
            color: "#111111",
            fontWeight: 600,
            opacity: 1,
          }}
        >
          Additionally, we conduct bi-weekly company-wide training sessions
          covering a range of topics, from real estate-specific knowledge to
          social media and marketing, often featuring keynote speakers. Join us
          and stay ahead of the curve.
        </p>

        <a
          href="/our-team"
          className="flex h-[40px] items-center justify-center rounded-[8px] border-none bg-[#2B2B2B] px-[22px] text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(43,43,43,0.16)] transition-all duration-300 hover:bg-[#242424] lg:h-[42px] lg:px-[28px] lg:text-[15px]"
        >
          Meet Our Team
        </a>
      </div>
    </Card>
  );
}