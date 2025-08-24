import React from "react";
import Card from "~/UI/Card";
import CalculatorInput from "./CalculatorInput";
import Button from "~/UI/Button";

export default function RentalYieldCalculator() {
  return (
    <Card>
      <div className="flex flex-col items-start gap-[30px] w-full p-[45px] pt-[41px]">
        <div className="flex flex-col items-start gap-[8px]">
          <p className="text-[27px] font-semibold">Rental Yield Calculator</p>
          <p className="text-[#999999] text-[18px]">
            Calculate the gross and net rental yields on a property.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-[15px] gap-y-[27px] w-full">
          <CalculatorInput label="Property Price" unit="AED" placeholder="2,850,000" />
          <CalculatorInput label="Annual services charges" unit="AED" placeholder="2,850,000" />
          <CalculatorInput label="Additional charges" unit="AED" placeholder="2,850,000" />
          <CalculatorInput label="Annual rental price" unit="AED" placeholder="2,850,000" />
        </div>
        <div className="flex flex-col items-start gap-[19px] w-full">
          <div className="flex flex-col items-start gap-[11px] w-full max-w-[246px]">
            <div className="flex items-center justify-between w-full">
              <p className="text-[18px]">Net Rent</p>
              <p className="text-[18px]">NET ROI</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-black text-[21px] font-semibold">AED 13,329</p>
              <p className="text-black text-[21px] font-semibold">6.00%</p>
            </div>
          </div>
          <p className="text-[#999] text-[15px]">
            *Please note that net ROI is an average estimate and may vary depending on property
            type, location, and applicable service charges. For tailored insights, we recommend
            speaking with a local area expert
          </p>
        </div>
      </div>
    </Card>
  );
}
