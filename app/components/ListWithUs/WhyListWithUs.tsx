import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";

export default function WhyListWithUs() {
  const icon = useIcons();

  const items = [
    "Experience unmatched service dedicated to your satisfaction",
    "Benefit from our esteemed brand heritage and reputation.",
    "Enjoy true global reach to attract buyers from around the world.",
  ];

  return (
    <div className="flex flex-col items-center gap-[46px] w-full">
      <p className="text-black text-[20px] lg:text-[42px] font-medium">Why List With Us ?</p>
      <div className="grid grid-cols-1  lg:grid-cols-3 gap-[35px] w-full">
        {items.map((item: any, index: number) => (
          <Card className="!rounded-[52.5px]">
            <div className="flex flex-col items-start gap-[24px] w-full px-[27px] pt-[31px] pb-[37px]">
              <img loading="lazy" src={icon.quotes} alt="" className="w-[100px]" />
              <p className="text-black text-[24px]">{item}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
