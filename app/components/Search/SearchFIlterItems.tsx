import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function SearchFIlterItems() {
  const icon = useIcons();

  const items = [
    {
      icon: icon.searchType,
      value: "Apartment",
    },
    {
      icon: icon.searchPriceRange,
      value: "1000-2000",
    },
    {
      icon: icon.searchSquare,
      value: "34525 sqt",
    },
    {
      icon: icon.searchBedroom,
      value: "4 bedroom",
    },
    {
      icon: icon.searchBathRoom,
      value: "3 bathroom",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-[20px] w-full">
      <div className="grid grid-cols-5 gap-[17px] w-full">
        {items.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between w-full p-[16px] rounded-[10px] bg-[#EEE]"
          >
            <div className="flex items-center gap-[8px]">
              <img src={item.icon} alt="" className="w-[19px]" />
              <hr className="border-0 w-[1px] h-[22px] bg-[#262626]" />
              <p className="text-[14px] font-medium">{item.value}</p>
            </div>
            <button>
              <img src={icon.searchCloseButton} alt="" className="w-[26px]" />
            </button>
          </div>
        ))}
      </div>
      <button>
        <p className="text-[24px] font-medium underline">Reset all filters</p>
      </button>
    </div>
  );
}
