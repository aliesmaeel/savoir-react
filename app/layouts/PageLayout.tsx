import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

type props = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: props) {
  const icon = useIcons();
  return (
    <div 
    className="px-[16px] lg:px-[45px] pt-[0px] lg:pt-[0px] pb-[30px]
     lg:pb-[40px] relative z-0" >
      <div className="w-full max-w-[1226px] mx-auto">{children}</div>
    </div>
  );
}
