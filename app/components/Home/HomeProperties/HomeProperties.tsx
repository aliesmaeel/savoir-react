import React from "react";
import Card from "~/UI/Card";
import PropertiesSearch from "./PropertiesSearch";
import PropertiesTabs from "./PropertiesTabs";
import PropertiesSwiper from "./PropertiesSwiper";

export default function HomeProperties() {
  return (
    <Card>
      <div className="flex flex-col items-start gap-[60px] px-[45px] py-[87px] pb-[41px] w-full">
        <PropertiesSearch />
        <div className="flex flex-col items-center gap-[49px] w-full">
          <PropertiesTabs />
          <PropertiesSwiper />
        </div>
      </div>
    </Card>
  );
}
