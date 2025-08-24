import React, { useEffect, useState } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function Header() {
  const icon = useIcons();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide
        setShow(false);
      } else {
        // scrolling up → show
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`flex items-center justify-between w-full px-[45px] py-[19px] 
        bg-[#0000005e] backdrop-blur-[10px] fixed z-30 transition-all duration-300
        shadow-[0_4px_54px_0_rgba(0,0,0,0.15),0_31.242px_62.484px_-15.621px_rgba(143,144,188,0.15)]
        ${show ? "top-0" : "top-[-90px]"}`}
    >
      <img src={icon.logo} alt="logo" className="w-[141px]" />
      <img src={icon.menu} alt="menu" className="w-[43px]" />
    </div>
  );
}
