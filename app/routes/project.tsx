import { useLoaderData } from "react-router";
import type { Route } from "./+types/project";
import { getProject } from "~/api/project.service";
import AveragePrices from "~/components/Project/BookYourViewing/AveragePrices";
import BookYourViewing from "~/components/Project/BookYourViewing/BookYourViewing";
import SimilarListings from "~/components/Project/BookYourViewing/SimilarListings";
import MortgageCalculator from "~/components/Project/Calculator/MortgageCalculator";
import RentalYieldCalculator from "~/components/Project/Calculator/RentalYieldCalculator";
import ProjectDescription from "~/components/Project/ProjectDescription";
import ProjectFeatures from "~/components/Project/ProjectFeatures";
import ProjectPageSwiper from "~/components/Project/ProjectPageSwiper";
import useIcons from "~/hooks/imageHooks/useIcons";
import PageLayout from "~/layouts/PageLayout";
import DontMissBeat from "~/UI/DontMissBeat";
import { formatPrice } from "~/utils/formatPrice";

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const buildShortDescription = (value: string, maxLength = 170) => {
  const cleaned = stripHtml(value);
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}...`;
};

const resolveImageUrl = (image: string, origin: string) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${origin}${image.startsWith("/") ? image : `/${image}`}`;
};

const getFirstPropertyImage = (property: any): string => {
  if (!property) return "";
  if (typeof property?.photo === "string" && property.photo) return property.photo;

  const firstImage = property?.property_images?.[0];
  if (!firstImage) return "";

  if (typeof firstImage === "string") return firstImage;

  return firstImage?.image || firstImage?.url || firstImage?.photo || firstImage?.src || "";
};

export function meta({ data }: Route.MetaArgs) {
  const title = data?.seo?.title || "Savoir Property";
  const description = data?.seo?.description || "Explore this property listing with Savoir.";
  const image = data?.seo?.image || "";

  const metaTags = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (image) {
    metaTags.push(
      { property: "og:image", content: image },
      { property: "og:image:width", content: "900" },
      { property: "og:image:height", content: "1350" },
      { name: "twitter:image", content: image }
    );
  }

  return metaTags;
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const projectSlug = params.projectSlug;
  const origin = new URL(request.url).origin;
  try {
    const res: any = await getProject(projectSlug);

    const property = res.property || null;
    const similar = res.similar_properties || [];
    const title = property?.title_en || property?.title || "Savoir Property";
    const descriptionSource =
      property?.short_description ||
      property?.description_en ||
      property?.description ||
      property?.community_description ||
      "Explore this property listing with Savoir.";
    const description = buildShortDescription(descriptionSource);
    const imageSource = getFirstPropertyImage(property);
    const image = resolveImageUrl(imageSource, origin);

    return { property, similar, seo: { title, description, image } };
  } catch (error) {
    return {
      property: null,
      similar: [],
      seo: {
        title: "Savoir Property",
        description: "Explore this property listing with Savoir.",
        image: "",
      },
    };
  }
}

export default function project() {
  const { property, similar } = useLoaderData() as { property: any; similar: any };
  const icon = useIcons();

  if (!property) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] mt-[90px]">
          <p className="text-black text-[24px] font-semibold">Property not found</p>
          <p className="text-[#999999] text-[16px] mt-4">
            The property you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </PageLayout>
    );
  }
 
  return (
    <PageLayout>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[13px] w-full mt-[90px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[13px]">
          <p className="text-[24px] font-semibold">{property?.title_en || property?.title || "Property"}</p>
          {(property?.community || property?.city) && (
            <div className="flex items-center gap-[7px]">
              <img loading="lazy" src={icon.locationBlack} alt="" className="w-[16px]" />
              <p className="text-[14px] font-medium">
                {[property?.community, property?.city].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
        </div>
        {property?.price && (
          <div className="flex flex-col items-start gap-[2px]">
            <p className="text-[14px] font-medium">Price</p>
            <p className="text-[#C6A45A] text-[27px] font-bold">
              {formatPrice(property.price)} {property?.currency || ""}
            </p>
          </div>
        )}
      </div>
      <ProjectPageSwiper mainImage={property?.photo} sliderImages={property?.property_images} />
      <ProjectDescription />
      <ProjectFeatures />
      {(() => {
        const isForSale = property?.offering_type === "RS";
        const isForRent = property?.offering_type === "RR";
        const isOffPlan = property?.status === "Off-plan" || property?.completion_status?.toLowerCase().includes("off_plan");
        // For rent (not off-plan): hide both calculators
        if (isForRent && !isOffPlan) {
          return null;
        }
        
        // Off-plan: show only RentalYieldCalculator
        if (isOffPlan) {
          return (
            <div className="grid grid-cols-1 gap-[35px] w-full mt-[90px]">
              <RentalYieldCalculator />
            </div>
          );
        }
        
        // For sale: show both calculators
        if (isForSale) {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[35px] w-full mt-[90px]">
              <MortgageCalculator />
              <RentalYieldCalculator />
            </div>
          );
        }
        
        // Default fallback: show both
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[35px] w-full mt-[90px]">
            <MortgageCalculator />
            <RentalYieldCalculator />
          </div>
        );
      })()}
      <div style={{ backgroundImage: `url(${icon.vLetter})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <BookYourViewing agent={property?.user} />
       {property?.offering_type !== "RR" && <AveragePrices community={property?.community} />}
      </div>
      {similar.length > 0 && <SimilarListings />}

      <DontMissBeat />
    </PageLayout>
  );
}
