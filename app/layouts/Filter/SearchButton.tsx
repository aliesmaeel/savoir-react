import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

type Props = {
  onClick: any;
};

export default function SearchButton({ onClick }: Props) {
  const icon = useIcons();
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-[11.44px] rounded-[13.2px] bg-[#C6A45A] px-[17.6px] py-[7.92px] w-full lg:w-[205.92px] h-[49.28px]"
    >
      <img loading="lazy" src={icon.seachWhite} alt="" className="w-[15.84px]" />
      <p className="text-white text-[19.55px]">Search</p>
    </button>
  );
}
