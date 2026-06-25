import React, { useMemo } from "react";
import { useLoaderData } from "react-router";

export default function ProjectFeatures() {
  const { property } = useLoaderData() as { property: any };

  const features = useMemo(() => {
    if (!property.features) return [];

    // Check if features is a string
    if (typeof property.features !== "string") {
      // If it's an array, return it directly
      if (Array.isArray(property.features)) {
        return property.features.filter(Boolean);
      }
      return [];
    }

    // If it's a string, split by comma
    return property.features
      .split(",")
      .map((f: string) => f.trim())
      .filter(Boolean);
  }, [property.features]);

  return (
    <div className="flex flex-col items-start gap-[23px] w-full mt-[45px]">
      <p
        className="CormorantGaramond text-[28px] leading-[1.05] lg:text-[44px]"
        style={{
          color: "#000000",
          fontWeight: 600,
          opacity: 1,
        }}
      >
        Features & Amenities
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-x-[45px] gap-y-[22px]">
        {features.map((feature: any, index: number) => (
          <div
            key={index}
            className="flex items-center px-[18px] py-[10px] w-full h-[47px] border-l-[3px] border-[#111111]"
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(17, 17, 17, 0.08) 52%, rgba(255, 255, 255, 0) 100%)",
            }}
          >
            <p
              className="CormorantGaramond text-[17px] lg:text-[19px] leading-[1.2]"
              style={{
                color: "#000000",
                fontWeight: 600,
                opacity: 1,
              }}
            >
              {feature}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
