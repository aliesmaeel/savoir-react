import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function NewsShare() {
  const icon = useIcons();
  return (
    <div className="flex flex-row lg:flex-col items-start gap-[33.6px]">
      <div className="flex flex-col items-start gap-[27px]">
        <div className="flex flex-col items-start">
          <p className="text-[#121416] text-[32px]">966</p>
          <p className="text-[#A7A7A7] text-[20px]">Shares</p>
        </div>
        <hr className="w-full border-[#E9ECEF] hidden lg:block" />
      </div>
      <div className="flex flex-row lg:flex-col items-start gap-[11px]">
        <button>
          <img loading="lazy" src={icon.facebookShare} alt="" />
        </button>
        <button>
          <img loading="lazy" src={icon.instagramShare} alt="" />
        </button>
        <button>
          <img loading="lazy" src={icon.linkedinShare} alt="" />
        </button>
        <button>
          <img loading="lazy" src={icon.bodyShare} alt="" />
        </button>
      </div>
    </div>
  );
}
