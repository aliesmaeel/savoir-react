import React from "react";
import { Link } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function FooterAbout() {
  const icon = useIcons();

  return (
    <div className="flex flex-col items-start gap-[23px] lg:gap-[30px] w-full max-w-[456px]">
      <img loading="lazy" src={icon.logoFooter} alt="" className="w-[183px] brightness-[0.7]" />
      <p className="text-[13px] lg:text-[18.7px] leading-[200%]">
        Savoir Properties is committed to delivering a high level of expertise {" "}
        <Link to="/about-us" className="text-[#C6A45A] font-semibold underline">
          Read More
        </Link>
      </p>
      <div className="flex flex-col gap-[10px] bg-[#B59B62]">
        <img loading="lazy" src="/images/footer1.png" alt="" className="w-full" />
      </div>
    </div>
  );
}
