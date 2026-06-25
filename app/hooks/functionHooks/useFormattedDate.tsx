// useFormattedDate.ts
import { useMemo } from "react";

type Variant = "date" | "time" | "datetime" | "relative" | "custom";
type DateLike = Date | number | string | null | undefined;

export interface UseFormattedDateOptions {
  variant?: Variant;
  locale?: string;
  timeZone?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
  custom?: Intl.DateTimeFormatOptions;
  numeric?: "always" | "auto"; // relative only
  now?: Date | number | string; // relative only
}

function toDate(input: DateLike): Date | null {
  if (input == null) return null;
  if (input instanceof Date) return isNaN(+input) ? null : input;
  const d = new Date(input);
  return isNaN(+d) ? null : d;
}

function diffInLargestUnit(from: Date, to: Date) {
  const ms = +from - +to;
  const abs = Math.abs(ms);
  const min = 60_000,
    hr = 60 * min,
    day = 24 * hr,
    wk = 7 * day,
    mo = 30 * day,
    yr = 365 * day;
  if (abs >= yr) return { value: Math.round(ms / yr), unit: "year" as const };
  if (abs >= mo) return { value: Math.round(ms / mo), unit: "month" as const };
  if (abs >= wk) return { value: Math.round(ms / wk), unit: "week" as const };
  if (abs >= day) return { value: Math.round(ms / day), unit: "day" as const };
  if (abs >= hr) return { value: Math.round(ms / hr), unit: "hour" as const };
  if (abs >= min) return { value: Math.round(ms / min), unit: "minute" as const };
  return { value: Math.round(ms / 1000), unit: "second" as const };
}

export function useFormattedDate(input: DateLike, opts: UseFormattedDateOptions = {}) {
  const date = toDate(input);

  const {
    variant = "date",
    locale = typeof navigator !== "undefined" ? navigator.language : "en-US",
    timeZone,
    dateStyle = "medium",
    timeStyle,
    custom,
    numeric = "auto",
    now,
  } = opts;

  const value = useMemo(() => {
    if (!date) return "";

    if (variant === "relative") {
      const base = toDate(now) ?? new Date();
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric });
      const { value, unit } = diffInLargestUnit(date, base);
      return rtf.format(value, unit);
    }

    const options: Intl.DateTimeFormatOptions =
      variant === "custom"
        ? { ...custom }
        : {
            ...(variant !== "time" ? { dateStyle } : {}),
            ...(variant !== "date"
              ? { timeStyle: timeStyle ?? (variant === "time" ? "short" : undefined) }
              : {}),
          };

    if (timeZone) options.timeZone = timeZone;

    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch {
      const fallback: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: variant !== "date" ? "2-digit" : undefined,
        minute: variant !== "date" ? "2-digit" : undefined,
        timeZone,
      };
      return new Intl.DateTimeFormat(locale, fallback).format(date);
    }
  }, [
    date ? date.getTime() : 0,
    variant,
    locale,
    timeZone,
    dateStyle,
    timeStyle,
    custom,
    numeric,
    now,
  ]);

  return value;
}
