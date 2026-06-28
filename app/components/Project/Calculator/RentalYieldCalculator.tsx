import React, { useEffect, useMemo, useState } from "react";
import Card from "~/UI/Card";
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

function RentalField({
  label,
  unit,
  value,
  placeholder,
  type = "text",
  onChange,
  onBlur,
}: {
  label: string;
  unit: string;
  value: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[12px]">
      <label
        className="text-[17px] leading-[1.2] lg:text-[18px]"
        style={{
          color: "#111111",
          fontWeight: 800,
          opacity: 1,
        }}
      >
        {label}
      </label>

      <div className="relative w-full">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          className="
            h-[58px]
            w-full
            rounded-[8px]
            border border-[#DDDDDD]
            bg-white
            px-[20px]
            pr-[88px]
            text-[18px]
            outline-none
            shadow-[0_12px_28px_rgba(0,0,0,0.035)]
            lg:h-[60px]
            lg:text-[20px]
          "
          style={{
            color: "#111111",
            fontWeight: 700,
            opacity: 1,
          }}
        />

        <span
          className="
            pointer-events-none
            absolute
            right-[18px]
            top-1/2
            -translate-y-1/2
            text-right
            text-[13px]
            leading-none
            lg:text-[14px]
          "
          style={{
            color: "#111111",
            fontWeight: 800,
            opacity: 1,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function RentalYieldCalculator() {
  const { property } = useLoaderData() as { property: any; similar: any };

  const propertyPrice = parseNumber(property.price || 0);
  const currency = property.currency || "AED";

  const defaultAnnualRent = Math.round(propertyPrice * 0.07);

  const [price, setPrice] = useState<string>(
    propertyPrice.toLocaleString("en-US")
  );
  const [svc, setSvc] = useState<string>("0");
  const [extra, setExtra] = useState<string>("0");
  const [rent, setRent] = useState<string>(
    defaultAnnualRent.toLocaleString("en-US")
  );

  useEffect(() => {
    const newPropertyPrice = parseNumber(property.price || 0);
    const newDefaultAnnualRent = Math.round(newPropertyPrice * 0.07);

    setPrice(newPropertyPrice.toLocaleString("en-US"));
    setSvc("0");
    setExtra("0");
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
    parseNumber(v).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });

  const invalid =
    parseNumber(price) <= 0 ||
    parseNumber(rent) < 0 ||
    parseNumber(svc) < 0 ||
    parseNumber(extra) < 0;

  return (
    <Card>
      <div className="flex w-full flex-col items-start px-[24px] py-[34px] lg:px-[45px] lg:py-[42px]">
        <div className="mb-[34px] flex w-full flex-col items-start gap-[10px]">
          <p
            className="CormorantGaramond text-[32px] leading-[1.05] lg:text-[42px]"
            style={{
              color: "#111111",
              fontWeight: 700,
              opacity: 1,
            }}
          >
            Rental Yield Calculator
          </p>

          <p
            className="text-[16px] leading-[1.5] lg:text-[18px]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            Calculate the gross and net rental yields on a property.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-x-[26px] gap-y-[30px] lg:grid-cols-2">
          <RentalField
            label="Property Price"
            unit={currency}
            placeholder={propertyPrice.toLocaleString("en-US")}
            value={price}
            onChange={(e: any) => setPrice(e?.target?.value ?? "")}
            onBlur={() => setPrice(formatThousands(price))}
            type="text"
          />

          <RentalField
            label="Annual services charges"
            unit={currency}
            placeholder="0"
            value={svc}
            onChange={(e: any) => setSvc(e?.target?.value ?? "")}
            onBlur={() => setSvc(formatThousands(svc))}
            type="text"
          />

          <RentalField
            label="Additional charges"
            unit={currency}
            placeholder="0"
            value={extra}
            onChange={(e: any) => setExtra(e?.target?.value ?? "")}
            onBlur={() => setExtra(formatThousands(extra))}
            type="text"
          />

          <RentalField
            label="Annual rental price"
            unit={currency}
            placeholder={defaultAnnualRent.toLocaleString("en-US")}
            value={rent}
            onChange={(e: any) => setRent(e?.target?.value ?? "")}
            onBlur={() => setRent(formatThousands(rent))}
            type="text"
          />
        </div>

        <div className="mt-[34px] flex w-full flex-col items-start gap-[22px]">
          <div className="grid w-full grid-cols-2 gap-x-[26px]">
            <div className="flex flex-col items-start gap-[10px]">
              <p
                className="text-[18px] leading-[1.4]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                Net Rent
              </p>

              <p
                className="CormorantGaramond text-[24px] leading-[1.2] lg:text-[28px]"
                style={{
                  color: "#111111",
                  fontWeight: 700,
                  opacity: 1,
                }}
              >
                {fmtCurrency(calc.net, currency)}
              </p>

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
            </div>

            <div className="flex flex-col items-start gap-[10px]">
              <p
                className="text-[18px] leading-[1.4]"
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  opacity: 1,
                }}
              >
                NET ROI
              </p>

              <p
                className="CormorantGaramond text-[24px] leading-[1.2] lg:text-[28px]"
                style={{
                  color: "#111111",
                  fontWeight: 700,
                  opacity: 1,
                }}
              >
                {fmtPct(calc.netRoi)}
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
              className="text-[13px] leading-[1.5]"
              style={{
                color: "#C44",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              Enter a positive price. Other fields must be zero or positive.
            </p>
          ) : null}

          <p
            className="text-[14px] leading-[160%] lg:text-[15px]"
            style={{
              color: "#111111",
              fontWeight: 600,
              opacity: 1,
            }}
          >
            *Net ROI is an estimate. Actuals vary by property type, location,
            and service charges.
          </p>
        </div>
      </div>
    </Card>
  );
}