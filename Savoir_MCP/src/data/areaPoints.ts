/**
 * Area centres for map pins - community/area centres, NOT building positions.
 *
 * Source: OpenStreetMap contributors (ODbL), via the Nominatim geocoder, retrieved 2026-10-07 in a one-time
 * run (about 1 request per second, identified user agent). Only area features inside Dubai were accepted:
 * place / administrative boundary / residential, commercial or retail land use, at least 0.5 km across.
 * Point features (stations, restaurants, single buildings, sales offices) were rejected.
 * Not placed (no verifiable area): Al Furjan, Damac Lagoons, Sobha Sanctuary, Dubailand (generic),
 * Dubai Land Residence Complex, Madinat Jumeirah Living, Palm Jebel Ali, The Wilds.
 *
 * Status: auto-geocoded, pending Savoir review. Keys are CMS community names (and a few off-plan locations).
 * The map shows © OpenStreetMap contributors in its attribution.
 */
export interface AreaPoint {
  lat: number;
  lng: number;
  /** Rough area radius, for the "approximate area" ring. */
  radius_m: number;
  osm: string;
  matched: string;
}

export const AREA_POINTS: Record<string, AreaPoint> = {
  "Al Jaddaf": { lat: 25.21426, lng: 55.32454, radius_m: 2831, osm: "relation/18471794", matched: "Al Jaddaf, Dubai, Dubai Emirate" },
  "Al Rowaiyah, Dubailand": { lat: 25.11428, lng: 55.47781, radius_m: 2220, osm: "node/13708385924", matched: "Al Rowaiyah 3, Dubai Emirate, United Arab Emirates" },
  "Arjan": { lat: 25.06033, lng: 55.23549, radius_m: 1458, osm: "way/309488167", matched: "Arjan, Al Barsha South 3, Dubai Emirate" },
  "Bukadra": { lat: 25.17686, lng: 55.3262, radius_m: 885, osm: "relation/18471797", matched: "Bukadra, Dubai, Dubai Emirate" },
  "Business Bay": { lat: 25.17946, lng: 55.26837, radius_m: 2236, osm: "relation/18471755", matched: "Business Bay, Dubai, Dubai Emirate" },
  "City Walk": { lat: 25.20816, lng: 55.26187, radius_m: 500, osm: "way/454470413", matched: "City Walk, Al Wasl, Dubai" },
  "DIFC": { lat: 25.21283, lng: 55.27763, radius_m: 509, osm: "way/396571514", matched: "Dubai International Financial Centre, Trade Centre 1, Trade Centre" },
  "Damac Hills 2": { lat: 24.98756, lng: 55.38679, radius_m: 1584, osm: "way/1012057887", matched: "Damac Hills 2, Umm Nahad 4/Madinat Hind 4, Dubai Emirate" },
  "Damac Hills": { lat: 25.02644, lng: 55.25123, radius_m: 1110, osm: "node/11795397123", matched: "Damac Hills, Al Hebiah 3, Dubai Emirate" },
  "Downtown Dubai": { lat: 25.19484, lng: 55.27819, radius_m: 1115, osm: "way/1012139061", matched: "Downtown Dubai, Dubai, Dubai Emirate" },
  "Dubai Creek Harbour (The Lagoons)": { lat: 25.19798, lng: 55.36038, radius_m: 1779, osm: "way/1012353010", matched: "Dubai Creek Harbour, Al Kheeran 1, Dubai" },
  "Dubai Creek Harbour": { lat: 25.19798, lng: 55.36038, radius_m: 1779, osm: "way/1012353010", matched: "Dubai Creek Harbour, Al Kheeran 1, Dubai" },
  "Dubai Design District (D3)": { lat: 25.18993, lng: 55.30202, radius_m: 1141, osm: "way/404591752", matched: "Dubai Design District, Dubai, Dubai Emirate" },
  "Dubai Harbour": { lat: 25.09563, lng: 55.13816, radius_m: 1234, osm: "way/1156814571", matched: "Dubai Harbour, Emaar Beachfront, Dubai Emirate" },
  "Dubai Hills Estate": { lat: 25.09741, lng: 55.26844, radius_m: 2220, osm: "node/8143204842", matched: "Dubai Hills, Hadaeq Sheikh Mohammed Bin Rashid, Dubai Emirate" },
  "Dubai Investment Park (DIP)": { lat: 24.97797, lng: 55.19119, radius_m: 2220, osm: "node/8143204859", matched: "Dubai Investments Park, Dubai Emirate, United Arab Emirates" },
  "Dubai Marina": { lat: 25.07864, lng: 55.13525, radius_m: 1710, osm: "relation/11912728", matched: "Dubai Marina, Dubai Emirate, United Arab Emirates" },
  "Dubai Media City": { lat: 25.09352, lng: 55.15157, radius_m: 1094, osm: "relation/15599971", matched: "Dubai Media City, Al Sufouh, Dubai Emirate" },
  "Dubai South (Dubai World Central)": { lat: 24.91444, lng: 55.16151, radius_m: 2220, osm: "node/11795445497", matched: "Dubai South, Dubai Emirate, United Arab Emirates" },
  "Greens": { lat: 25.09286, lng: 55.17062, radius_m: 659, osm: "way/1004755897", matched: "The Greens, Al Thanyah 1, Dubai Emirate" },
  "Jebel Ali": { lat: 25.03382, lng: 55.1366, radius_m: 2220, osm: "node/8143204857", matched: "Jabal Ali, Dubai Emirate, United Arab Emirates" },
  "Jumeirah Beach Residence": { lat: 25.0778, lng: 55.13518, radius_m: 661, osm: "way/1011430642", matched: "Jumeirah Beach Residence, Dubai Marina, Dubai Emirate" },
  "Jumeirah Golf Estates": { lat: 25.02191, lng: 55.19812, radius_m: 1563, osm: "relation/18471779", matched: "Jumeirah Golf Estates, Me’aisem 1, Dubai Emirate" },
  "Jumeirah Islands": { lat: 25.05706, lng: 55.15615, radius_m: 1238, osm: "relation/18471847", matched: "Jumeirah Islands, Al Thanyah 5, Dubai Emirate" },
  "Jumeirah Lake Towers": { lat: 25.07238, lng: 55.14374, radius_m: 1311, osm: "way/433279682", matched: "Jumeirah Lakes Towers, Dubai Emirate, United Arab Emirates" },
  "Jumeirah Village Circle": { lat: 25.05659, lng: 55.20799, radius_m: 2220, osm: "node/11800596709", matched: "Jumeirah Village Circle, Dubai Emirate, United Arab Emirates" },
  "Jumeirah": { lat: 25.20696, lng: 55.2475, radius_m: 3000, osm: "relation/11912729", matched: "Jumeirah, Dubai, Dubai Emirate" },
  "Majan": { lat: 25.09294, lng: 55.31848, radius_m: 1016, osm: "way/1012399700", matched: "Majan, Wadi Al Safa 3, Dubai Emirate" },
  "Meydan": { lat: 25.16293, lng: 55.3143, radius_m: 3000, osm: "way/1159907277", matched: "Meydan, Nad Al Sheba, Dubai" },
  "Mina Rashid": { lat: 25.27111, lng: 55.26593, radius_m: 1978, osm: "way/1148760943", matched: "Port Rashid, Dubai, Dubai Emirate" },
  "Mohammed Bin Rashid City": { lat: 25.16406, lng: 55.28566, radius_m: 1670, osm: "way/1154572974", matched: "Mohammed Bin Rashid City, MBR- Al Merkad, Dubai" },
  "Motor City": { lat: 25.04237, lng: 55.24166, radius_m: 1110, osm: "node/8143204852", matched: "Motor City, Green Community Motor City, Al Hebiah 1" },
  "Palm Jumeirah": { lat: 25.11733, lng: 55.1351, radius_m: 2749, osm: "way/874795235", matched: "Palm Jumeirah, Dubai Emirate, United Arab Emirates" },
  "Ras Al Khor": { lat: 25.19396, lng: 55.33924, radius_m: 2220, osm: "node/8143204820", matched: "Ras Al Khor, Dubai, Dubai Emirate" },
  "The Lakes": { lat: 25.08086, lng: 55.16924, radius_m: 819, osm: "way/936737587", matched: "The Lakes, Maeen, Dubai Emirate" },
  "The Valley": { lat: 24.9999, lng: 55.43059, radius_m: 3000, osm: "way/1191736311", matched: "The Valley, Al Yufrah 1, Dubai Emirate" },
  "The Views": { lat: 25.09125, lng: 55.17006, radius_m: 547, osm: "way/916889762", matched: "The Views, Al Thanyah 3, Dubai Emirate" },
  "Tilal Al Ghaf": { lat: 25.02433, lng: 55.22392, radius_m: 1398, osm: "way/655192769", matched: "Tilal Al Ghaf, Dubai Emirate, United Arab Emirates" },
  "Umm Suqeim": { lat: 25.15391, lng: 55.2075, radius_m: 2697, osm: "relation/18471749", matched: "Umm Suqeim, Dubai, Dubai Emirate" },
  // Off-plan project locations (second pass, same rules).
  "Downtown Jebel Ali": { lat: 24.95452, lng: 55.07783, radius_m: 3000, osm: "way/1161112368", matched: "Downtown Jebel Ali, Jabal Ali Industrial 2, Dubai Emirate" },
  "Dubai Islands": { lat: 25.31792, lng: 55.32632, radius_m: 3000, osm: "relation/8122161", matched: "Dubai Islands, Dubai, Dubai Emirate" },
  "Dubai Maritime City": { lat: 25.24963, lng: 55.27616, radius_m: 2220, osm: "node/8143204804", matched: "Dubai Maritime City, Al Mina, Dubai" },
  "Jumeirah Village Triangle": { lat: 25.04984, lng: 55.1907, radius_m: 1110, osm: "node/11800596710", matched: "Jumeirah Village Triangle, District 5, Al Barsha South 5" },
  "Al Wasl": { lat: 25.19593, lng: 55.25574, radius_m: 1764, osm: "relation/18471795", matched: "Al Wasl, Dubai, Dubai Emirate" },
  "Bluewaters Island": { lat: 25.07762, lng: 55.12292, radius_m: 682, osm: "way/1090798761", matched: "Bluewaters, Al Thanyah 5, Dubai Emirate" },
  "The World Islands": { lat: 25.23727, lng: 55.19549, radius_m: 3000, osm: "relation/2693943", matched: "The World, Dubai, Dubai Emirate" },
  "Dubai Investment Park 2": { lat: 24.97797, lng: 55.19119, radius_m: 2220, osm: "node/8143204859", matched: "Dubai Investments Park, Dubai Emirate, United Arab Emirates" },
};
