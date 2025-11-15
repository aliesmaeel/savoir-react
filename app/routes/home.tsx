import { Suspense, lazy } from "react";
import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/home";
import HeroSection from "~/components/Home/HeroSection";
import HomeAbout from "~/components/Home/HomeAbout";
import HomeOurData from "~/components/Home/HomeOurData";
import HomeProperties from "~/components/Home/HomeProperties/HomeProperties";
import NewsInsights from "~/components/Home/NewsInsights/NewsInsights";
import { getHomeInfo, getSuggestionSearch } from "~/api/home.service";
import { useLoaderData } from "react-router";

// Lazy load below-the-fold components for better performance
const GlobalProjects = lazy(() => import("~/components/Home/GlobalProjects/GlobalProjects"));
const GlobalAccess = lazy(() => import("~/components/Home/GlobalAccess"));
const Locations = lazy(() => import("~/components/Home/Locations/Locations"));
const OurCustomers = lazy(() => import("~/components/Home/OurCustomers/OurCustomers"));
const OffPlanProjects = lazy(() => import("~/components/Home/OffPlanProjects/OffPlanProjects"));
const LuxuryPortfolio = lazy(() => import("~/components/Home/LuxuryPortfolio"));
const Sponsors = lazy(() => import("~/components/Home/Sponsors/Sponsors"));

export function meta({}: Route.MetaArgs) {
  return [{ title: "Savoir" }];
}

export async function clientLoader({ request }: { request: Request }) {
  try {
    const res: any = await getHomeInfo();
    const searchRes: any = await getSuggestionSearch();

    const home = res;
    const search = searchRes;

    return { home, search };
  } catch (error) {
    return { home: [], search: [] };
  }
}

export default function Home() {
  const { home, search } = useLoaderData() as { home: any; search: any };

  return (
    <div className="relative ">
      <HeroSection />
      <div className="absolute w-full  top-[calc(100vh+100px)] z-[-1]">
        <img
          loading="lazy"
          decoding="async"
          src="/images/placeholders/homeBackground.webp"
          alt=""
          className="w-full opacity-25"
        />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[37.5px] w-full mt-[31px] lg:mt-[99px] mb-[33px] lg:mb-[167px]">
          <HomeProperties />
          <div className="flex flex-col items-end justify-end gap-[24px] lg:gap-[37px] w-full">
            <NewsInsights />
            <div className="w-full flex justify-end">
              <Suspense fallback={<div className="w-full h-[300px]" />}>
                <GlobalProjects />
              </Suspense>
            </div>
          </div>
        </div>
      </PageLayout>

      <GlobalAccess />
      <Suspense fallback={null}>
        <Sponsors />
      </Suspense>
    </div>
  );
}
