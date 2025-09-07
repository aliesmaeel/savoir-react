import React, { useEffect, useMemo, useRef, useState } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

type Props = {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
  maxWidthClass?: string; // e.g., "max-w-[211px]"
};

export default function FilterType({
  options,
  selected,
  onChange,
  label = "Type",
  placeholder = "Select Your Type",
  maxWidthClass = "max-w-[211px]",
}: Props) {
  const arrow = useArrow();
  const icon = useIcons();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const toggleValue = (val: string) => {
    const exists = selected.includes(val);
    const next = exists ? selected.filter((v) => v !== val) : [...selected, val];
    onChange(next);
  };

  const summaryText = useMemo(() => {
    if (selected.length === 0) return placeholder;
    if (selected.length <= 2) return selected.join(", ");
    return `${selected.length} selected`;
  }, [selected, placeholder]);

  return (
    <div className={`relative w-full ${maxWidthClass}`} ref={wrapperRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex flex-col items-start">
          <p className="text-white text-[15.84px] font-semibold">{label}</p>
          <div className="flex items-center gap-[12px]">
            <p className="text-white text-[14.08px] truncate">{summaryText}</p>
            <img
              src={arrow.smallBoldWhite}
              alt=""
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute  py-[19px] rounded-[20px] bg-[#4A4A4A] backdrop-blur-[20px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] w-[382px] top-[160%]"
        >
          <div className="flex flex-col items-start gap-[14px] w-full h-[272px] overflow-y-scroll small-scroll">
            {options.map((opt, idx) => {
              const active = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => toggleValue(opt)}
                  className="w-full text-left px-[32px]"
                >
                  <div className="flex items-center justify-between pb-[14px]">
                    <p className="text-white text-[18px] leading-[22px]">{opt}</p>
                    {/* Check mark bubble when selected */}
                    {active && <img src={icon.checkGold} alt="" />}
                  </div>
                  {/* Divider line (skip after last item) */}
                  {idx < options.length - 1 && <div className=" h-px bg-white/10" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
