import React from "react";

type props = {
  label: string;
  unit: string;
  placeholder?: string;
};

export default function CalculatorInput({ label, unit, placeholder }: props) {
  return (
    <div className="flex flex-col items-start gap-[11px] w-full">
      <p className="text-[15px] font-semibold">{label}</p>
      <div className="flex items-center justify-between px-[15px] py-[17px] w-full h-[51px] rounded-[6px] bg-white">
        <input
          type="number"
          placeholder={placeholder}
          className="border-0 outline-0 text-[#353635B2] text-[13px]"
        />
        <p className="text-[#353635B2] text-[13px]">{unit}</p>
      </div>
    </div>
  );
}
