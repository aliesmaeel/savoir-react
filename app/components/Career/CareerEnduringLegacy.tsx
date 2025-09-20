import React from "react";
import Card from "~/UI/Card";
import GoldTitle from "~/UI/GoldTitle";

export default function CareerEnduringLegacy() {
  return (
    <Card className="!rounded-[67px] py-[59px] px-[45px]">
      <div className="flex items-center gap-[35px] w-full">
        <div className="flex flex-col items-start gap-[31px] w-full">
          <GoldTitle>Enduring Legacy</GoldTitle>
          <p className="text-black text-[22px] leading-[200%]">
            With a decades-long legacy and a proven track record of billions of dollars in real
            estate transactions, Savoir Prive is more than just a workplace; it is a testament to
            long-term success. Every member of our team is a part of our success, contributing to
            our brand story of excellence in premium real estate services.
          </p>
        </div>
        <img
          src="/images/placeholders/CareerEnduringLegacy.png"
          alt=""
          className="w-[502px] aspect-[502/385] rounded-[7.5px] object-cover"
        />
      </div>
    </Card>
  );
}
