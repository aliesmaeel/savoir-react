import React from "react";

type Props = {
  label: string;
  unit?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute; // "text" | "number" | ...
  step?: number | string;
  min?: number;
  max?: number;
  name?: string;
  id?: string;
  disabled?: boolean;
  inputClassName?: string;
  containerClassName?: string;
};

export default function CalculatorInput({
  label,
  unit,
  placeholder,
  value,
  onChange,
  onBlur,
  type = "text",
  step,
  min,
  max,
  name,
  id,
  disabled,
  inputClassName = "",
  containerClassName = "",
}: Props) {
  return (
    <div className={`flex flex-col items-start gap-[11px] w-full ${containerClassName}`}>
      <label htmlFor={id} className="text-[15px] font-semibold h-[35px] lg:h-auto">
        {label}
      </label>

      <div className="flex items-center justify-between px-[15px] py-[17px] w-full h-[51px] rounded-[6px] bg-white">
        <input
          id={id}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          inputMode={type === "number" ? "decimal" : undefined}
          className={`flex-1 border-0 outline-0 bg-transparent text-[#353635B2] text-[13px] ${inputClassName}`}
        />
        {unit ? <span className="hidden lg:inline text-[#353635B2] text-[13px] select-none">{unit}</span> : null}
      </div>
    </div>
  );
}
