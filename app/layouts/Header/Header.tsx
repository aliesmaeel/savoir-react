import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import useIcons from "~/hooks/imageHooks/useIcons";
import Sidebar from "./Sidebar";

export default function Header() {
  const icon = useIcons();
  const [show, setShow] = useState(true);
  const [sidebar, setSidebar] = useState(false);

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
      <div className="flex items-center justify-between w-full max-w-[1226px] mx-auto">
        <img src={icon.logo} alt="logo" className="w-[141px]" />
        <button onClick={() => setSidebar(true)}>
          <img src={icon.menu} alt="menu" className="w-[43px]" />
        </button>
      </div>
      <AnimatePresence>{sidebar && <Sidebar onClose={() => setSidebar(false)} />}</AnimatePresence>
    </div>
  );
}
