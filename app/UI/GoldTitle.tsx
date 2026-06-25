import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

type props = {
  children: React.ReactNode;
  className?: string;
};

export default function GoldTitle({ children, className }: props) {
  const icon = useIcons();
  return (
    <div
      className="flex items-center gap-[7px] w-full px-[18px] py-[10px] h-auto border-l-[3px] border-[#111111]"
      style={{
        background:
          "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(17, 17, 17, 0.08) 50%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <img loading="lazy" src={icon.zap} alt="" className="w-[18px] brightness-0" />
      <p className={`text-[15px] lg:text-[22px] font-bold text-[#111111] CormorantGaramond ${className}`}>{children}</p>
    </div>
  );
}
