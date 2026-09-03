export const isOfficeSpace = (property: any): boolean => {
  if (!property || typeof property !== "object") return false;

  const candidates = [
    property.property_type,
    property.property_type_en,
    property.type,
    property.type_en,
    property.propertyType,
    property.category,
    property.usage,
  ];

  return candidates.some((value) => {
    if (value == null || value === "") return false;

    const normalized = String(value).trim().toLowerCase().replace(/[_]/g, "-");

    if (normalized === "of") return true;

    return normalized.includes("office");
  });
};

const toCount = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

export const shouldHideBedBath = (property: any): boolean => {
  if (isOfficeSpace(property)) return true;

  const bedrooms = toCount(property?.bedroom);
  const bathrooms = toCount(property?.bathroom);

  return bedrooms === 0 && bathrooms === 0;
};

