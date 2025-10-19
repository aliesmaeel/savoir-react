import React, { useState, useRef, useEffect } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function SearchSortBy() {
  const icon = useIcons();
  const arrow = useArrow();

  const items = ["Name", "Date", "Price"];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("Name");

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: string) => {
    setSelected(item);
    setOpen(false);
  };

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={wrapperRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-[22px] lg:gap-[51px] p-[6px] lg:p-[16px] rounded-[4px] lg:rounded-[10px] bg-[#EEE]"
      >
        <div className="flex items-center gap-[2px] lg:gap-[8px]">
          <button>
            <img loading="lazy" src={icon.sortOrder} alt="" className="w-[12px] lg:w-[30px]" />
          </button>
          <hr className="border-0 w-[1px] h-[9px] lg:h-[22px] bg-[#262626]" />
          <p className="text-[6px] lg:text-[14px] font-medium">Sort by : {selected}</p>
        </div>
        <div>
          <img
            loading="lazy"
            src={arrow.circleShortGold}
            alt=""
            className={`w-[11px] lg:w-[26px] duration-100 ${open && "rotate-180"}`}
          />
        </div>
      </button>

      {open && (
        <div className="flex flex-col items-start gap-[5px] lg:gap-[10px] p-[6px] lg:p-[16px] rounded-[4px] lg:rounded-[10px] bg-[#EEE] absolute w-full top-[26px] lg:top-[65px] z-10">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex p-[5px] rounded-[5px] w-full hover:bg-[#c3c3c3] text-left"
            >
              <p className="text-[6px] lg:text-[14px] font-medium">{item}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
