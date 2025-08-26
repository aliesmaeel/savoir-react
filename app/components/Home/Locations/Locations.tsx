import React from "react";
import Card from "~/UI/Card";
import LocationsSwiper from "./LocationsSwiper";

export default function Locations() {
  return (
    <Card className="h-full">
      <div className="pt-[38px] pb-[36px]">
        <LocationsSwiper />
      </div>
    </Card>
  );
}
