import React, { useEffect } from "react";
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

  return (
    <div className="flex items-center justify-center w-full h-screen fixed top-0 left-0 z-[99999] bg-[#00000066] px-[16px]">
      <div className="w-full max-w-[759.75px] rounded-[15.711px] lg:rounded-[37.5px] bg-white relative z-10">
        <div
          className={`flex items-center justify-between w-full px-[21px] lg:px-[40px] py-[14px] lg:py-[27px] ${title ? "bg-[#C6A45A33]" : ""}`}
        >
          <p className="text-[15px] lg:text-[29px] font-bold">{title}</p>
          <button onClick={onClose}>
            <img src={icon.popupClose} alt="" className="w-[12px] lg:w-[24px]" />
          </button>
        </div>
        <img
          src={icon.popupPaterrn}
          alt=""
          className="absolute bottom-0 right-0 z-[-1] w-[187px] lg:w-[358px]"
        />
        {children}
      </div>
    </div>
  );
}
