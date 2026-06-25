import React from "react";
import Card from "~/UI/Card";

export default function CareerCreativity() {
  return (
    <Card className="mx-auto !max-w-[1080px] overflow-hidden !rounded-[22px] border border-[#e9dfcf] px-[16px] py-[20px] shadow-[0_16px_42px_rgba(17,17,17,0.07)] lg:px-[30px] lg:py-[28px]">
      <div className="grid w-full grid-cols-1 items-start gap-[24px] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[34px]">
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
              Innovation and Creativity
            </p>
          </div>

          <p
            className="max-w-[650px] text-[14px] leading-[175%] lg:text-[18px]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            At SAVOIR, we embrace innovation and forward-thinking.
            <br />
            Our commitment to introducing new ideas, unconventional strategies,
            and advanced technologies sets us apart.
            <br />
            Joining us means being part of an environment that fosters
            creativity and encourages thinking out of the box.
          </p>

          <a
            href="https://www.leadingre.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[40px] items-center justify-center rounded-[8px] bg-[#111111] px-[22px] text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(17,17,17,0.16)] transition-all duration-300 hover:bg-[#000000] lg:h-[42px] lg:px-[28px] lg:text-[15px]"
          >
            About our affiliates
          </a>
        </div>

        <div className="w-full overflow-hidden rounded-[20px] shadow-[0_16px_36px_rgba(17,17,17,0.07)] lg:w-[360px] lg:justify-self-end">
          <img
            loading="lazy"
            src="/images/Career/Innovationandcreativity.jpg"
            alt=""
            className="aspect-[396/336] w-full rounded-[20px] object-cover"
          />
        </div>
      </div>
    </Card>
  );
}