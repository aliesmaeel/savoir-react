/**
 * Formats a number or string price with thousand separators (commas)
 * @param price - The price value (number, string, or null/undefined)
 * @returns Formatted price string with thousand separators, or empty string if invalid
 */
export const formatPrice = (price: number | string | null | undefined): string => {
  if (price === null || price === undefined || price === "") {
    return "";
  }

  // Convert to number
  const numPrice = typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;

  // Check if valid number
  if (isNaN(numPrice)) {
    return String(price);
  }

  // Format with thousand separators
  return numPrice.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
};

const parsePriceValue = (price: number | string | null | undefined): number | null => {
  if (price === null || price === undefined || price === "") {
    return null;
  }

  if (typeof price === "number") {
    return Number.isFinite(price) ? price : null;
  }

  const normalized = price.replace(/,/g, "").trim();
  const compactMatch = normalized.match(/([\d.]+)\s*([KMB])/i);

  if (compactMatch) {
    const value = Number(compactMatch[1]);
    const suffix = compactMatch[2].toUpperCase();
    const multiplier = suffix === "B" ? 1_000_000_000 : suffix === "M" ? 1_000_000 : 1_000;

    return Number.isFinite(value) ? value * multiplier : null;
  }

  const plainValue = Number(normalized.replace(/[^\d.]/g, ""));

  return Number.isFinite(plainValue) ? plainValue : null;
};

const trimCompactDecimals = (value: number) =>
  value.toFixed(2).replace(/\.?0+$/, "");

export const formatCompactPrice = (
  price: number | string | null | undefined,
  currency = "AED"
): string => {
  const numericPrice = parsePriceValue(price);

  if (numericPrice === null) {
    return "";
  }

  const absPrice = Math.abs(numericPrice);
  let amount = "";

  if (absPrice >= 1_000_000_000) {
    amount = `${trimCompactDecimals(numericPrice / 1_000_000_000)} B`;
  } else if (absPrice >= 1_000_000) {
    amount = `${trimCompactDecimals(numericPrice / 1_000_000)} M`;
  } else if (absPrice >= 1_000) {
    amount = `${trimCompactDecimals(numericPrice / 1_000)} K`;
  } else {
    amount = numericPrice.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  }

  return [currency, amount].filter(Boolean).join(" ");
};

