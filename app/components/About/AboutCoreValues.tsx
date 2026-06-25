import React from "react";
import Header from "~/UI/Header";

export default function AboutCoreValues() {
  const items = [
    {
      title: "Unrivalled expertise",
      text: "Our founders each bring 20+ years of Dubai real estate experience — 40 years combined. With the full Savoir team, that collective knowledge exceeds 100 years of local and global expertise. This is the depth behind every recommendation we make.",
      image: "/images/about/Excellence.jpeg",
    },
    {
      title: "Truly multilingual service",
      text: "We speak your language — literally. English, Arabic, French, Spanish, Italian, Russian, Bulgarian, Romanian, Hindi, and Urdu. Ten languages, one team, one commitment: to serve every client with the fluency and cultural sensitivity they deserve.",
      image: "/images/about/passion.jpeg",
    },
    {
      title: "A family-centric culture",
      text: "Savoir was founded as a family business and carries that warmth through every client relationship. We are a close-knit team united by a shared love for Dubai, the UAE, and the people we serve. Personal connections define everything we do.",
      image: "/images/about/Trust.jpg",
    },
    {
      title: "Global reach from Dubai",
      text: "As members of LeadingRE and Luxury Portfolio International®, our Dubai-based team connects clients to 4,600+ offices across 70+ countries — with the personal attention of a boutique and the power of the world's finest real estate network.",
      image: "/images/about/Knowledge.jpeg",
    },
  ];

  return (
    <div className="mt-[70px] flex w-full flex-col items-start gap-[34px]">
      <style>
        {`
          .why-choose-heading-black,
          .why-choose-heading-black *,
          .why-choose-heading-black p,
          .why-choose-heading-black span,
          .why-choose-heading-black h1,
          .why-choose-heading-black h2 {
            color: #111111 !important;
            -webkit-text-fill-color: #111111 !important;
            opacity: 1 !important;
          }

          .why-choose-heading-black *::before,
          .why-choose-heading-black *::after {
            background: #111111 !important;
            border-color: #111111 !important;
          }
        `}
      </style>

      <div className="why-choose-heading-black">
        <Header className="text-[28px] leading-[1.05] lg:text-[44px]">
          Why Choose Us !
        </Header>
      </div>

      <div className="grid w-full grid-cols-1 gap-[24px] lg:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="
              rounded-[20px]
              bg-white
              border border-[#ECE7DD]
              px-[16px]
              py-[20px]
              lg:px-[24px]
              lg:py-[24px]
              shadow-[0_10px_35px_rgba(0,0,0,0.06)]
              hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]
              transition-all
              duration-300
            "
          >
            <div className="flex h-full flex-col items-start gap-[18px]">
              <div className="flex flex-col items-start gap-[12px]">
                <div
                  className="
                    flex w-full items-center border-l-[3px] border-[#111111]
                    px-[16px] py-[10px]
                    lg:px-[18px] lg:py-[12px]
                  "
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(17,17,17,0.08) 52%, rgba(255,255,255,0) 100%)",
                  }}
                >
                  <p
                    className="CormorantGaramond text-[18px] leading-[1.12] lg:text-[28px]"
                    style={{
                      color: "#111111",
                      fontWeight: 700,
                      opacity: 1,
                    }}
                  >
                    {item.title}
                  </p>
                </div>

                <p
                  className="text-[14px] leading-[175%] lg:text-[16px]"
                  style={{
                    color: "#111111",
                    fontWeight: 600,
                    opacity: 1,
                  }}
                >
                  {item.text}
                </p>
              </div>

              {item.image && (
                <img
                  loading="lazy"
                  src={item.image}
                  alt=""
                  className="
                    mt-auto
                    h-[200px]
                    w-full
                    rounded-[14px]
                    object-cover
                    lg:h-[230px]
                  "
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}