import React from "react";
import FooterAbout from "./FooterAbout";

export default function Footer() {
  return (
    <div className="flex flex-col items-start w-full px-[30px]">
      <div className="flex items-start gap-[30px] w-full pb-[60px]">
        <FooterAbout />
      </div>
    </div>
  );
}
