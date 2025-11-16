// routes/globalProject.tsx
import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { getGlobalProject } from "~/api/global.service";
import AboutGlobal from "~/components/GlobalProject/AboutGlobal";
import GlobalProjectHero from "~/components/GlobalProject/GlobalProjectHero";
import GlobeLuxuryProperties from "~/components/GlobalProject/GlobeLuxuryProperties";
import OffPlanStartingPrice from "~/components/OffPlanProjects/OffPlan/OffPlanStartingPrice";
import ProjectListedByContact from "~/components/Project/ProjectListedByContact";
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

export function shouldRevalidate({ currentUrl, nextUrl }: { currentUrl: URL; nextUrl: URL }) {
  return currentUrl.pathname !== nextUrl.pathname;
}

export default function GlobalProject() {
  const { global, country } = useLoaderData() as { global: any; country: string };

  const [currentGlobal, setCurrentGlobal] = useState<any>(global);
  const [currentCountry, setCurrentCountry] = useState<string>(country);

  const handleCountryDataChange = (newCountry: string, newGlobal: any) => {
    setCurrentCountry(newCountry);
    setCurrentGlobal(newGlobal);
  };

  return (
    <div>
      <GlobalProjectHero
        initialCountry={currentCountry}
        initialImage={currentGlobal?.project?.image}
        onCountryDataChange={handleCountryDataChange}
      />
      <PageLayout>
        <div className="flex flex-col lg:flex-row items-start gap-[50px] w-full">
          <AboutGlobal
            country={currentCountry}
            description={currentGlobal?.project?.description ?? ""}
          />
          <ProjectListedByContact user={currentGlobal.project.user} />
        </div>
        <GlobeLuxuryProperties
          similarProperties={currentGlobal?.similar_properties ?? []}
        />
      </PageLayout>
    </div>
  );
}
