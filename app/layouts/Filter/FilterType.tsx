import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

export type TypeOption = {
  code: string;
  label: string;
};

type Props = {
  options: TypeOption[];
  selected: string[]; // will hold codes
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
  maxWidthClass?: string;
  variant?: "glass" | "listing";
  showChevron?: boolean;
};

export default function FilterType({
  options,
  selected,
  onChange,
  label = "Type",
  placeholder = "Select Your Type",
  maxWidthClass = "max-w-[211px]",
  variant = "glass",
  showChevron = true,
}: Props) {
  const arrow = useArrow();
  const icon = useIcons();
  const isListing = variant === "listing";
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);

    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const toggleValue = (code: string) => {
    const exists = selected.includes(code);
    const next = exists
      ? selected.filter((v) => v !== code)
      : [...selected, code];

    onChange(next);
  };

  const summaryText = useMemo(() => {
    if (selected.length === 0) return placeholder;

    const labels = options
      .filter((opt) => selected.includes(opt.code))
      .map((opt) => opt.label);

    if (labels.length <= 2) return labels.join(", ");

    return `${labels.length} selected`;
  }, [selected, options, placeholder]);

  return (
    <div
      className={`relative w-full ${maxWidthClass} ${open ? "z-50" : ""}`}
      ref={wrapperRef}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div
          className={
            isListing
              ? "flex w-full items-center justify-between gap-[10px]"
              : "flex flex-col items-start gap-[5px]"
          }
        >
          <p
            className={
              isListing
                ? "Jakarta truncate text-[16px] font-semibold leading-none text-black"
                : "text-white text-[15.84px] font-semibold"
            }
          >
            {isListing && selected.length > 0 ? summaryText : label}
          </p>

          {!isListing && (
            <div className="flex items-center gap-[12px]">
              <p className="text-white text-[14.08px] truncate">
                {summaryText}
              </p>

              {showChevron && (
                <img
                  loading="lazy"
                  src={arrow.smallBoldWhite}
                  alt=""
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
              )}
            </div>
          )}

          {isListing && showChevron && (
            <img
              loading="lazy"
              src={arrow.smallBoldWhite}
              alt=""
              className={`w-[10px] shrink-0 brightness-0 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            role="listbox"
            aria-multiselectable="true"
            className="absolute py-[19px] rounded-[20px] bg-[#4A4A4A] backdrop-blur-[20px] drop-shadow-[0_41.656px_83.312px_-20.828px_rgba(143,144,188,0.15)] w-[307px] lg:w-[382px] top-[160%] z-50 left-[-161px] lg:left-auto"
          >
            <div className="flex flex-col items-start gap-[14px] w-full h-[272px] overflow-y-scroll small-scroll">
              {options.map((opt, idx) => {
                const active = selected.includes(opt.code);

                return (
                  <button
                    key={opt.code}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => toggleValue(opt.code)}
                    className="w-full text-left px-[32px]"
                  >
                    <div className="flex items-center justify-between pb-[14px]">
                      <p
                        className="text-[18px] leading-[22px]"
                        style={{
                          color: "#FFFFFF",
                          opacity: 1,
                        }}
                      >
                        {opt.label}
                      </p>

                      {active && (
                        <img loading="lazy" src={icon.checkGold} alt="" />
                      )}
                    </div>

                    {idx < options.length - 1 && (
                      <div className="h-px bg-white/10" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
