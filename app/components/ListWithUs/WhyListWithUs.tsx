import React from "react";
import Card from "~/UI/Card";

export default function WhyListWithUs() {
  const items = [
    {
      title: "Unmatched expertise",
      text: "40+ years of combined founder experience in Dubai. 100+ years across the Savoir team. The depth behind every property recommendation, pricing decision, and negotiation we undertake on your behalf.",
    },
    {
      title: "Multilingual reach",
      text: "We speak English, Arabic, French, Spanish, Italian, Russian, Bulgarian, Romanian, Hindi, and Urdu — serving the full international spectrum of buyers actively looking for luxury property in Dubai, UAE.",
    },
    {
      title: "Award-winning reputation",
      text: "Recognised as an award-winning Dubai real estate agency and exclusive GCC representative of the World's Best Property 2024–2025 — a credibility that elevates every listing we carry.",
    },
    {
      title: "Global platform",
      text: "Through LeadingRE and Luxury Portfolio International®, your Dubai property is placed before 4 million+ affluent buyers in 70+ countries via the world's most prestigious media channels.",
    },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-[34px]">
      <p className="CormorantGaramond text-center text-[28px] leading-[1.05] text-[#000000] lg:text-[44px]">
        Why List With Us ?
      </p>

      <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-[22px] lg:grid-cols-2">
        {items.map((item, index) => (
          <Card
            key={index}
            className="
              group
              relative
              overflow-hidden
              !rounded-[22px]
              !bg-white
              border
              border-[#E9DFC9]
              px-[18px]
              py-[20px]
              lg:px-[26px]
              lg:py-[24px]
              shadow-[0_12px_36px_rgba(17,17,17,0.055)]
              transition-all
              duration-300
              hover:-translate-y-[2px]
              hover:border-[#D7BE78]
              hover:shadow-[0_20px_52px_rgba(17,17,17,0.09)]
            "
            style={{
              background: "#FFFFFF",
              opacity: 1,
            }}
          >
            <div className="relative flex min-h-[150px] w-full flex-col items-start justify-center gap-[14px] lg:min-h-[165px]">
              <div
                className="
                  flex w-full items-center border-l-[3px] border-[#111111]
                  px-[14px] py-[9px]
                  lg:px-[16px] lg:py-[10px]
                "
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)",
                }}
              >
                <h3
                  className="CormorantGaramond text-[21px] leading-[1.18] lg:text-[28px]"
                  style={{
                    color: "#111111",
                    fontWeight: 700,
                    opacity: 1,
                  }}
                >
                  {item.title}
                </h3>
              </div>

              <p
                className="text-[15px] leading-[175%] lg:text-[17px]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                {item.text}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
