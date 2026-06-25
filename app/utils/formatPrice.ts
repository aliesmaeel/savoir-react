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

