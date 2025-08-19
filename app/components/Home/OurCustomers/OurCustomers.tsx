import React from "react";
import Card from "~/UI/Card";
import Title from "~/UI/Title";
import OurCustomersSwiper from "./OurCustomersSwiper";

export default function OurCustomers() {
  return (
    <Card className="flex flex-col items-start gap-[38px] pt-[33px] pb-[40px] w-full max-w-[591]">
      <div className="px-[33px]">
        <Title className="text-[30px]">Our customers love</Title>
      </div>
      <OurCustomersSwiper />
    </Card>
  );
}
