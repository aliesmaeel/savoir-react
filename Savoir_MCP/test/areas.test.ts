import { describe, expect, it } from "vitest";
import { AREAS, nearbyAreas } from "../src/data/areas.js";
import cms from "./cms-locations.json" with { type: "json" };

const known = new Set(cms.names);

describe("editorial area guide", () => {
  it("uses only location names that exist in the CMS (so every suggestion is searchable)", () => {
    for (const [area, info] of Object.entries(AREAS)) {
      expect(known.has(area), `area ${area}`).toBe(true);
      for (const n of info.nearby) expect(known.has(n), `${area} -> nearby ${n}`).toBe(true);
    }
  });

  it("returns nearby areas without repeating the inputs", () => {
    const n = nearbyAreas(["Dubai Marina", "Jumeirah Beach Residence"]);
    expect(n).not.toContain("Dubai Marina");
    expect(n).not.toContain("Jumeirah Beach Residence");
    expect(n).toContain("Dubai Harbour");
    expect(new Set(n).size).toBe(n.length);
  });
});
