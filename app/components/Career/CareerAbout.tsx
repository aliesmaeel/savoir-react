import React from "react";
import Header from "~/UI/Header";

export default function CareerAbout() {
  return (
    <div className="flex w-full flex-col items-start gap-[14px]">
      <div className="career-about-heading-black">
        <Header className="text-[28px] leading-[1.05] lg:text-[44px]">
          We're Local, We're Global
        </Header>
      </div>

      <p
        className="text-[14px] leading-[185%] lg:text-[20px]"
        style={{
          color: "#111111",
          fontWeight: 600,
          opacity: 1,
        }}
      >
        At Savoir Privé, we are more than a real estate agency. We are a
        close-knit family, united by a shared love for Dubai and a shared
        commitment to excellence. Our founders each bring over 20 years of UAE
        real estate experience to the team they have built. A combined 40 years
        of Dubai market mastery that informs every decision, every
        recommendation, and every training session at Savoir.
        <br />
        <br className="hidden lg:block" />
        Surround yourself with the best. Our team collectively brings over 100
        years of real estate expertise, speaks ten languages, and draws on
        experience from markets across the globe, all from our base on Sheikh
        Zayed Road, Dubai. As proud members of Leading Real Estate Companies of
        the World®, we also offer our agents the global exposure, world-class
        tools, and international network of the most respected real estate
        organisation on the planet.
      </p>

      <style>
        {`
          .career-about-heading-black,
          .career-about-heading-black *,
          .career-about-heading-black p,
          .career-about-heading-black span,
          .career-about-heading-black h1,
          .career-about-heading-black h2 {
            color: #111111 !important;
            -webkit-text-fill-color: #111111 !important;
            opacity: 1 !important;
          }

          .career-about-heading-black *::before,
          .career-about-heading-black *::after {
            background: #111111 !important;
            border-color: #111111 !important;
          }
        `}
      </style>
    </div>
  );
}