import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, NavLink } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

type SidebarProps = {
  onClose: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const icon = useIcons();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Detect click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const items = [
    { title: "Off Plan", path: "/off-plan" },
    { title: "Global Projects", path: "/global-projects" },
    { title: "News", path: "/news" },
    { title: "List With Us", path: "/list-with-us" },
    { title: "Our Blogs", path: "/blogs" },
    { title: "Contact Us", path: "/contact-us" },
    { title: "Our Team", path: "/our-team" },
    { title: "Career", path: "/career" },
    { title: "About us", path: "/about-us" },
  ];

  return (
    <motion.div
      ref={sidebarRef}
      initial={{ opacity: 0, right: "-360px" }}
      animate={{ opacity: 1, right: "0px" }}
      exit={{ opacity: 0, right: "-360px" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex flex-col items-center justify-start gap-[41.36px] w-full pt-[40px] max-w-[360px] h-screen fixed top-0 right-0 rounded-l-[14.1px]"
      style={{
        background:
          "linear-gradient(180deg,rgba(198, 164, 90, 1) 0%, rgba(255, 255, 255, 1) 24%, rgba(255, 255, 255, 1) 100%)",
      }}
    >
      <Link to="/">
        <img loading="lazy" src={icon.logo} alt="" className="w-[188.47px]" />
      </Link>
      <div className="flex flex-col items-center gap-[26.79px]">
        <div className="flex flex-col items-center gap-[21.15px]">
          {items.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="text-[17.39px] font-medium"
              onClick={onClose} // close when link clicked
            >
              {item.title}
            </NavLink>
          ))}
        </div>
        <div className="flex flex-col items-center gap-[12.22px]">
          <NavLink to={`#`} onClick={onClose}>
            <img loading="lazy" src={icon.luxuryPortfolio} alt="" className="w-[122.67px]" />
          </NavLink>
          <NavLink to={`#`} onClick={onClose}>
            <img loading="lazy" src={icon.leading} alt="" className="w-[96.35px]" />
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
}
