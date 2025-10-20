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
        <div
          className="flex flex-col items-center gap-[17px] w-full pt-[27px] pb-[20px] p-[16px] lg:p-[60px] border-l-[8px] border-[#C6A45A] mt-[108px]"
          style={{
            background:
              "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(240, 232, 214, 1) 50%, rgba(255, 255, 255, 0) 100%)",
          }}
        >
          <p className=" text-[15px] lg:text-[31px] text-center leading-[176.19%]">
            “To be successful in real estate, you must always and consistently put your clients’
            best interests first. When you do, your personal needs will be realized beyond your
            greatest expectations.”
          </p>
          <p className="text-[15px] lg:text-[31px] font-semibold">Anthony Hitt</p>
        </div>
        <DontMissBeat />
      </PageLayout>
    </div>
  );
}
