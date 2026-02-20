import React from "react";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";

export default function CareerEnduringLegacy() {
  return (
    <Card className="!rounded-[15px] lg:!rounded-[67px] py-[30px] lg:py-[59px] px-[16px] lg:px-[45px]">
      <div className="flex flex-col lg:flex-row items-center gap-[35px] w-full">
        <div className="flex flex-col items-start gap-[31px] w-full">
          <GoldTitle>Enduring Legacy</GoldTitle>
          <p className="text-black text-[15px] lg:text-[22px] leading-[200%]">
            With a decades-long legacy and a proven track record of billions of dollars in real
            estate transactions, Savoir Prive is more than just a workplace; it is a testament to
            long-term success. Every member of our team is a part of our success, contributing to
            our brand story of excellence in premium real estate services.
          </p>
        </div>
        <div className="flex flex-col gap-[10px] w-full max-w-[502px]">
          <img
            loading="lazy"
            src="/images/Career/legacy1.jpg"
            alt=""
            className="w-full aspect-[502/200] rounded-[7.5px] object-cover"
          />
          <div className="flex gap-[10px] w-full">
            <img
              loading="lazy"
              src="/images/Career/legacy2.jpg"
              alt=""
              className="flex-1 aspect-[251/185] w-[49%] rounded-[7.5px] object-cover"
            />
            <img
              loading="lazy"
              src="/images/Career/legacy3.jpg"
              alt=""
              className="flex-1 aspect-[251/185] w-[49%] rounded-[7.5px] object-cover"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
