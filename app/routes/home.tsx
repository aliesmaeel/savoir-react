import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/home";
import HeroSection from "~/components/Home/HeroSection";
import HomeAbout from "~/components/Home/HomeAbout";
import HomeOurData from "~/components/Home/HomeOurData";
import NewsInsights from "~/components/Home/NewsInsights/NewsInsights";
import HomeProperties from "~/components/Home/HomeProperties/HomeProperties";
import GlobalAccess from "~/components/Home/GlobalAccess";
import GlobalProjects from "~/components/Home/GlobalProjects/GlobalProjects";
import Locations from "~/components/Home/Locations/Locations";
import OurCustomers from "~/components/Home/OurCustomers/OurCustomers";
import OffPlanProjects from "~/components/Home/OffPlanProjects/OffPlanProjects";
import LuxuryPortfolio from "~/components/Home/LuxuryPortfolio";
import Sponsors from "~/components/Home/Sponsors/Sponsors";
import { getHomeInfo, getSuggestionSearch } from "~/api/home.service";
import { getAllNews } from "~/api/news.service";

const HOME_TITLE = "Savoir | Luxury Real Estate in Dubai";
const HOME_DESCRIPTION =
  "Savoir Privé Properties is a Dubai luxury real estate agency with over 100 years of combined expertise. Discover exclusive properties for sale and rent in the UAE and worldwide.";

export function meta({ data }: Route.MetaArgs) {
  const title = data?.seo?.title || HOME_TITLE;
  const description = data?.seo?.description || HOME_DESCRIPTION;
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
      { name: "twitter:image", content: image }
    );
  }

  return metaTags;
}

export async function loader({ request }: Route.LoaderArgs) {
  const origin = new URL(request.url).origin;
  const seo = {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    image: `${origin}/images/placeholders/hero.webp`,
  };

  const [homeResult, searchResult, latestNewsResult] = await Promise.allSettled([
    getHomeInfo(),
    getSuggestionSearch(),
    getAllNews(1, 3),
  ]);

  const home = homeResult.status === "fulfilled" ? homeResult.value : [];
  const search = searchResult.status === "fulfilled" ? searchResult.value : [];
  const latestNews =
    latestNewsResult.status === "fulfilled"
      ? ((latestNewsResult.value as any)?.data ?? [])
      : [];

  return { home, search, latestNews, seo };
}

export default function Home() {
  return (
    <div className="relative ">
      <HeroSection />
      <div className="absolute w-full  top-[calc(100vh+100px)] z-[-1]">
        <div
          className="absolute bottom-0 left-0 w-full h-[250px]"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>

      <PageLayout>
        <HomeAbout />
        <HomeOurData />
      </PageLayout>
      <div className="w-full mt-[31px] lg:mt-[29px]">
        <HomeProperties />
      </div>
      <div className="w-full">
        <OffPlanProjects />
      </div>
      <div className="w-full mt-[31px] lg:mt-[60px]">
        <GlobalProjects />
      </div>
      <div className="w-full mt-[42px] lg:mt-[88px]">
        <GlobalAccess />
      </div>
      <div className="w-full">
        <NewsInsights />
      </div>

      <div className="w-full">
        <Locations />
      </div>
      <div className="w-full">
        <OurCustomers />
      </div>
      <div className="w-full">
        <LuxuryPortfolio />
      </div>

      <Sponsors />
    </div>
  );
}
