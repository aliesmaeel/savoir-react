import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router";
import { getSuggestionSearch, search as searchApi } from "~/api/home.service";
import SearchFIlterItems from "~/components/Search/SearchFIlterItems";
import SearchHero from "~/components/Search/SearchHero";
import SearchResults from "~/components/Search/SearchResults";
import PageLayout from "~/layouts/PageLayout";
import FAQs from "~/UI/FAQs";
import CustomPagination from "~/UI/CustomPagination";
import { getFAQ } from "~/api/faq.service";
import useIcons from "~/hooks/imageHooks/useIcons";

export async function clientLoader({ request }: { request: Request }) {
  const faqtype = "buy";
  try {
    const searchRes: any = await getSuggestionSearch();
    const resFAQ: any = await getFAQ(faqtype);
    return { search: searchRes, faq: resFAQ };
  } catch (error) {
    return { search: [], faq: [] };
  }
}

export default function Search() {
  const { faq } = useLoaderData() as { faq: any };
  const [projects, setProjects] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const icon = useIcons();
  const location = useLocation();

  const fetchProjects = async (page: number) => {
    if (!location.search) return;

    const params = new URLSearchParams(location.search);

    const query = params.get("query") ? params.get("query")!.split(",") : [];
    const types = params.get("types") ? params.get("types")!.split(",") : [];
    const interested = params.get("interested") || "Rent";
    const status = params.get("status") || "All";
    const bedroomsParam = params.get("bedrooms") || "Any";
    const bathroomsParam = params.get("bathrooms") || "Any";
    const minPrice = params.get("min") ? Number(params.get("min")) : null;
    const maxPrice = params.get("max") ? Number(params.get("max")) : null;

    const parseCount = (value: string) => {
      if (value === "Any") return null;
      if (value === "Studio") return 0;
      if (value === "5+") return 5;
      const n = Number(value);
      return isNaN(n) ? null : n;
    };

    const bedroom = parseCount(bedroomsParam);
    const bathroom = parseCount(bathroomsParam);
    const offering_type = interested === "Rent" ? "RR" : "RS";

    let completion_status: null | "completed" | "off_plan" = null;
    if (status === "Ready") completion_status = "completed";
    else if (status === "Off-plan") completion_status = "off_plan";

    const type = types.length ? types[0] : null;

    const body = {
      query,
      offering_type,
      completion_status,
      type,
      bedroom,
      bathroom,
      min_price: minPrice,
      max_price: maxPrice,
    };

    try {
      const res: any = await searchApi(page, 5, body);
      console.log(res);
      setProjects(res.data);
      setTotalPages(res.count || 1); // Assuming API returns totalPages
    } catch (err) {
      console.error("Search API error:", err);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // reset page on filter change
    fetchProjects(1);
  }, [location.search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProjects(page);
  };

  return (
    <div className="relative">
      <SearchHero />

      <PageLayout>
        <div style={{ backgroundImage: `url(${icon.vLetter})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="flex flex-col items-start gap-[47px]">
          <SearchFIlterItems />
          <SearchResults projects={projects} />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="flex flex-col items-center gap-[22px] lg:gap-[53px] w-full mt-[66px]">
          <p className="text-black text-[16px] lg:text-[36px] font-medium">
            FAQs about rental properties in Dubai UAE
          </p>
          <FAQs questions={faq} />
        </div>
        </div>
      </PageLayout>
    </div>
  );
}
