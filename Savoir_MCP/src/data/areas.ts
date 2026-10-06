/**
 * Editorial Dubai area guide used for discovery and search recovery.
 *
 * REVIEW STATUS: drafted from general knowledge of Dubai. Savoir should review it before release.
 * - Names must match CMS location names exactly (checked against /api/search-suggestions
 *   on 6 Oct 2026; a unit test enforces this against a fixture of those names).
 * - "nearby" only lists neighbours that also exist in the CMS, so every recovery suggestion
 *   is a real, searchable location. It is presented to customers as "nearby (editorial)".
 * - Tags describe the general character of an area, never a specific listing.
 *   Listing-level facts (amenities, views) come only from CMS listing details.
 */

export const AREA_TAGS = {
  beachfront: "Beachfront",
  waterfront: "Waterfront / marina",
  city_centre: "City centre",
  business_district: "Business district",
  golf: "Golf community",
  family_villas: "Villa / family community",
  value: "More affordable",
  new_community: "Newer master community",
} as const;
export type AreaTag = keyof typeof AREA_TAGS;
export const AREA_TAG_KEYS = Object.keys(AREA_TAGS) as [AreaTag, ...AreaTag[]];

export interface AreaInfo {
  tags: AreaTag[];
  nearby: string[];
}

export const AREA_GUIDE_REVIEW_STATUS = "editorial draft — pending Savoir review";

export const AREAS: Record<string, AreaInfo> = {
  "Dubai Marina": { tags: ["waterfront"], nearby: ["Jumeirah Beach Residence", "Jumeirah Lake Towers", "Dubai Harbour", "Palm Jumeirah", "Dubai Media City"] },
  "Jumeirah Beach Residence": { tags: ["beachfront", "waterfront"], nearby: ["Dubai Marina", "Dubai Harbour", "Jumeirah Lake Towers"] },
  "Dubai Harbour": { tags: ["waterfront", "beachfront"], nearby: ["Emaar Beachfront", "Dubai Marina", "Palm Jumeirah", "Jumeirah Beach Residence"] },
  "Emaar Beachfront": { tags: ["beachfront", "waterfront"], nearby: ["Dubai Harbour", "Dubai Marina", "Palm Jumeirah"] },
  "Palm Jumeirah": { tags: ["beachfront", "waterfront"], nearby: ["Dubai Harbour", "Dubai Marina", "Jumeirah Beach Residence"] },
  "Jumeirah Lake Towers": { tags: ["waterfront", "value"], nearby: ["Dubai Marina", "Jumeirah Islands", "Jumeirah Beach Residence", "Greens"] },
  "Dubai Media City": { tags: ["business_district"], nearby: ["Dubai Marina", "Greens", "The Views"] },
  Greens: { tags: [], nearby: ["The Views", "Dubai Media City", "The Lakes"] },
  "The Views": { tags: ["golf"], nearby: ["Greens", "The Lakes", "Dubai Media City"] },
  "The Lakes": { tags: ["family_villas"], nearby: ["The Views", "Greens", "Jumeirah Islands"] },
  "Jumeirah Islands": { tags: ["family_villas", "waterfront"], nearby: ["Jumeirah Lake Towers", "The Lakes"] },
  "Downtown Dubai": { tags: ["city_centre"], nearby: ["Business Bay", "DIFC", "City Walk"] },
  "Business Bay": { tags: ["business_district", "waterfront"], nearby: ["Downtown Dubai", "DIFC", "Meydan", "Al Jaddaf"] },
  DIFC: { tags: ["business_district", "city_centre"], nearby: ["Downtown Dubai", "Business Bay", "City Walk"] },
  "City Walk": { tags: ["city_centre"], nearby: ["Downtown Dubai", "DIFC", "Jumeirah"] },
  Jumeirah: { tags: ["beachfront", "family_villas"], nearby: ["Umm Suqeim", "City Walk"] },
  "Umm Suqeim": { tags: ["beachfront", "family_villas"], nearby: ["Jumeirah"] },
  "Dubai Creek Harbour (The Lagoons)": { tags: ["waterfront", "new_community"], nearby: ["Ras Al Khor", "Al Jaddaf"] },
  "Al Jaddaf": { tags: ["waterfront"], nearby: ["Dubai Creek Harbour (The Lagoons)", "Business Bay"] },
  "Ras Al Khor": { tags: [], nearby: ["Dubai Creek Harbour (The Lagoons)", "Meydan", "Bukadra"] },
  Bukadra: { tags: ["new_community"], nearby: ["Meydan", "Ras Al Khor"] },
  "Mohammed Bin Rashid City": { tags: ["new_community", "family_villas"], nearby: ["Meydan", "Sobha Hartland", "Business Bay"] },
  "Sobha Hartland": { tags: ["new_community"], nearby: ["Mohammed Bin Rashid City", "Meydan"] },
  Meydan: { tags: ["new_community"], nearby: ["Mohammed Bin Rashid City", "Business Bay", "Sobha Hartland"] },
  "Dubai Hills Estate": { tags: ["golf", "family_villas", "new_community"], nearby: ["Mohammed Bin Rashid City", "Arjan"] },
  "Jumeirah Village Circle": { tags: ["value"], nearby: ["Arjan", "Motor City"] },
  Arjan: { tags: ["value"], nearby: ["Jumeirah Village Circle", "Majan", "Dubai Hills Estate"] },
  Majan: { tags: ["value", "new_community"], nearby: ["Arjan"] },
  "Motor City": { tags: ["value"], nearby: ["Jumeirah Village Circle", "Damac Hills"] },
  "Damac Hills": { tags: ["golf", "family_villas"], nearby: ["Motor City", "Tilal Al Ghaf", "Damac Lagoons"] },
  "Damac Lagoons": { tags: ["family_villas", "new_community"], nearby: ["Damac Hills"] },
  "Tilal Al Ghaf": { tags: ["family_villas", "new_community"], nearby: ["Damac Hills"] },
  "Damac Hills 2": { tags: ["family_villas", "value"], nearby: [] },
  "Jumeirah Golf Estates": { tags: ["golf", "family_villas"], nearby: ["Al Furjan"] },
  "Al Furjan": { tags: ["family_villas", "value"], nearby: ["Jumeirah Golf Estates", "Jebel Ali", "Dubai Investment Park (DIP)"] },
  "Jebel Ali": { tags: ["value"], nearby: ["Al Furjan"] },
  "Dubai Investment Park (DIP)": { tags: ["value"], nearby: ["Al Furjan", "Dubai South (Dubai World Central)"] },
  "Dubai South (Dubai World Central)": { tags: ["value", "new_community"], nearby: ["Dubai Investment Park (DIP)"] },
  "Mina Rashid": { tags: ["waterfront"], nearby: [] },
};

/** Editorial neighbours of the given CMS location names (excluding the inputs). */
export function nearbyAreas(names: string[], max = 6): string[] {
  const out: string[] = [];
  for (const n of names) for (const nb of AREAS[n]?.nearby ?? []) if (!names.includes(nb) && !out.includes(nb)) out.push(nb);
  return out.slice(0, max);
}
