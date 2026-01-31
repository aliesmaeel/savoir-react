import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useIcons from "~/hooks/imageHooks/useIcons";

type Props = {
  questions: any;
};

export default function FAQs({ questions }: Props) {
  const icon = useIcons();

  // First one open by default; null means all closed
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = useCallback(
    (idx: number) => {
      setOpenIndex((cur) => (cur === idx ? null : idx));
    },
    [setOpenIndex]
  );

  return (
    <div className="flex flex-col items-start gap-[14px] lg:gap-[28px] w-full">
      {questions.map((item: any, idx: number) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className="flex flex-col items-start w-full border border-[#C6A45A] rounded-[4px] lg:rounded-[10px] overflow-hidden"
          >
            {/* Header (fixed 99px height) */}
            <div
              className="flex items-center justify-between px-[8px] lg:px-[27px] py-[7px] lg:py-[22px] h-[46px] lg:h-[99px] rounded-[4px] lg:rounded-[10px]  w-full"
              style={{
                background: isOpen ? "white" : "",
              }}
            >
              <div
                className="text-[10px] lg:text-[24px] font-medium pr-4"
                dangerouslySetInnerHTML={{ __html: item.question }}
              ></div>

              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
                className={`flex items-center justify-center rounded-[4px] lg:rounded-[10px] h-[20px] lg:h-[45px] w-[28px] lg:w-[82px] transition ${isOpen ? "border border-[#353635] bg-white " : ""}`}
                style={{
                  background: isOpen
                    ? ""
                    : "linear-gradient(94deg, #C6A45A 3.17%, rgba(255, 255, 255, 0.60) 224.54%)",
                }}
              >
                <img loading="lazy" src={isOpen ? icon.minusGold : icon.plusWhite} alt="" />
              </button>
            </div>

            {/* Animated answer section */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${idx}`}
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-[8px] lg:px-[27px] py-[7px] lg:py-[22px] pt-4">
                    <div
                      className="text-[10px] lg:text-[23px] leading-[1.9]"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    ></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
