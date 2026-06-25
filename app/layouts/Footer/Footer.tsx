import React from "react";
import FooterAbout from "./FooterAbout";
import FooterLatestListings from "./FooterLatestListings";
import FooterUsefulLinks from "./FooterUsefulLinks";
import FooterContactUs from "./FooterContactUs";
import { Link } from "react-router";

export default function Footer() {
  return (
    <div className="flex flex-col items-start w-full px-[16px] lg:px-[30px] bg-[#ffffff3d] text-black backdrop-blur-[9px]">
      <div className="flex flex-col lg:flex-row items-start gap-[30px] w-full pb-[36px] lg:pb-[60px] max-w-[1226px] mx-auto">
        <FooterAbout />
        <FooterLatestListings />
        <FooterUsefulLinks />
        <FooterContactUs />
      </div>

      <hr className="w-full border-[#353635] max-w-[1226px] mx-auto" />

      <div className="flex items-center justify-between w-full py-[21px] lg:py-[27px] max-w-[1226px] mx-auto">
        <p
          className="Jakarta text-[14px] lg:text-[10px] uppercase tracking-[0.18em]"
          style={{
            color: "#000000",
            fontWeight: 700,
            opacity: 1,
          }}
        >
          2026 | SAVOIR
        </p>

        <Link
          to="/privacy-policy"
          className="Jakarta text-[14px] lg:text-[10px] uppercase tracking-[0.18em] underline"
          style={{
            color: "#000000",
            fontWeight: 700,
            opacity: 1,
          }}
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}