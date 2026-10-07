import { AREA_POINTS } from "./areaPoints.js";
import type { MapPoint } from "../schemas.js";

const norm = (s: string) => s.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
const byName = new Map<string, { name: string; lat: number; lng: number; radius_m: number }>();
for (const [name, p] of Object.entries(AREA_POINTS)) {
  byName.set(norm(name), { name, ...p });
  // "Dubai Creek Harbour (The Lagoons)" is also known by its parenthetical name.
  const alias = /\(([^)]+)\)/.exec(name);
  if (alias && !byName.has(norm(alias[1]!))) byName.set(norm(alias[1]!), { name, ...p });
}
// Spelling variants used in CMS listings for the same place.
const VARIANTS: Record<string, string> = { "Dubai Island": "Dubai Islands" };
for (const [variant, name] of Object.entries(VARIANTS)) {
  const p = AREA_POINTS[name];
  if (p && !byName.has(norm(variant))) byName.set(norm(variant), { name, ...p });
}

/** Area-level point for the first name that matches a known area (community names from the CMS). */
export function areaPoint(...names: Array<string | null | undefined>): MapPoint | null {
  for (const n of names) {
    if (!n) continue;
    for (const part of [n, ...n.split(/[,—-]/)]) {
      const hit = byName.get(norm(part));
      if (hit) return { lat: hit.lat, lng: hit.lng, precision: "area", radius_m: hit.radius_m, area: hit.name };
    }
  }
  return null;
}

const DUBAI = { minLat: 24.6, maxLat: 25.45, minLng: 54.85, maxLng: 55.7 };
/** Widest map view (metres) whose centre is still used as an approximate project location. */
export const MAX_EMBED_SPAN_M = 6000;

/**
 * The developer's Google Maps embed (CMS "map_link") stores the centre of the map VIEW and its width
 * (!1d<span metres>!2d<lng>!3d<lat>). It names no place pin, so it is only ever an approximate location,
 * and views wider than MAX_EMBED_SPAN_M are not used at all.
 */
export function embedPoint(html: unknown): MapPoint | null {
  if (typeof html !== "string") return null;
  const m = /!1d([\d.]+)!2d(-?[\d.]+)!3d(-?[\d.]+)/.exec(html);
  if (!m) return null;
  const span = Number(m[1]), lng = Number(m[2]), lat = Number(m[3]);
  if (!Number.isFinite(span) || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (span > MAX_EMBED_SPAN_M) return null;
  if (lat < DUBAI.minLat || lat > DUBAI.maxLat || lng < DUBAI.minLng || lng > DUBAI.maxLng) return null;
  return { lat: Math.round(lat * 1e5) / 1e5, lng: Math.round(lng * 1e5) / 1e5, precision: "approximate", radius_m: Math.round(Math.min(3000, Math.max(250, span / 2))), area: null };
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(x));
}

/**
 * Where to show an off-plan project: always at its area centre, never a building position. The developer's
 * map view is only a cross-check of the listed area ("agrees" / "conflict"; conflicts are reported for a
 * CMS fix). A project whose area cannot be verified is not placed at all.
 */
export function offplanMapPoint(mapLink: unknown, ...areaNames: Array<string | null | undefined>): { point: MapPoint | null; check: "agrees" | "conflict" | "area-only" | "unverified" } {
  const area = areaPoint(...areaNames);
  const embed = embedPoint(mapLink);
  if (!area) return { point: null, check: "unverified" };
  if (!embed) return { point: area, check: "area-only" };
  const ok = distanceKm(embed, area) <= area.radius_m / 1000 + embed.radius_m / 1000 + 1.5;
  // Shown at area level either way; the developer map only confirms (or contradicts) the listed area.
  return { point: area, check: ok ? "agrees" : "conflict" };
}

// Approximate project points learned from detail pages, so later off-plan lists can use them.
const offplanPoints = new Map<string, MapPoint>();
export function rememberOffplanPoint(slug: string, p: MapPoint): void {
  if (offplanPoints.size > 2000) offplanPoints.clear();
  offplanPoints.set(slug, p);
}
export function knownOffplanPoint(slug: string): MapPoint | null {
  return offplanPoints.get(slug) ?? null;
}
