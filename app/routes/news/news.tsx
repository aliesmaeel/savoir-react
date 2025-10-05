import React from "react";
import NewsAbout from "~/components/News/NewsAbout";
import NewsCard from "~/components/News/NewsCard";
import NewsHero from "~/components/News/NewsHero";
import PageLayout from "~/layouts/PageLayout";

export default function news() {
  return (
    <div className="relative">
      <NewsHero />
      <PageLayout>
        {/* <NewsAbout /> */}
        <div className="grid grid-cols-3 gap-[30px] w-full ">
          <NewsCard />
          <NewsCard />
          <NewsCard />
        </div>
      </PageLayout>
    </div>
  );
}
