import React from "react";
import AboutCoreValues from "~/components/About/AboutCoreValues";
import AboutHero from "~/components/About/AboutHero";
import AboutWhoWeAre from "~/components/About/AboutWhoWeAre";
import PageLayout from "~/layouts/PageLayout";
import DontMissBeat from "~/UI/DontMissBeat";

export default function aboutUs() {
  return (
    <div>
      <AboutHero />

      <PageLayout>
        <AboutWhoWeAre />
        <AboutCoreValues />

        <div className="mt-[88px] flex w-full justify-center px-[16px] lg:px-[42px]">
          <section className="relative w-full max-w-[1320px] bg-white px-[22px] py-[36px] lg:px-[72px] lg:py-[58px]">
            <h2
              className="relative mb-[22px] text-center text-[28px] leading-[1.05] lg:mb-[28px] lg:text-[44px]"
              style={{
                color: "#111111",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              We're Local, We're Global
            </h2>

            <div
              className="relative mx-auto flex w-full max-w-[1120px] flex-col items-center gap-[20px] border-l-[4px] border-[#111111] px-[18px] py-[26px] lg:gap-[24px] lg:px-[34px] lg:py-[34px]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(17,17,17,0.07) 0%, rgba(255,255,255,0) 76%)",
              }}
            >
              <p
                className="max-w-[1020px] text-center text-[17px] leading-[180%] lg:text-[31px]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                "To be successful in real estate, you must always and
                consistently put your clients' best interests first. When you
                do, your personal needs will be realised beyond your greatest
                expectations."
              </p>

              <div className="flex flex-col items-center gap-[4px]">
                <p
                  className="text-center text-[21px] lg:text-[38px]"
                  style={{
                    color: "#111111",
                    fontWeight: 700,
                    opacity: 1,
                  }}
                >
                  Anthony Hitt
                </p>
              </div>
            </div>
          </section>
        </div>

        <DontMissBeat />
      </PageLayout>
    </div>
  );
}