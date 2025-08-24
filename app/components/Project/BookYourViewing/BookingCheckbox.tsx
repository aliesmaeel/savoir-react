import React, { useEffect, useId, useRef } from "react";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  name?: string;
  value?: string;
  className?: string;
  size?: number; // px, default 18
};

export default function BookingCheckbox({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  name,
  value,
  className,
  size = 18,
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  const boxStyle: React.CSSProperties = {
    width: size,
    height: size,
  };
  const iconStyle: React.CSSProperties = {
    width: Math.round(size * 0.72),
    height: Math.round(size * 0.72),
  };

  // simple draw animation for the tick (no Tailwind config required)
  const tickLength = 22; // tweak if you change the path
  const pathStyle: React.CSSProperties = {
    strokeDasharray: tickLength,
    strokeDashoffset: checked && !(indeterminate && !checked) ? 0 : tickLength,
    transition: "stroke-dashoffset 160ms ease-out",
  };

  return (
    <label
      htmlFor={id}
      data-mixed={indeterminate && !checked ? "true" : "false"}
      className={[
        "inline-flex items-center gap-[8px] select-none cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed",
        className ?? "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-checked={indeterminate && !checked ? "mixed" : checked}
        className="peer absolute opacity-0 w-0 h-0 pointer-events-none"
      />

      {/* custom box */}
      <span
        style={boxStyle}
        className={[
          "relative grid place-items-center rounded",
          "border-2 border-[#C6A45A] bg-white transition",
          // pop a bit when checked
          "peer-checked:scale-95",
          // checked state
          "peer-checked:bg-[#C6A45A] peer-checked:border-[#C6A45A] peer-checked:text-white",
          // indeterminate (via data attr on the label)
          "data-[mixed=true]:bg-[#C6A45A] data-[mixed=true]:border-[#C6A45A] data-[mixed=true]:text-white",
          // focus ring when input gets keyboard focus
          "peer-focus-visible:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-300/50",
          "transition-transform duration-150",
        ].join(" ")}
        aria-hidden="true"
      >
        {/* check icon (draws in when checked; hidden if mixed) */}
        <svg
          viewBox="0 0 16 16"
          style={iconStyle}
          className={[
            "absolute",
            // keep it mounted so the draw animation can run
            "data-[mixed=true]:opacity-0",
          ].join(" ")}
        >
          <path
            // classic tick path
            d="M3.5 8.5l3 3 6-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={pathStyle}
          />
        </svg>

        {/* minus icon (visible when mixed) */}
        <svg
          viewBox="0 0 16 16"
          style={iconStyle}
          className="absolute opacity-0 data-[mixed=true]:opacity-100 transition-opacity"
        >
          <path
            d="M3 8h10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {label ? <p className="text-[#999] text-[11px] font-medium">{label}</p> : null}
    </label>
  );
}
