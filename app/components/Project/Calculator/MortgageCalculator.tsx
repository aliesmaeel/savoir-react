import React, { useEffect, useMemo, useState } from "react";
import Card from "~/UI/Card";
import CalculatorInput from "./CalculatorInput";
import Button from "~/UI/Button";
import { useLoaderData } from "react-router";

function parseNumber(input: string | number): number {
  if (typeof input === "number") return isFinite(input) ? input : 0;
  // keep digits and at most one dot
  const cleaned = (input || "")
    .toString()
    .replace(/[^\d.]/g, "")
    .replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function fmtCurrency(n: number, currency: string = "AED"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "AED",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));
}

function monthlyPayment({
  price,
  deposit,
  annualRatePct,
  years,
}: {
  price: number;
  deposit: number;
  annualRatePct: number;
  years: number;
}): number {
  const principal = Math.max(0, price - deposit);
  const n = Math.max(1, Math.floor(years * 12));
  const r = Math.max(0, annualRatePct) / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export default function MortgageCalculator() {
  const { property, similar } = useLoaderData() as { property: any; similar: any };

  const propertyPrice = parseNumber(property.price || 0);
  const defaultDeposit = Math.round(propertyPrice * 0.1);
  const currency = property.currency || "AED";

  const [price, setPrice] = useState<string>(propertyPrice.toLocaleString("en-US"));
  const [deposit, setDeposit] = useState<string>(defaultDeposit.toLocaleString("en-US"));
  const [years, setYears] = useState<string>("25");
  const [rate, setRate] = useState<string>("5");

  // Update values when property changes
  useEffect(() => {
    const newPropertyPrice = parseNumber(property.price || 0);
    const newDefaultDeposit = Math.round(newPropertyPrice * 0.1);
    setPrice(newPropertyPrice.toLocaleString("en-US"));
    setDeposit(newDefaultDeposit.toLocaleString("en-US"));
  }, [property.price, property.currency]);

  const calc = useMemo(() => {
    const p = parseNumber(price);
    const d = parseNumber(deposit);
    const y = parseNumber(years);
    const r = parseNumber(rate);
    return {
      p,
      d: Math.min(d, p),
      y,
      r,
      m: monthlyPayment({ price: p, deposit: Math.min(d, p), annualRatePct: r, years: y }),
    };
  }, [price, deposit, years, rate]);

  // Optional input formatting on blur with thousands separators
  const formatThousands = (v: string) =>
    parseNumber(v).toLocaleString("en-US", { maximumFractionDigits: 0 });

  const disabled =
    parseNumber(price) <= 0 ||
    parseNumber(years) <= 0 ||
    parseNumber(rate) < 0 ||
    parseNumber(deposit) < 0 ||
    parseNumber(deposit) > parseNumber(price);

  return (
    <Card>
      <div className="flex flex-col items-start gap-[30px] w-full p-[24px] lg:p-[45px] pt-[24px] lg:pt-[41px]">
        <div className="flex flex-col items-start gap-[8px]">
          <p className="text-[27px] font-semibold">Mortgage Calculator</p>
          <p className="text-[#999999] text-[18px]">Estimate your monthly mortgage payments</p>
        </div>

        <div className="grid grid-cols-2 gap-x-[15px] gap-y-[27px] w-full">
          <CalculatorInput
            label="Property Price"
            unit={currency}
            placeholder={propertyPrice.toLocaleString("en-US")}
            type="text"
            value={price}
            onChange={(e: any) => setPrice(e?.target?.value ?? "")}
            onBlur={() => setPrice(formatThousands(price))}
          />
          <CalculatorInput
            label="Deposit"
            unit={currency}
            placeholder={defaultDeposit.toLocaleString("en-US")}
            type="text"
            value={deposit}
            onChange={(e: any) => setDeposit(e?.target?.value ?? "")}
            onBlur={() => setDeposit(formatThousands(deposit))}
          />
          <CalculatorInput
            label="Mortgage Period"
            unit="Years"
            placeholder="25"
            type="number"
            value={years}
            onChange={(e: any) => setYears(e?.target?.value ?? "")}
            min={1}
          />
          <CalculatorInput
            label="Interest Rate"
            unit="%"
            placeholder="5"
            type="number"
            step="0.01"
            value={rate}
            onChange={(e: any) => setRate(e?.target?.value ?? "")}
            min={0}
          />
        </div>

        <Button className="w-full text-[21px] h-[60px]" disabled={disabled}>
          Get Pre - approved
        </Button>

        <div className="flex flex-col items-start gap-[4px]">
          <p className="text-[18px]">Monthly Payment</p>
          <p className="text-black text-[21px] font-semibold">{fmtCurrency(calc.m, currency)}</p>
          <p className="text-[12px] text-[#888]">
            Principal: {fmtCurrency(Math.max(0, calc.p - calc.d), currency)} • Term:{" "}
            {Math.max(1, Math.floor(calc.y * 12))} months • Rate: {parseNumber(rate)}% APR
          </p>
        </div>

        {disabled && (
          <p className="text-[12px] text-[#C44]">
            Check inputs. Deposit must not exceed price. Years and price must be positive.
          </p>
        )}
      </div>
    </Card>
  );
}
