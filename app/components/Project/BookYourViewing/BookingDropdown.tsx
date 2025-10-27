import React, { useState, useRef, useEffect } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

type Option = { label: string; value: string };

type Props = {
  placeholder: string;
  value: string; // controlled value
  onChange: (v: string) => void; // setter from parent
  options: Option[]; // list of options
};

export default function BookingDropdown({ placeholder, value, onChange, options }: Props) {
  const icon = useIcons();
  const arrow = useArrow();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const display = value || placeholder;
  const isPlaceholder = !value;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full pl-[2px] pr-[11px] pt-[21px] pb-[17px] border-b-[2px] border-[#262626]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <p className={`text-[10px] font-medium ${isPlaceholder ? "text-[#666]" : ""}`}>{display}</p>
        <img
          loading="lazy"
          src={arrow.shortBlack}
          alt=""
          className={`w-[13px] duration-100 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="flex flex-col items-start gap-[10px] p-[16px] rounded-[10px] bg-[#EEE] absolute w-full top-[65px] z-10"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              onClick={() => handleSelect(opt.value)}
              className="flex p-[5px] rounded-[5px] w-full hover:bg-[#c3c3c3] text-left"
            >
              <p className="text-[14px] font-medium">{opt.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
