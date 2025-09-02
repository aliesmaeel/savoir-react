import React from "react";
import FooterAbout from "./FooterAbout";
import FooterLatestListings from "./FooterLatestListings";
import FooterUsefulLinks from "./FooterUsefulLinks";
import FooterContactUs from "./FooterContactUs";
import { Link } from "react-router";

export default function Footer() {
  return (
    <div className="flex flex-col items-start w-full px-[30px] bg-[#ffffff3d] backdrop-blur-[9px]">
      <div className="flex items-start gap-[30px] w-full pb-[60px] max-w-[1226px] mx-auto">
        <FooterAbout />
        <FooterLatestListings />
        <FooterUsefulLinks />
        <FooterContactUs />
      </div>
      <hr className="w-full border-[#353635] max-w-[1226px] mx-auto" />
      <div className="flex items-center justify-between w-full py-[27px] max-w-[1226px] mx-auto">
        <p className="text-[18px]">2024 | Savoir Properties</p>
        <Link to={`#`} className="text-[18px] underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
