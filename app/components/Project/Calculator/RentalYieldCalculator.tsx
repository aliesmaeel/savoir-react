import React, { useMemo, useState } from "react";
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

function fmtAED(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));
}
function fmtPct(n: number): string {
  const val = isFinite(n) ? n : 0;
  return `${val.toFixed(2)}%`;
}

export default function RentalYieldCalculator() {
  const { property, similar } = useLoaderData() as { property: any; similar: any };

  const [price, setPrice] = useState(property.price);
  const [svc, setSvc] = useState("18,000");
  const [extra, setExtra] = useState("0");
  const [rent, setRent] = useState("170,000");

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
            unit="AED"
            placeholder="2,850,000"
            value={price}
            onChange={(e: any) => setPrice(e?.target?.value ?? "")}
            onBlur={() => setPrice(formatThousands(price))}
            type="text"
          />
          <CalculatorInput
            label="Annual services charges"
            unit="AED"
            placeholder="18,000"
            value={svc}
            onChange={(e: any) => setSvc(e?.target?.value ?? "")}
            onBlur={() => setSvc(formatThousands(svc))}
            type="text"
          />
          <CalculatorInput
            label="Additional charges"
            unit="AED"
            placeholder="0"
            value={extra}
            onChange={(e: any) => setExtra(e?.target?.value ?? "")}
            onBlur={() => setExtra(formatThousands(extra))}
            type="text"
          />
          <CalculatorInput
            label="Annual rental price"
            unit="AED"
            placeholder="170,000"
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
              <p className="text-black text-[21px] font-semibold">{fmtAED(calc.net)}</p>
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
