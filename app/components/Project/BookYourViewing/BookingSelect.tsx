import React, { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  white?: boolean;
};

export default function BookingSelect({
  placeholder = "Select an option",
  value,
  onChange,
  options,
  white = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative px-[2px] pt-[21px] pb-[17px] border-b-[2px] w-full h-[54.6px] cursor-pointer ${
        white ? "border-white" : "border-[#262626]"
      }`}
      onClick={() => setOpen((prev) => !prev)}
    >
      {/* Selected value */}
      <div
        className={`flex justify-between items-center w-full font-medium ${
          white
            ? "text-white text-[15px]"
            : value
              ? "text-[#262626] text-[10px]"
              : "text-[#666] text-[10px]"
        }`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span
          className={`${white ? "text-white" : "text-[#666]"} transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>

      {/* Dropdown options */}
      {open && (
        <div
          className={`absolute left-0 top-[100%] mt-1 w-full max-h-60 overflow-y-auto rounded-md shadow-lg z-50 ${
            white ? "bg-[#111] text-white" : "bg-white text-black"
          }`}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={(e) => {
                e.stopPropagation(); // 👈 Prevent toggle reopening
                onChange(option.value);
                setOpen(false); // 👈 Close dropdown after select
              }}
              className={`px-3 py-2 text-sm hover:bg-opacity-80 ${
                white ? "hover:bg-white/10" : "hover:bg-gray-100"
              } ${option.value === value ? (white ? "bg-white/10" : "bg-gray-100") : ""}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
