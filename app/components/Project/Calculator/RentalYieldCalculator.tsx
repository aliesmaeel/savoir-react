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
  
  // Calculate defaults: annual rental = 7% of price, service charges = 0
  const defaultAnnualRent = Math.round(propertyPrice * 0.07);
  const defaultServiceCharges = 0;

  const [price, setPrice] = useState<string>(propertyPrice.toLocaleString("en-US"));
  const [svc, setSvc] = useState<string>("0");
  const [extra, setExtra] = useState<string>("0");
  const [rent, setRent] = useState<string>(defaultAnnualRent.toLocaleString("en-US"));

  // Update values when property changes
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
      <div className="flex flex-col items-start gap-[30px] w-full p-[24px] lg:p-[45px] pt-[24px] lg:pt-[41px]">
        <div className="flex flex-col items-start gap-[8px]">
          <p className="text-[27px] font-semibold">Rental Yield Calculator</p>
          <p className="text-[#999999] text-[18px]">
            Calculate the gross and net rental yields on a property.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-[15px] gap-y-[27px] w-full">
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

        <div className="flex flex-col items-start gap-[19px] w-full">
          <div className="flex flex-col items-start gap-[11px] w-full max-w-[360px]">
            <div className="flex items-center justify-between w-full">
              <p className="text-[18px]">Net Rent</p>
              <p className="text-[18px]">NET ROI</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-black text-[21px] font-semibold">{fmtCurrency(calc.net, currency)}</p>
              <p className="text-black text-[21px] font-semibold">{fmtPct(calc.netRoi)}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-[14px] text-[#666]">Gross ROI</p>
              <p className="text-[14px] text-[#000] font-medium">{fmtPct(calc.grossRoi)}</p>
            </div>
          </div>

          {invalid ? (
            <p className="text-[#C44] text-[12px]">
              Enter a positive price. Other fields must be zero or positive.
            </p>
          ) : null}

          <p className="text-[#999] text-[15px]">
            *Net ROI is an estimate. Actuals vary by property type, location, and service charges.
          </p>
        </div>
      </div>
    </Card>
  );
}
