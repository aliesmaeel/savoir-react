import React from "react";
import Card from "~/UI/Card";

export default function CareerEnduringLegacy() {
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
              Enduring Legacy
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
            With a decades-long legacy and a proven track record of billions of
            dollars in real estate transactions, SAVOIR is more than just a
            workplace; it is a testament to long-term success.
            <br />
            Every member of our team is a part of our success, contributing to
            our brand story of excellence in premium real estate services.
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-[20px] shadow-[0_16px_36px_rgba(17,17,17,0.07)] lg:w-[360px] lg:justify-self-end">
          <div className="flex w-full flex-col gap-[8px]">
            <img
              loading="lazy"
              src="/images/Career/legacy1.jpg"
              alt=""
              className="aspect-[502/200] w-full rounded-[14px] object-cover object-[center_42%]"
              style={{
                imageRendering: "auto",
                filter: "none",
                transform: "none",
              }}
            />

            <div className="flex w-full gap-[8px]">
              <img
                loading="lazy"
                src="/images/Career/legacy2.jpg"
                alt=""
                className="aspect-[251/185] w-[49%] flex-1 rounded-[14px] object-cover object-[center_48%]"
                style={{
                  imageRendering: "auto",
                  filter: "none",
                  transform: "none",
                }}
              />

              <img
                loading="lazy"
                src="/images/Career/legacy3-img4916.jpg"
                alt=""
                className="aspect-[251/185] w-[49%] flex-1 rounded-[14px] object-cover object-[center_58%]"
                style={{
                  imageRendering: "auto",
                  filter: "none",
                  transform: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}