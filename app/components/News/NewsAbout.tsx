import React from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import Button from "~/UI/Button";
import Header from "~/UI/Header";

export default function NewsAbout() {
  const arrow = useArrow();
  return (
    <div className="flex flex-col items-start gap-[18px] w-full">
      <Header className="text-[28px] leading-[1.05] lg:text-[44px]">About SAVOIR :</Header>
      <p className="text-[15px] font-semibold leading-[175%] text-[#111111] lg:text-[20px]">
        SAVOIR is honored and proud to announce its exclusive representation of the
        prestigious Elounda Hills project in the GCC region. We are excited to bring this
        exceptional opportunity to investors and homebuyers seeking a luxurious and sophisticated
        lifestyle in one of the most beautiful and sought-after locations in...SAVOIR
        Properties is honored and proud to announce its exclusive representation of the prestigious
        Elounda Hills project in the GCC region. We are excited to bring this exceptional
        opportunity to investors and homebuyers seeking a luxurious and sophisticated lifestyle in
        one of the most beautiful and sought-after locations in...
      </p>
      <Button className="w-[299px]">
        Read more{" "}
        <img loading="lazy" src={arrow.longWhite} alt="" className="w-[17px] rotate-[-45deg]" />
      </Button>
    </div>
  );
}
