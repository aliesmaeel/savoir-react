import React from "react";
import styles from "./Header.module.css";

type props = {
  children: React.ReactNode;
  className?: string;
};

export default function Header({ children, className }: props) {
  return (
    <div className="relative">
      <p className={`font-bold Theseasons ${styles.title} ${className}`}>{children}</p>
      <div
        className="w-full h-[2px]"
        style={{
          background:
            "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(198, 164, 90, 1) 50%, rgba(255, 255, 255, 0) 100%)",
        }}
      ></div>
    </div>
  );
}
