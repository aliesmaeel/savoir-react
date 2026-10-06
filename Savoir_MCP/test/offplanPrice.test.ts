import { describe, expect, it } from "vitest";
import { parseStartingPrice, paymentSchedule } from "../src/cms/offplanPrice.js";

describe("parseStartingPrice (formats seen in the CMS)", () => {
  it.each([
    ["AED 9.32 M", 9_320_000],
    ["AED 4.2M", 4_200_000],
    ["AED 1.69 Million", 1_690_000],
    ["AED 700K", 700_000],
    ["AED 666,000", 666_000],
    ["888,000 AED", 888_000],
    ["AED 1 M", 1_000_000],
  ])("%s -> %d", (input, expected) => {
    expect(parseStartingPrice(input)).toBe(expected);
  });

  it.each(["Call Us", "", null, "AED 5", "TBA"])("%s is not a price", (input) => {
    expect(parseStartingPrice(input as string | null)).toBeNull();
  });
});

describe("paymentSchedule", () => {
  const plan = { down_payment: "20%", during_construction: "35%", on_handover: "45%" };

  it("splits a customer-provided unit price by the published percentages", () => {
    const { schedule, reason } = paymentSchedule(plan, 1_000_000, 666_000);
    expect(reason).toBeNull();
    expect(schedule!.stages.map((s) => s.amount_aed)).toEqual([200_000, 350_000, 450_000]);
    expect(schedule!.stages.reduce((a, s) => a + s.amount_aed, 0)).toBe(1_000_000);
    expect(schedule!.notes.join(" ")).toMatch(/Excludes Dubai Land Department fees/);
  });

  it("refuses when the plan is incomplete or does not add up to 100%", () => {
    expect(paymentSchedule({ down_payment: "20%", during_construction: null, on_handover: "45%" }, 1_000_000, null).schedule).toBeNull();
    const r = paymentSchedule({ down_payment: "20%", during_construction: "30%", on_handover: "40%" }, 1_000_000, null);
    expect(r.schedule).toBeNull();
    expect(r.reason).toContain("90%");
    expect(paymentSchedule(null, 1_000_000, null).reason).toMatch(/no published payment plan/);
  });

  it("warns when the unit price is below the project's starting price", () => {
    const { schedule } = paymentSchedule(plan, 500_000, 666_000);
    expect(schedule!.notes[0]).toMatch(/below the project's published starting price/);
  });
});
