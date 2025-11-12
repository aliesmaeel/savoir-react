import React from "react";

type props = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: props) {
  return (
    <div className="px-[16px] lg:px-[45px] pt-[30px] lg:pt-[30px] pb-[60px] lg:pb-[165px] relative z-0">
      <div className="w-full max-w-[1226px] mx-auto">{children}</div>
    </div>
  );
}
