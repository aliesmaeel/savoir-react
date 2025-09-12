import React from "react";
import NewsBody from "~/components/News/NewsBody";
import NewsCard from "~/components/News/NewsCard";
import NewsPageHero from "~/components/News/NewsPageHero";
import PageLayout from "~/layouts/PageLayout";

export default function newsPage() {
  return (
    <div className="relative">
      <NewsPageHero />
      <PageLayout>
        <NewsBody />

        <div className="flex flex-col items-start gap-[37px] w-full mt-[75px]">
          <p className="text-black text-[31px] font-medium">You might also be interested in...</p>
          <div className="grid grid-cols-3 gap-[30px] w-full ">
            <NewsCard />
            <NewsCard />
            <NewsCard />
          </div>
        </div>
      </PageLayout>
    </div>
  );
}
