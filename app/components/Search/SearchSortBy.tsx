import React, { useState, useRef, useEffect } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function SearchSortBy() {
  const icon = useIcons();
  const arrow = useArrow();

  const items = ["popularity", "Name", "Date", "Price"];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("popularity");

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
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center justify-between gap-[51px] p-[16px] rounded-[10px] bg-[#EEE]">
        <div className="flex items-center gap-[8px]">
          <button>
            <img src={icon.sortOrder} alt="" className="w-[30px]" />
          </button>
          <hr className="border-0 w-[1px] h-[22px] bg-[#262626]" />
          <p className="text-[14px] font-medium">Sort by : {selected}</p>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)}>
          <img
            src={arrow.circleShortGold}
            alt=""
            className={`w-[26px] duration-100 ${open && "rotate-180"}`}
          />
        </button>
      </div>

      {open && (
        <div className="flex flex-col items-start gap-[10px] p-[16px] rounded-[10px] bg-[#EEE] absolute w-full top-[65px] z-10">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className="flex p-[5px] rounded-[5px] w-full hover:bg-[#c3c3c3] text-left"
            >
              <p className="text-[14px] font-medium">{item}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
