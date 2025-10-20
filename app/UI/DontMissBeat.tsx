import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import Button from "./Button";

export default function DontMissBeat() {
  const icon = useIcons();
  return (
    <div
      className="flex flex-col items-start gap-[15px] lg:gap-[55px] w-full px-[15px] lg:px-[37px] pt-[15px] lg:pt-[45px] pb-[80px] lg:pb-[53px] rounded-[14px] lg:rounded-[46px] relative z-10 mt-[97px]"
      style={{
        background:
          "linear-gradient(98deg, rgba(198, 164, 90, 0.70) 65.68%, rgba(198, 164, 90, 0.00) 161.57%)",
        boxShadow:
          "33.883px -33.883px 33.883px 0 rgba(37, 37, 37, 0.07) inset, -33.883px 33.883px 33.883px 0 rgba(255, 255, 255, 0.07) inset",
      }}
    >
      <div className="flex flex-col items-start w-full">
        <p className="text-white text-[14px] lg:text-[28px] font-semibold">
          Sign up for our newsletter to stay up to date on the Dubai property market.
        </p>
        <p className="text-white text-[10px] lg:text-[18px] font-medium max-w-[86%]">
          Lorem ipsum dolor sit amet consectetur. A fringilla turpis duis eget tincidunt facilisis
          justo eget elit. Augue montes in eu mollis dictum risus blan eget commodo amet
        </p>
      </div>
      <div className="flex w-full max-w-[310px] lg:max-w-[800px] h-[28px] lg:h-[84px] rounded-[4px] lg:rounded-[10px] overflow-hidden bg-white">
        <div className="flex items-center gap-[18px] w-full px-[10px] lg:px-[30px] py-[7px] lg:py-[19px] ">
          <img loading="lazy" src={icon.dontMissEmail} alt="" className="w-[13px] lg:w-[39px]" />
          <input
            type="text"
            placeholder="Enter Your Email"
            className="w-full border-0 outline-0 bg-white text-[12px] lg:text-[29px]"
          />
        </div>
        <Button className="px-[9px] lg: lg:!px-[29px] !py-[5px] lg:!py-[18px] h-[28px] lg:h-[84px] !text-[9px] lg:!text-[29px] !rounded-[4px] lg:!rounded-[10px] shrink-0">
          Subscribe
          <img
            loading="lazy"
            src={icon.dontMissSubsicribe}
            alt=""
            className="w-[16px] lg:w-[40px]"
          />
        </Button>
      </div>

      <img
        loading="lazy"
        src={icon.Magazine}
        alt=""
        className="w-[104px] lg:w-[291px] absolute bottom-0 right-0"
      />
      <img
        loading="lazy"
        src={icon.dontMissPatern}
        alt=""
        className="absolute top-0 left-0 z-[-1]"
      />
    </div>
  );
}
