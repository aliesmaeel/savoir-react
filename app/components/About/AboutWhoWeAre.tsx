import React from "react";
import Header from "~/UI/Header";

export default function AboutWhoWeAre() {
  return (
    <div className="flex w-full flex-col items-start gap-[12px]">
      <style>
        {`
          .about-who-heading-black,
          .about-who-heading-black *,
          .about-who-heading-black p,
          .about-who-heading-black span,
          .about-who-heading-black h1,
          .about-who-heading-black h2 {
            color: #111111 !important;
            -webkit-text-fill-color: #111111 !important;
            opacity: 1 !important;
          }

          .about-who-heading-black *::before,
          .about-who-heading-black *::after {
            background: #111111 !important;
            border-color: #111111 !important;
          }
        `}
      </style>

      <div className="about-who-heading-black">
        <Header className="text-[28px] leading-[1.05] lg:text-[44px]">
          Who We Are
        </Header>
      </div>

      <p
        className="text-[14px] leading-[175%] tracking-[0.01em] lg:text-[17px]"
        style={{
          color: "#111111",
          fontWeight: 600,
          opacity: 1,
        }}
      >
        Savoir Privé Properties is a boutique luxury real estate agency based in
        Dubai, UAE. At our core, we are a family business built on an
        extraordinary foundation of expertise. Our founders arrived in the
        Emirates 26 years ago and have made Dubai their permanent home ever
        since. Each brings over 20 years of Dubai real estate experience to
        Savoir, creating a combined 40 years of on-the-ground market knowledge
        between them alone.
        <br />
        <br />
        Four years ago, they channelled that lifetime of expertise into founding
        Savoir Privé Properties. They were joined by a team of equally committed
        professionals who are multilingual, internationally experienced, and
        deeply invested in the UAE. Together, the collective expertise within
        Savoir exceeds 100 years, spanning Dubai and real estate markets across
        the globe.
        <br />
        <br />
        As proud members of Leading Real Estate Companies of the World® and
        Luxury Portfolio International®, we combine unrivalled market knowledge
        with the reach of one of the world's most powerful real estate networks.
        This allows us to offer every client an experience that is personally
        attentive, globally connected, and shaped around their goals.
      </p>
    </div>
  );
}