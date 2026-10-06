/**
 * Map raw CMS records (typed as unknown) to the small, sanitised shapes in
 * ../schemas.ts. Field names verified against live responses (Oct 2026):
 *
 * search item: id, title_en, slug, city, community, sub_community,
 *   property_type, completion_status, offering_type, bedroom ("2" — string),
 *   bathroom (number), price (number), currency, updated_at, photo, user{...}
 * property detail: the above plus reference_number, permit_number,
 *   property_name, size (sq ft), features[], private_amenities, floor_plan,
 *   property_images[{url}], description_en (HTML), user{name,email,phone,image}
 * off-plan item: id, title, slug, image, developer, completion_date,
 *   location, starting_price (free text, e.g. "AED 1.99M"), updated_at
 * off-plan detail: title, link (= slug), image, developer, completion_date,
 *   location, area, starting_price, project_size, lifestyle, title_type,
 *   first_installment, during_construction, on_handover (percent strings),
 *   features (comma-separated), header_images[{url}], youtube_link, description
 */
import type { Agent, OffplanDetails, OffplanSummary, PropertyDetails, PropertySummary } from "../schemas.js";
import { cleanLine, cleanText, safeEmail, safeHttpsUrl, safePhone, toNumber, whatsappUrl, isValidSlug } from "./sanitize.js";
import { propertyTypeLabel } from "./vocab.js";

type Raw = Record<string, unknown>;

export interface MapContext {
  publicSiteUrl: string;
  imageHosts: readonly string[];
}

const asRecord = (v: unknown): Raw | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : null);

export function propertyUrl(ctx: MapContext, slug: string): string {
  return `${ctx.publicSiteUrl}/project/${encodeURIComponent(slug)}`;
}

export function offplanUrl(ctx: MapContext, slug: string): string {
  return `${ctx.publicSiteUrl}/off-plan/${encodeURIComponent(slug)}`;
}

export function bedroomsLabel(bedrooms: number | null): string | null {
  if (bedrooms === null) return null;
  if (bedrooms === 0) return "Studio";
  return `${bedrooms} bedroom${bedrooms === 1 ? "" : "s"}`;
}

export function formatPrice(price: number | null, currency: string | null): string | null {
  if (price === null) return null;
  const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price);
  return currency ? `${currency} ${amount}` : amount;
}

function mapLocation(raw: Raw) {
  const community = cleanLine(raw.community ?? asRecord(raw.pcommunity)?.name, 80);
  const sub_community = cleanLine(raw.sub_community ?? raw.subcommunity ?? asRecord(raw.psubcommunity)?.name, 80);
  const city = cleanLine(raw.city, 60);
  const parts = [sub_community, community, city].filter((p, i, a): p is string => !!p && a.indexOf(p) === i);
  return { community, sub_community, city, label: parts.length ? parts.join(", ") : null };
}

/** Returns null for records without a usable slug/title: they cannot be linked, so they are not shown. */
export function mapPropertySummary(rawValue: unknown, ctx: MapContext): PropertySummary | null {
  const raw = asRecord(rawValue);
  if (!raw) return null;
  const slug = typeof raw.slug === "string" ? raw.slug.trim() : "";
  const title = cleanLine(raw.title_en ?? raw.title, 140);
  if (!slug || !isValidSlug(slug) || !title) return null;

  const bedrooms = toNumber(raw.bedroom);
  const price = toNumber(raw.price);
  const currency = cleanLine(raw.currency, 8);
  const offering = raw.offering_type;
  const completion = raw.completion_status;

  return {
    slug,
    title,
    url: propertyUrl(ctx, slug),
    purpose: offering === "RS" ? "sale" : offering === "RR" ? "rent" : null,
    completion: completion === "completed" ? "ready" : completion === "off_plan" ? "off_plan" : null,
    property_type: propertyTypeLabel(raw.property_type),
    bedrooms,
    bedrooms_label: bedroomsLabel(bedrooms),
    bathrooms: toNumber(raw.bathroom),
    price,
    currency,
    price_label: formatPrice(price, currency),
    location: mapLocation(raw),
    photo: safeHttpsUrl(raw.photo, ctx.imageHosts),
  };
}

/** Public agent contact as shown on the website's listing page. The CMS "Admin" account is not a person. */
export function mapAgent(rawValue: unknown): Agent | null {
  const raw = asRecord(rawValue);
  if (!raw) return null;
  const name = cleanLine(raw.name, 80);
  if (!name || /^admin$/i.test(name)) return null;
  const phone = safePhone(raw.phone);
  return { name, email: safeEmail(raw.email), phone, whatsapp_url: whatsappUrl(phone) };
}

function imageList(values: unknown, ctx: MapContext, max: number): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const v of values) {
    const candidate = typeof v === "string" ? v : asRecord(v)?.url ?? asRecord(v)?.image;
    const url = safeHttpsUrl(candidate, ctx.imageHosts);
    if (url && !out.includes(url)) out.push(url);
    if (out.length >= max) break;
  }
  return out;
}

function stringList(values: unknown, maxItems: number, maxLength: number): string[] {
  const items = Array.isArray(values) ? values : typeof values === "string" ? values.split(",") : [];
  const out: string[] = [];
  for (const v of items) {
    const s = cleanLine(v, maxLength);
    if (s && !out.includes(s)) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

export function mapPropertyDetails(response: unknown, ctx: MapContext): PropertyDetails | null {
  const body = asRecord(response);
  const raw = asRecord(body?.property);
  const summary = raw ? mapPropertySummary(raw, ctx) : null;
  if (!raw || !summary) return null;

  const photos = imageList(raw.property_images, ctx, 12);
  if (summary.photo && !photos.includes(summary.photo)) photos.unshift(summary.photo);

  const amenities = [...stringList(raw.features, 30, 60), ...stringList(raw.private_amenities, 30, 60)].filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  const similar = Array.isArray(body?.similar_properties) ? body.similar_properties : [];

  return {
    ...summary,
    reference_number: cleanLine(raw.reference_number, 40),
    permit_number: cleanLine(raw.permit_number, 40),
    building: cleanLine(raw.property_name, 100),
    size_sqft: toNumber(raw.size),
    amenities: amenities.slice(0, 30),
    photos: photos.slice(0, 12),
    floor_plan_url: safeHttpsUrl(raw.floor_plan, ctx.imageHosts),
    description: cleanText(raw.description_en ?? raw.description, 1500),
    agent: mapAgent(raw.user),
    updated_at: cleanLine(raw.updated_at, 40),
    similar_properties: similar
      .map((s) => mapPropertySummary(s, ctx))
      .filter((s): s is PropertySummary => s !== null && s.slug !== summary.slug)
      .slice(0, 6),
  };
}

/** Off-plan prices are free text ("AED 1.99M", "AED 666,000"); placeholders like "Call Us" are not prices. */
function priceLabel(value: unknown): string | null {
  const s = cleanLine(value, 40);
  return s && /\d/.test(s) ? s : null;
}

export function mapOffplanSummary(rawValue: unknown, ctx: MapContext): OffplanSummary | null {
  const raw = asRecord(rawValue);
  if (!raw) return null;
  const slugValue = raw.slug ?? raw.link;
  const slug = typeof slugValue === "string" ? slugValue.trim() : "";
  const title = cleanLine(raw.title, 140);
  if (!slug || !isValidSlug(slug) || !title) return null;
  return {
    slug,
    title,
    url: offplanUrl(ctx, slug),
    developer: cleanLine(raw.developer, 80),
    location: cleanLine(raw.location, 120),
    handover: cleanLine(raw.completion_date, 40),
    starting_price_label: priceLabel(raw.starting_price),
    image: safeHttpsUrl(raw.image, ctx.imageHosts),
  };
}

function percent(value: unknown): string | null {
  const s = cleanLine(value, 20);
  return s && /^\d{1,3}(\.\d+)?\s*%$/.test(s) ? s.replace(/\s+/g, "") : null;
}

const YOUTUBE_HOSTS = ["www.youtube.com", "youtube.com", "youtu.be", "m.youtube.com"];

export function mapOffplanDetails(response: unknown, ctx: MapContext): OffplanDetails | null {
  const raw = asRecord(response);
  const summary = raw ? mapOffplanSummary(raw, ctx) : null;
  if (!raw || !summary) return null;

  const down = percent(raw.first_installment);
  const during = percent(raw.during_construction);
  const handover = percent(raw.on_handover);

  const images = imageList(raw.header_images, ctx, 12);
  if (summary.image && !images.includes(summary.image)) images.unshift(summary.image);

  return {
    ...summary,
    area: cleanLine(raw.area, 80),
    unit_sizes: cleanLine(raw.project_size, 80),
    title_type: cleanLine(raw.title_type, 40),
    lifestyle: cleanLine(raw.lifestyle, 40),
    payment_plan: down || during || handover ? { down_payment: down, during_construction: during, on_handover: handover } : null,
    amenities: stringList(raw.features, 30, 60),
    images: images.slice(0, 12),
    video_url: safeHttpsUrl(raw.youtube_link, YOUTUBE_HOSTS),
    description: cleanText(raw.description, 1500),
  };
}
