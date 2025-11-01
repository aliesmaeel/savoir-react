// routes/globalProject.tsx
import React from "react";
import { useLoaderData } from "react-router";
import { getGlobalProject } from "~/api/global.service";
import AboutGlobal from "~/components/GlobalProject/AboutGlobal";
import GlobalProjectHero from "~/components/GlobalProject/GlobalProjectHero";
import GlobeLuxuryProperties from "~/components/GlobalProject/GlobeLuxuryProperties";
import OffPlanStartingPrice from "~/components/OffPlanProjects/OffPlan/OffPlanStartingPrice";
import PageLayout from "~/layouts/PageLayout";

export async function clientLoader({ request, params }: { request: Request; params: any }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("country");
  const fromRoute = params?.country as string | undefined;
  const country = (q ?? fromRoute ?? "united arab emirates").toLowerCase();

  try {
    const global: any = await getGlobalProject(country); // expects lowercase
    return { global, country };
  } catch {
    return { global: [], country };
  }
}

// block revalidation on search-only changes
export function shouldRevalidate({ currentUrl, nextUrl }: { currentUrl: URL; nextUrl: URL }) {
  return currentUrl.pathname !== nextUrl.pathname;
}

export default function GlobalProject() {
  const { global, country } = useLoaderData() as { global: any; country: string };

  return (
    <div>
      <GlobalProjectHero />
      <PageLayout>
        <div className="flex flex-col lg:flex-row items-start gap-[50px] w-full">
          <AboutGlobal />
          <OffPlanStartingPrice />
        </div>
        <GlobeLuxuryProperties />
      </PageLayout>
    </div>
  );
}
