import { Suspense, lazy } from "react";
import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/home";
import HeroSection from "~/components/Home/HeroSection";
import HomeAbout from "~/components/Home/HomeAbout";
import HomeOurData from "~/components/Home/HomeOurData";
import NewsInsights from "~/components/Home/NewsInsights/NewsInsights";
import HomeProperties from "~/components/Home/HomeProperties/HomeProperties";
import GlobalAccess from "~/components/Home/GlobalAccess";
import { getHomeInfo, getSuggestionSearch } from "~/api/home.service";
import { getAllNews } from "~/api/news.service";
import { useLoaderData } from "react-router";

// Lazy load below-the-fold components for better performance
const GlobalProjects = lazy(() => import("~/components/Home/GlobalProjects/GlobalProjects"));
const Locations = lazy(() => import("~/components/Home/Locations/Locations"));
const OurCustomers = lazy(() => import("~/components/Home/OurCustomers/OurCustomers"));
const OffPlanProjects = lazy(() => import("~/components/Home/OffPlanProjects/OffPlanProjects"));
const LuxuryPortfolio = lazy(() => import("~/components/Home/LuxuryPortfolio"));
const Sponsors = lazy(() => import("~/components/Home/Sponsors/Sponsors"));

export function meta({}: Route.MetaArgs) {
  return [{ title: "Savoir" }];
}

export async function clientLoader({ request }: { request: Request }) {
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

  return { home, search, latestNews };
}

export default function Home() {
  const { home, search } = useLoaderData() as { home: any; search: any };

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
        <Suspense fallback={<div className="w-full h-[500px] bg-white" />}>
          <OffPlanProjects />
        </Suspense>
      </div>
      <div className="w-full mt-[31px] lg:mt-[60px]">
        <Suspense fallback={<div className="w-full h-[400px] bg-[#0A0A0A]" />}>
          <GlobalProjects />
        </Suspense>
      </div>
      <div className="w-full mt-[42px] lg:mt-[88px]">
        <GlobalAccess />
      </div>
      <div className="w-full">
        <Suspense fallback={<div className="w-full h-[500px] bg-white" />}>
          <NewsInsights />
        </Suspense>
      </div>
        
        <div className="w-full">
          <Suspense fallback={<div className="w-full h-[600px] bg-white" />}>
            <Locations />
          </Suspense>
        </div>
        <div className="w-full">
          <Suspense fallback={<div className="w-full h-[500px] bg-white" />}>
            <OurCustomers />
          </Suspense>
        </div>
        <div className="w-full">
          <Suspense fallback={<div className="w-full h-[600px] bg-[#0A0A0A]" />}>
            <LuxuryPortfolio />
          </Suspense>
        </div>

      <Suspense fallback={null}>
        <Sponsors />
      </Suspense>

    </div>
  );
}
