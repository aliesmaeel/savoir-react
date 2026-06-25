import React from "react";

type Props = {
  label: string;
  unit?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
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
    <div className={`flex flex-col items-start gap-[10px] w-full ${containerClassName}`}>
      <label
        htmlFor={id}
        className="text-[15px] lg:text-[16px] font-semibold text-[#111111]"
      >
        {label}
      </label>

      <div className="flex items-center justify-between w-full h-[58px] rounded-[7px] border border-[#DCDCDC] bg-white px-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.035)]">
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
          className={`flex-1 border-0 outline-0 bg-transparent text-[#222222] text-[15px] lg:text-[16px] font-normal placeholder:text-[#777777] ${inputClassName}`}
        />

        {unit ? (
          <span className="hidden lg:inline text-[#333333] text-[13px] font-medium select-none">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}