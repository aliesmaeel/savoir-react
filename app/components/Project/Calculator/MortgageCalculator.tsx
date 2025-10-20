import React from "react";
import Card from "~/UI/Card";
import CalculatorInput from "./CalculatorInput";
import Button from "~/UI/Button";

export default function MortgageCalculator() {
  return (
    <Card>
      <div className="flex flex-col items-start gap-[30px] w-full p-[24px] lg:p-[45px] pt-[24px] lg:pt-[41px]">
        <div className="flex flex-col items-start gap-[8px]">
          <p className="text-[27px] font-semibold">Mortgage Calculator</p>
          <p className="text-[#999999] text-[18px]">Estimate your monthly mortgage payments</p>
        </div>
        <div className="grid grid-cols-2 gap-x-[15px] gap-y-[27px] w-full">
          <CalculatorInput label="Property Price" unit="AED" placeholder="2,850,000" />
          <CalculatorInput label="Deposit" unit="AED" placeholder="2,850,000" />
          <CalculatorInput label="Mortgage Period" unit="Years" placeholder="23" />
          <CalculatorInput label="Interest Rate" unit="%" placeholder="5" />
        </div>
        <Button className="w-full text-[21px] h-[60px]">Get Pre - approved</Button>
        <div className="flex flex-col items-start gap-[11px]">
          <p className="text-[18px]">Monthly Payment</p>
          <p className="text-black text-[21px] font-semibold">AED 13,329</p>
        </div>
      </div>
    </Card>
  );
}
