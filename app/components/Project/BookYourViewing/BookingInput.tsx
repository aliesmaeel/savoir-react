import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

type Props = {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  white?: boolean;
  name?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  ariaLabel?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export default function BookingInput({
  placeholder,
  type = "text",
  value,
  onChange,
  white = false,
  name,
  required = true,
  minLength,
  maxLength,
  pattern,
  autoComplete,
  ariaLabel,
  inputMode,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange(e.target.value);

  const accessibilityProps = ariaLabel ? { "aria-label": ariaLabel } : {};

  // TEL with country selector + formatting
  if (type === "tel") {
    return (
      <div
        className={`px-[2px] pt-[21px] pb-[17px] border-b-[2px] w-full h-[54.6px] relative ${
          white ? "border-white" : "border-[#262626]"
        }`}
      >
        <PhoneInput
          defaultCountry="ae"
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Enter Phone number"}
          name={name}
          required={required}
          autoComplete={autoComplete}
          className="w-full relative"
          inputClassName={`!bg-transparent !border-0 !outline-none !shadow-none !ring-0 !w-full !font-medium ${
            white
              ? "!text-white !placeholder-white !text-[15px]"
              : "!text-[10px] !placeholder-[#666]"
          }`}
          inputProps={{
            ...accessibilityProps,
            minLength,
            maxLength,
            pattern,
            inputMode,
          }}
          countrySelectorStyleProps={{
            // buttonType: "button",

            buttonClassName: "!bg-transparent !border-0 !rounded-none !px-0 !py-0",
            dropdownStyleProps: {
              className: `!max-h-72 z-50 ${white ? "!bg-[#111] !text-white" : "!bg-white !text-black"}`,
              listItemClassName: "!text-sm z-50", // <-- correct key
            },
          }}
        />
      </div>
    );
  }

  // TEXTAREA (kept your original key "textAria" to avoid breaking changes)
  if (type === "textAria") {
    return (
      <div
        className={`px-[11px] py-[13px] border-b-[2px] w-full ${
          white ? "border-white" : "border-[#262626]"
        }`}
      >
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          name={name}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          aria-label={ariaLabel}
          className="w-full bg-transparent border-0 outline-none text-[10px] font-medium placeholder-[#666] h-[30px]"
        />
      </div>
    );
  }

  // DEFAULT input
  return (
    <div
      className={`px-[2px] pt-[21px] pb-[17px] border-b-[2px] w-full h-[54.6px] ${
        white ? "border-white" : "border-[#262626]"
      }`}
    >
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        name={name}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-label={ariaLabel}
        className={`block w-full bg-transparent border-0 outline-none font-medium ${
          white ? "placeholder-white text-white text-[15px]" : "placeholder-[#666] text-[10px]"
        }`}
      />
    </div>
  );
}
