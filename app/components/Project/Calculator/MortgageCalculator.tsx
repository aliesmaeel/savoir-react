import React, { useEffect, useMemo, useState } from "react";
import Card from "~/UI/Card";
import Button from "~/UI/Button";
import { useLoaderData } from "react-router";

function parseNumber(input: string | number): number {
  if (typeof input === "number") return isFinite(input) ? input : 0;

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

function MortgageField({
  label,
  unit,
  value,
  placeholder,
  type = "text",
  step,
  min,
  onChange,
  onBlur,
}: {
  label: string;
  unit: string;
  value: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  step?: number | string;
  min?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[12px]">
      <label
        className="CormorantGaramond text-[18px] leading-[1.2] lg:text-[20px]"
        style={{
          color: "#111111",
          fontWeight: 550,
          opacity: 1,
          textShadow: "0 0 0.12px #111111",
        }}
      >
        {label}
      </label>

      <div className="relative w-full">
        <input
          type={type}
          step={step}
          min={min}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          className="
            CormorantGaramond
            h-[58px]
            w-full
            rounded-[8px]
            border border-[#D9D9D9]
            bg-white
            px-[20px]
            pr-[88px]
            text-[19px]
            outline-none
            shadow-[0_12px_28px_rgba(0,0,0,0.035)]
            lg:h-[60px]
            lg:text-[22px]
          "
          style={{
            color: "#111111",
            fontWeight: 550,
            opacity: 1,
            textShadow: "0 0 0.12px #111111",
          }}
        />

        <span
          className="
            Jakarta
            pointer-events-none
            absolute
            right-[18px]
            top-1/2
            -translate-y-1/2
            text-right
            text-[12px]
            leading-none
            lg:text-[13px]
          "
          style={{
            color: "#111111",
            fontWeight: 600,
            opacity: 1,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function MortgageCalculator() {
  const { property } = useLoaderData() as { property: any; similar: any };

  const propertyPrice = parseNumber(property.price || 0);
  const defaultDeposit = Math.round(propertyPrice * 0.1);
  const currency = property.currency || "AED";

  const [price, setPrice] = useState<string>(
    propertyPrice.toLocaleString("en-US")
  );
  const [deposit, setDeposit] = useState<string>(
    defaultDeposit.toLocaleString("en-US")
  );
  const [years, setYears] = useState<string>("25");
  const [rate, setRate] = useState<string>("5");

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
      m: monthlyPayment({
        price: p,
        deposit: Math.min(d, p),
        annualRatePct: r,
        years: y,
      }),
    };
  }, [price, deposit, years, rate]);

  const formatThousands = (v: string) =>
    parseNumber(v).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });

  const disabled =
    parseNumber(price) <= 0 ||
    parseNumber(years) <= 0 ||
    parseNumber(rate) < 0 ||
    parseNumber(deposit) < 0 ||
    parseNumber(deposit) > parseNumber(price);

  return (
    <Card>
      <div className="flex w-full flex-col items-start px-[24px] py-[34px] lg:px-[45px] lg:py-[42px]">
        <div className="mb-[34px] flex w-full flex-col items-start gap-[10px]">
          <p
            className="CormorantGaramond text-[28px] leading-[1.08] lg:text-[34px]"
            style={{
              color: "#050505",
              fontWeight: 550,
              opacity: 1,
              textShadow: "0 0 0.18px #050505",
            }}
          >
            Mortgage Calculator
          </p>

          <p
            className="CormorantGaramond text-[17px] leading-[1.5] lg:text-[19px]"
            style={{
              color: "#111111",
              fontWeight: 550,
              opacity: 1,
              textShadow: "0 0 0.12px #111111",
            }}
          >
            Estimate your monthly mortgage payments
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-x-[26px] gap-y-[30px] lg:grid-cols-2">
          <MortgageField
            label="Property Price"
            unit={currency}
            placeholder={propertyPrice.toLocaleString("en-US")}
            type="text"
            value={price}
            onChange={(e: any) => setPrice(e?.target?.value ?? "")}
            onBlur={() => setPrice(formatThousands(price))}
          />

          <MortgageField
            label="Deposit"
            unit={currency}
            placeholder={defaultDeposit.toLocaleString("en-US")}
            type="text"
            value={deposit}
            onChange={(e: any) => setDeposit(e?.target?.value ?? "")}
            onBlur={() => setDeposit(formatThousands(deposit))}
          />

          <MortgageField
            label="Mortgage Period"
            unit="Years"
            placeholder="25"
            type="number"
            value={years}
            onChange={(e: any) => setYears(e?.target?.value ?? "")}
            min={1}
          />

          <MortgageField
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

        <Button
          className="
            mt-[34px]
            h-[42px]
            w-auto
            !rounded-[8px]
            !bg-[#2B2B2B]
            !px-[42px]
            !py-[9px]
            text-[15px]
            font-semibold
            !text-white
            shadow-[0_10px_24px_rgba(43,43,43,0.18)]
            transition-all
            duration-300
            hover:!bg-[#242424]
            lg:h-[44px]
            lg:!px-[54px]
            lg:text-[16px]
          "
          disabled={disabled}
        >
          Get Pre - approved
        </Button>

        <div className="mt-[34px] flex w-full flex-col items-start gap-[8px]">
          <p
            className="CormorantGaramond text-[19px] leading-[1.4]"
            style={{
              color: "#111111",
              fontWeight: 550,
              opacity: 1,
              textShadow: "0 0 0.12px #111111",
            }}
          >
            Monthly Payment
          </p>

          <p
            className="CormorantGaramond text-[25px] leading-[1.2] lg:text-[30px]"
            style={{
              color: "#111111",
              fontWeight: 550,
              opacity: 1,
              textShadow: "0 0 0.14px #111111",
            }}
          >
            {fmtCurrency(calc.m, currency)}
          </p>

          <p
            className="CormorantGaramond text-[15px] leading-[1.5]"
            style={{
              color: "#111111",
              fontWeight: 550,
              opacity: 1,
              textShadow: "0 0 0.1px #111111",
            }}
          >
            Principal: {fmtCurrency(Math.max(0, calc.p - calc.d), currency)} •
            Term: {Math.max(1, Math.floor(calc.y * 12))} months • Rate:{" "}
            {parseNumber(rate)}% APR
          </p>
        </div>

        {disabled && (
          <p
            className="CormorantGaramond mt-[16px] text-[14px] leading-[1.5]"
            style={{
              color: "#C44",
              fontWeight: 550,
              opacity: 1,
            }}
          >
            Check inputs. Deposit must not exceed price. Years and price must be
            positive.
          </p>
        )}
      </div>
    </Card>
  );
}