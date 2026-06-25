import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

type Props = {
  onClick: any;
  variant?: "home" | "listing";
  showIcon?: boolean;
};

export default function SearchButton({
  onClick,
  variant = "home",
  showIcon = true,
}: Props) {
  const icon = useIcons();
  const isListing = variant === "listing";

  return (
    <button
      onClick={onClick}
      className={
        isListing
          ? "Jakarta flex h-[54px] w-full items-center justify-center bg-[#C6A45A] px-[18px] text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#b8944f] lg:h-[58px]"
          : "Jakarta flex h-[49.28px] w-full items-center justify-center gap-[8px] rounded-[13.2px] bg-[#C6A45A] px-[14px] py-[7.92px] text-white transition-colors hover:bg-[#b8944f] lg:w-[118px]"
      }
    >
      {showIcon && (
        <img
          loading="lazy"
          src={icon.seachWhite}
          alt=""
          className="w-[14px]"
        />
      )}

      <span className={isListing ? "text-white" : "text-[17px] text-white"}>
        Search
      </span>
    </button>
  );
}
