/**
 * Off-plan pricing helpers.
 *
 * - The CMS "starting_price" is free text for the cheapest unit ("AED 1.99M", "AED 700K",
 *   "AED 666,000", "888,000 AED", "AED 1.69 Million", "Call Us"). It is used only to answer
 *   "projects starting within my budget", and never as the price of any particular unit.
 * - A payment schedule is calculated only from a unit price the customer provides,
 *   and only when the published plan's percentages add up to 100%.
 */

/** Parse a free-text starting price to AED, or null when it is not a price. */
export function parseStartingPrice(text: string | null | undefined): number | null {
  if (!text) return null;
  const m = text.replace(/\s+/g, " ").match(/(\d[\d,]*(?:\.\d+)?)\s*(million|mn|m|k)?\b/i);
  if (!m || !m[1]) return null;
  const base = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(base) || base <= 0) return null;
  const unit = (m[2] ?? "").toLowerCase();
  const value = unit === "k" ? base * 1_000 : unit === "m" || unit === "mn" || unit === "million" ? base * 1_000_000 : base;
  // Guard against nonsense such as "AED 5" (no unit): off-plan units start well above 10k.
  return value >= 10_000 && value <= 5_000_000_000 ? Math.round(value) : null;
}

export interface PlanStage {
  stage: "down_payment" | "during_construction" | "on_handover";
  label: string;
  percent: number;
}

export interface PaymentSchedule {
  unit_price_aed: number;
  stages: Array<PlanStage & { amount_aed: number }>;
  total_percent: number;
  notes: string[];
}

const pct = (s: string | null): number | null => {
  if (!s) return null;
  const n = Number(s.replace("%", "").trim());
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : null;
};

/** Returns null (with a reason) unless the plan is complete and sums to 100%. */
export function paymentSchedule(
  plan: { down_payment: string | null; during_construction: string | null; on_handover: string | null } | null,
  unitPriceAed: number,
  startingPriceAed: number | null,
): { schedule: PaymentSchedule | null; reason: string | null } {
  if (!plan) return { schedule: null, reason: "This project has no published payment plan." };
  const stages: PlanStage[] = [
    { stage: "down_payment", label: "Down payment", percent: pct(plan.down_payment) ?? NaN },
    { stage: "during_construction", label: "During construction", percent: pct(plan.during_construction) ?? NaN },
    { stage: "on_handover", label: "On handover", percent: pct(plan.on_handover) ?? NaN },
  ];
  if (stages.some((s) => Number.isNaN(s.percent))) {
    return { schedule: null, reason: "The published payment plan is incomplete, so amounts cannot be calculated." };
  }
  const total = stages.reduce((a, s) => a + s.percent, 0);
  if (Math.abs(total - 100) > 0.5) {
    return { schedule: null, reason: `The published plan adds up to ${total}%, not 100%, so amounts cannot be calculated reliably.` };
  }
  const notes = [
    "Illustration based on the unit price you provided, not an official schedule.",
    "Excludes Dubai Land Department fees, registration, service charges and any other costs.",
    "Developers may split stages into several instalments; confirm the official schedule with Savoir.",
  ];
  if (startingPriceAed !== null && unitPriceAed < startingPriceAed) {
    notes.unshift("The price you provided is below the project's published starting price; please double-check it.");
  }
  return {
    schedule: {
      unit_price_aed: unitPriceAed,
      stages: stages.map((s) => ({ ...s, amount_aed: Math.round((unitPriceAed * s.percent) / 100) })),
      total_percent: total,
      notes,
    },
    reason: null,
  };
}
