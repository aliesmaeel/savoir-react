import React, { useState, useRef, useEffect } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

type props = {
  placeholder: string;
};

export default function BookingDropdown({ placeholder }: props) {
  const icon = useIcons();
  const arrow = useArrow();

  const items = ["item1", "item2", "item3", "item4"];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");

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
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full pl-[2px] pr-[11px] pt-[21px] pb-[17px] border-b-[2px] border-[#262626]"
      >
        <p className={`text-[10px] font-medium ${selected ? "" : "text-[#666]"}`}>
          {selected ? selected : placeholder}
        </p>
        <img
          src={arrow.shortBlack}
          alt=""
          className={`w-[13px] duration-100 ${open && "rotate-180"}`}
        />
      </button>

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
