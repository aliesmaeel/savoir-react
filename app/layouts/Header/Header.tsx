import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import useIcons from "~/hooks/imageHooks/useIcons";
import Sidebar from "./Sidebar";
import { Link } from "react-router";

const headerNavItems = [
  { label: "Buy", to: "/search?interested=Buy" },
  { label: "Rent", to: "/search?interested=Rent" },
  { label: "Off plan", to: "/off-plan" },
  { label: "Global projects", to: "/global-projects" },
  { label: "About", to: "/about-us" },
] as const;

export default function Header() {
  const icon = useIcons();
  const [sidebar, setSidebar] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex w-full items-center justify-between bg-[#0000005e] px-[16px] py-[10px] shadow-[0_4px_54px_0_rgba(0,0,0,0.15),0_31.242px_62.484px_-15.621px_rgba(143,144,188,0.15)] backdrop-blur-[10px] lg:px-[45px]">
      <div className="mx-auto grid w-full max-w-[1226px] grid-cols-[auto_1fr_auto] items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            loading="lazy"
            src={icon.logo}
            alt="Savoir Properties home"
            className="w-[54px] lg:w-[141px]"
          />
        </Link>

        {/* Center Navigation */}
        <nav
          className="hidden items-center justify-center gap-[28px] lg:flex xl:gap-[42px]"
          aria-label="Main"
        >
          {headerNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap text-[13px] font-medium text-white transition-colors duration-300 hover:text-[#C6A45A] xl:text-[14px]"
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/list-with-us"
            className="ml-[12px] whitespace-nowrap rounded-[4px] bg-[#C6A45A] px-[20px] py-[10px] text-[13px] font-semibold text-black transition-colors duration-300 hover:bg-[#b8944f] xl:text-[14px]"
          >
            List Your Property
          </Link>
        </nav>

        {/* Menu Button */}
        <button
          type="button"
          onClick={() => setSidebar(true)}
          aria-label="Open menu"
          tabIndex={0}
          className="shrink-0 rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45A]"
        >
          <img
            loading="lazy"
            src={icon.menu}
            alt=""
            className="w-[18px] lg:w-[38px]"
          />
        </button>
      </div>

      <AnimatePresence>
        {sidebar && <Sidebar onClose={() => setSidebar(false)} />}
      </AnimatePresence>
    </header>
  );
}