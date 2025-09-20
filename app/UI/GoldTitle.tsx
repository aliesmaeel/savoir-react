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
      className="flex items-center gap-[7px] w-full px-[18px] py-[10px] h-[47px] border-l-[3px] border-[#C6A45A]"
      style={{
        background:
          "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(240, 232, 214, 1) 50%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <img src={icon.zap} alt="" className="w-[18px]" />
      <p className={`text-[22px] font-semibold ${className}`}>{children}</p>
    </div>
  );
}
