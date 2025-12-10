import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useArrow from "~/hooks/imageHooks/useArrow";

export default function ScrollToTop() {
  const arrow = useArrow();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={handleScrollToTop}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleScrollToTop();
            }
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed bottom-[5px] right-[30px] z-50 w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] bg-[#B59B62] rounded-full flex items-center justify-center shadow-lg hover:bg-[#9d8552] transition-colors duration-200"
          aria-label="Scroll to top"
          tabIndex={0}
        >
          <img
            src={arrow.smallBoldWhite || "/images/arrows/up-arrow.svg"}
            alt=""
            className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] rotate-180"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

