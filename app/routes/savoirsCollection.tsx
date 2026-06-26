import React from "react";
import { useLoaderData } from "react-router";
import { getSavoirsCollection } from "~/api/home.service";
import SavoirsCollectionHero from "~/components/SavoirsCollection/SavoirsCollectionHero";
import ProjectCard from "~/components/Cards/ProjectCard";
import PageLayout from "~/layouts/PageLayout";

const getCollection = (res: any): any[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

export async function clientLoader() {
  try {
    const res: any = await getSavoirsCollection();
    return { collection: getCollection(res) };
  } catch {
    return { collection: [] };
  }
}

export function meta() {
  return [
    { title: "Savoir's Collection | Savoir Properties" },
    {
      name: "description",
      content:
        "Explore Savoir's curated collection of premium and exclusive properties in Dubai.",
    },
  ];
}

export default function SavoirsCollection() {
  const { collection } = useLoaderData() as { collection: any[] };

  return (
    <div className="relative">
      <SavoirsCollectionHero />

      <PageLayout>
        {collection.length === 0 ? (
          <p className="Jakarta w-full py-[40px] text-center text-[16px] font-medium text-black/70">
            No properties are available in the collection right now.
          </p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-x-[24px] gap-y-[30px] md:grid-cols-2 xl:grid-cols-4">
            {collection.map((project: any, index: number) => (
              <ProjectCard key={project?.slug ?? index} project={project} compact />
            ))}
          </div>
        )}
      </PageLayout>
    </div>
  );
}
