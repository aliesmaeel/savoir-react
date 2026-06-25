import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import useIcons from "~/hooks/imageHooks/useIcons";

type Props = {
  children: React.ReactNode;
  title?: string;
  onClose: () => void;
};

export default function Popup({ children, title, onClose }: Props) {
  const icon = useIcons();
  useEffect(() => {
    // disable scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // re-enable scrolling on unmount
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const overlay = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#00000066] px-[16px]">
      <div className="relative z-10 w-full max-w-[759.75px] rounded-[15.711px] bg-white lg:rounded-[37.5px]">
        <div
          className={`flex w-full items-center justify-between px-[21px] py-[14px] lg:px-[40px] lg:py-[27px] ${title ? "bg-[#C6A45A33]" : ""}`}
        >
          <p className="text-[15px] font-bold lg:text-[29px]">{title}</p>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            <img loading="lazy" src={icon.popupClose} alt="" className="w-[12px] lg:w-[24px]" />
          </button>
        </div>
        <img
          loading="lazy"
          src={icon.popupPaterrn}
          alt=""
          className="absolute bottom-0 right-0 z-[-1] w-[187px] lg:w-[358px]"
        />
        {children}
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(overlay, document.body);
}
