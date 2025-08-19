import React from "react";
import SearchButton from "./SearchButton";
import useArrow from "~/hooks/imageHooks/useArrow";

export default function SearchFilter() {
  const arrow = useArrow();
  return (
    <div className="flex items-center justify-end rounded-[20px] bg-[#FFFFFF40] backdrop-blur-[13.8px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] py-[19px] px-[39px] w-full">
      <div className="flex gap-[20px] justify-between w-full">
        <button className="w-full max-w-[211px]">
          <div className="flex flex-col items-start">
            <p className="text-white text-[18px] font-semibold">Rent</p>
            <div className="flex items-center gap-[15px]">
              <p className="text-white text-[16px]">Select Your Type</p>
              <img src={arrow.smallBoldWhite} alt="" />
            </div>
          </div>
        </button>
        <button className="w-full max-w-[211px]">
          <div className="flex flex-col items-start">
            <p className="text-white text-[18px] font-semibold">Type </p>
            <div className="flex items-center gap-[15px]">
              <p className="text-white text-[16px]">Select Your Type</p>
              <img src={arrow.smallBoldWhite} alt="" />
            </div>
          </div>
        </button>
        <button className="w-full max-w-[270px]">
          <div className="flex flex-col items-start">
            <p className="text-white text-[18px] font-semibold">Bedroom</p>
            <div className="flex items-center gap-[15px]">
              <p className="text-white text-[16px]">Choose bedroom Type</p>
              <img src={arrow.smallBoldWhite} alt="" />
            </div>
          </div>
        </button>
        <button className="w-full max-w-[246px]">
          <div className="flex flex-col items-start">
            <p className="text-white text-[18px] font-semibold">PriceRange</p>
            <div className="flex items-center gap-[15px]">
              <p className="text-white text-[16px]">Choose Price Range</p>
              <img src={arrow.smallBoldWhite} alt="" />
            </div>
          </div>
        </button>
      </div>
      <SearchButton />
    </div>
  );
}
