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
  { label: "News", to: "/news" },
  { label: "Career", to: "/career" },
  { label: "About", to: "/about-us" },
] as const;

export default function Header() {
  const icon = useIcons();
  const [sidebar, setSidebar] = useState(false);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-30 flex w-full items-center justify-between bg-[#0000005e] px-[16px] py-[10px] shadow-[0_4px_54px_0_rgba(0,0,0,0.15),0_31.242px_62.484px_-15.621px_rgba(143,144,188,0.15)] backdrop-blur-[10px] lg:px-[45px]"
    >
      <div className="mx-auto flex w-full max-w-[1226px] items-center justify-between gap-3 lg:gap-6">
        <Link to="/" className="shrink-0">
          <img loading="lazy" src={icon.logo} alt="Savoir Properties home" className="w-[54px] lg:w-[141px]" />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center  gap-3 lg:flex xl:gap-5 justify-between px-[15px]"
          aria-label="Main"
        >
          {headerNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap text-[12px] font-medium text-white transition-colors hover:text-[#C6A45A] xl:text-[14px]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/list-with-us"
            className="whitespace-nowrap rounded-[4px] bg-[#C6A45A] px-3 py-2 text-[12px] font-semibold text-black transition-colors hover:bg-[#b8944f] xl:px-4 xl:text-[14px]"
          >
            List Your Property
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setSidebar(true)}
          aria-label="Open menu"
          tabIndex={0}
          className="shrink-0 rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45A] lg:ml-2"
        >
          <img loading="lazy" src={icon.menu} alt="" className="w-[18px] lg:w-[40px]" />
        </button>
      </div>
      <AnimatePresence>{sidebar && <Sidebar onClose={() => setSidebar(false)} />}</AnimatePresence>
    </header>
  );
}
