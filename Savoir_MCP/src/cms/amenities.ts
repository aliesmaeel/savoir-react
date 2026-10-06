/**
 * Lifestyle needs that can be VERIFIED per listing from the CMS amenity list
 * (property.features, a portal vocabulary). The CMS cannot search by amenity,
 * so these are checked on listing details, never sent as a search filter.
 * Labels verified on live listing details (Oct 2026).
 */
export const AMENITIES = {
  private_pool: { label: "Private pool", match: ["private pool"] },
  shared_pool: { label: "Shared pool", match: ["shared pool"] },
  pool_any: { label: "Pool (private or shared)", match: ["private pool", "shared pool"] },
  gym: { label: "Gym", match: ["shared gym", "private gym"] },
  water_view: { label: "Water view", match: ["view of water"] },
  balcony: { label: "Balcony", match: ["balcony"] },
  maids_room: { label: "Maid's room", match: ["maids room", "maid's room"] },
  covered_parking: { label: "Covered parking", match: ["covered parking"] },
  security: { label: "Security", match: ["security"] },
  kids_play_area: { label: "Children's play area", match: ["childrens play area", "children's play area"] },
  walk_in_closet: { label: "Walk-in closet", match: ["walk in closet", "walk-in closet"] },
  built_in_wardrobes: { label: "Built-in wardrobes", match: ["built in wardrobes", "built-in wardrobes"] },
} as const;
export type AmenityKey = keyof typeof AMENITIES;
export const AMENITY_KEYS = Object.keys(AMENITIES) as [AmenityKey, ...AmenityKey[]];

export interface AmenityCheck {
  checked: true;
  matched: AmenityKey[];
  not_listed: AmenityKey[];
}

/** Compare requested amenities against a listing's verified amenity list. */
export function checkAmenities(listed: string[], wanted: AmenityKey[]): AmenityCheck {
  const have = listed.map((a) => a.toLowerCase().trim());
  const matched: AmenityKey[] = [];
  const not_listed: AmenityKey[] = [];
  for (const k of wanted) (AMENITIES[k].match.some((m) => have.includes(m)) ? matched : not_listed).push(k);
  return { checked: true, matched, not_listed };
}
