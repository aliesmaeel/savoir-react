import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { getLatestListings } from "~/api/latestListings.service";
import { formatPrice } from "~/utils/formatPrice";

export default function FooterLatestListings() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestListings = async () => {
      try {
        setLoading(true);
        const data: any = await getLatestListings();
        // Handle different possible response structures
        const listings = Array.isArray(data) ? data : data?.listings || data?.data || [];
        setItems(listings.slice(0, 3)); // Limit to 3 items
      } catch (error) {
        console.error("Error fetching latest listings:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestListings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-start gap-[8px] lg:gap-[20px] w-full max-w-[315px]">
        <p className="text-[#C6A45A] text-[14px] lg:text-[24px] font-semibold">LATEST LISTINGS</p>
        <div className="flex flex-col items-start gap-[18px] lg:gap-[30px] w-full">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-[10px] w-full animate-pulse">
              <div className="w-[57px] lg:w-[99px] h-[49px] lg:h-[84px] rounded-[7px] lg:rounded-[12px] bg-gray-300" />
              <div className="flex flex-col items-start gap-[6px] lg:gap-[11px] w-full">
                <div className="h-[14px] lg:h-[18px] w-[150px] bg-gray-300 rounded" />
                <div className="h-[10px] lg:h-[18px] w-[80px] bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-[8px] lg:gap-[20px] w-full max-w-[315px]">
        <p className="text-[#C6A45A] text-[14px] lg:text-[24px] font-semibold">LATEST LISTINGS</p>
        <p className="text-[12px] lg:text-[16px] text-gray-500">No listings available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-[8px] lg:gap-[20px] w-full max-w-[315px]">
      <p className="text-[#C6A45A] text-[14px] lg:text-[24px] font-semibold">LATEST LISTINGS</p>
      <div className="flex flex-col items-start gap-[18px] lg:gap-[30px] w-full">
        {items.map((item: any, index: number) => {
          const slug = item.slug || item.id;
          const title = item.title_en || item.title || "Property";
          const image = item.photo || item.image || "/images/placeholders/properties.webp";
          const price = item.price
            ? `${formatPrice(item.price)} ${item.currency || "AED"}`
            : item.price_display || "Price on request";

          return (
            <Link
              to={`/project/${slug}`}
              key={item.id || item.slug || index}
              className="flex items-center gap-[10px] w-full"
            >
              <img
                loading="lazy"
                src={image}
                alt={title}
                className="w-[57px] lg:w-[99px] h-[49px] lg:h-[84px] rounded-[7px] lg:rounded-[12px] object-cover"
              />
              <div className="flex flex-col items-start gap-[6px] lg:gap-[11px] w-full">
                <p className="text-[11px] lg:text-[18px] line-clamp-2">{title}</p>
                <p className="text-[#C6A45A] text-[10px] lg:text-[18px]">{price}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
