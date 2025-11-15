import React from "react";

type props = {
  children: React.ReactNode;
  className?: string;
};

export default function Title({ children, className }: props) {
  return (
    <div className="relative">
      <p className={`Theseasons ${className}`}>{children}</p>
      <div
        className="w-full h-[4px] mt-[5px]"
        style={{
          background:
            "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, #C6A45A 50%, rgba(255, 255, 255, 0) 100%)",
        }}
      ></div>
    </div>
  );
}
