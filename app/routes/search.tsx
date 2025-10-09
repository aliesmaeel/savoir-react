import React from "react";
import SearchFIlterItems from "~/components/Search/SearchFIlterItems";
import SearchHero from "~/components/Search/SearchHero";
import SearchResults from "~/components/Search/SearchResults";
import PageLayout from "~/layouts/PageLayout";
import FAQs from "~/UI/FAQs";

export default function search() {
  return (
    <div className="relative">
      <SearchHero />

      <PageLayout>
        <div className="flex flex-col items-start gap-[47px]">
          <SearchFIlterItems />
          <SearchResults />
        </div>
        <div className="flex flex-col items-center  gap-[22px] lg:gap-[53px] w-full mt-[66px]">
          <p className="text-black text-[16px] lg:text-[36px] font-medium">
            FAQs about rental properties in Dubai UAE
          </p>
          <FAQs />
        </div>
      </PageLayout>
    </div>
  );
}
