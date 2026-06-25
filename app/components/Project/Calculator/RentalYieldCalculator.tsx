import React, { useEffect, useMemo, useState } from "react";
import Card from "~/UI/Card";
import CalculatorInput from "./CalculatorInput";
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

function fmtPct(n: number): string {
  const val = isFinite(n) ? n : 0;
  return `${val.toFixed(2)}%`;
}

export default function RentalYieldCalculator() {
  const { property, similar } = useLoaderData() as { property: any; similar: any };

  const propertyPrice = parseNumber(property.price || 0);
  const currency = property.currency || "AED";

  const defaultAnnualRent = Math.round(propertyPrice * 0.07);
  const defaultServiceCharges = 0;

  const [price, setPrice] = useState<string>(propertyPrice.toLocaleString("en-US"));
  const [svc, setSvc] = useState<string>("0");
  const [extra, setExtra] = useState<string>("0");
  const [rent, setRent] = useState<string>(defaultAnnualRent.toLocaleString("en-US"));

  useEffect(() => {
    const newPropertyPrice = parseNumber(property.price || 0);
    const newDefaultAnnualRent = Math.round(newPropertyPrice * 0.07);

    setPrice(newPropertyPrice.toLocaleString("en-US"));
    setSvc("0");
    setRent(newDefaultAnnualRent.toLocaleString("en-US"));
  }, [property.price, property.currency]);

  const calc = useMemo(() => {
    const p = parseNumber(price);
    const s = parseNumber(svc);
    const e = parseNumber(extra);
    const r = parseNumber(rent);

    const net = Math.max(0, r - s - e);
    const grossRoi = p > 0 ? (r / p) * 100 : 0;
    const netRoi = p > 0 ? (net / p) * 100 : 0;

    return { p, s, e, r, net, grossRoi, netRoi };
  }, [price, svc, extra, rent]);

  const formatThousands = (v: string) =>
    parseNumber(v).toLocaleString("en-US", { maximumFractionDigits: 0 });

  const invalid =
    parseNumber(price) <= 0 ||
    parseNumber(rent) < 0 ||
    parseNumber(svc) < 0 ||
    parseNumber(extra) < 0;

  return (
    <Card>
      <div
        className="
          flex w-full flex-col items-start gap-[30px] p-[24px] pt-[24px]
          lg:p-[45px] lg:pt-[41px]

          [&_input]:!text-[#111111]
          [&_input]:!font-semibold
          [&_input::placeholder]:!text-[#111111]
          [&_input::placeholder]:!opacity-100
          [&_label]:!text-[#111111]
          [&_label]:!font-semibold
        "
      >
        <div className="flex flex-col items-start gap-[8px]">
          <p
            className="CormorantGaramond text-[28px] leading-[1.05] lg:text-[44px]"
            style={{
              color: "#111111",
              fontWeight: 700,
              opacity: 1,
            }}
          >
            Rental Yield Calculator
          </p>

          <p
            className="text-[15px] leading-[165%] lg:text-[18px]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            Calculate the gross and net rental yields on a property.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-x-[15px] gap-y-[27px]">
          <CalculatorInput
            label="Property Price"
            unit={currency}
            placeholder={propertyPrice.toLocaleString("en-US")}
            value={price}
            onChange={(e: any) => setPrice(e?.target?.value ?? "")}
            onBlur={() => setPrice(formatThousands(price))}
            type="text"
          />

          <CalculatorInput
            label="Annual services charges"
            unit={currency}
            placeholder="0"
            value={svc}
            onChange={(e: any) => setSvc(e?.target?.value ?? "")}
            onBlur={() => setSvc(formatThousands(svc))}
            type="text"
          />

          <CalculatorInput
            label="Additional charges"
            unit={currency}
            placeholder="0"
            value={extra}
            onChange={(e: any) => setExtra(e?.target?.value ?? "")}
            onBlur={() => setExtra(formatThousands(extra))}
            type="text"
          />

          <CalculatorInput
            label="Annual rental price"
            unit={currency}
            placeholder={defaultAnnualRent.toLocaleString("en-US")}
            value={rent}
            onChange={(e: any) => setRent(e?.target?.value ?? "")}
            onBlur={() => setRent(formatThousands(rent))}
            type="text"
          />
        </div>

        <div className="flex w-full flex-col items-start gap-[19px]">
          <div className="flex w-full max-w-[360px] flex-col items-start gap-[11px]">
            <div className="flex w-full items-center justify-between">
              <p
                className="text-[18px]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                Net Rent
              </p>

              <p
                className="text-[18px]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                NET ROI
              </p>
            </div>

            <div className="flex w-full items-center justify-between">
              <p
                className="text-[21px]"
                style={{
                  color: "#111111",
                  fontWeight: 700,
                  opacity: 1,
                }}
              >
                {fmtCurrency(calc.net, currency)}
              </p>

              <p
                className="text-[21px]"
                style={{
                  color: "#111111",
                  fontWeight: 700,
                  opacity: 1,
                }}
              >
                {fmtPct(calc.netRoi)}
              </p>
            </div>

            <div className="flex w-full items-center justify-between">
              <p
                className="text-[14px]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                Gross ROI
              </p>

              <p
                className="text-[14px]"
                style={{
                  color: "#111111",
                  fontWeight: 700,
                  opacity: 1,
                }}
              >
                {fmtPct(calc.grossRoi)}
              </p>
            </div>
          </div>

          {invalid ? (
            <p
              className="text-[12px]"
              style={{
                color: "#C44",
                fontWeight: 600,
                opacity: 1,
              }}
            >
              Enter a positive price. Other fields must be zero or positive.
            </p>
          ) : null}

          <p
            className="text-[15px] leading-[160%]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            *Net ROI is an estimate. Actuals vary by property type, location, and service charges.
          </p>
        </div>
      </div>
    </Card>
  );
}
