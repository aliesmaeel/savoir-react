import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router";
import { getSuggestionSearch, search as searchApi } from "~/api/home.service";
import SearchFIlterItems from "~/components/Search/SearchFIlterItems";
import SearchHero from "~/components/Search/SearchHero";
import SearchResults from "~/components/Search/SearchResults";
import FAQs from "~/UI/FAQs";
import CustomPagination from "~/UI/CustomPagination";
import { getFAQ } from "~/api/faq.service";
import useIcons from "~/hooks/imageHooks/useIcons";

const SEARCH_PAGE_SIZE = 11;

const getResponseProjects = (res: any) => (Array.isArray(res?.data) ? res.data : []);

const getResponseTotal = (res: any, fallbackLength: number) =>
  Number(res?.total ?? res?.pagination?.total ?? res?.meta?.total ?? 0) || fallbackLength;

const getResponseTotalPages = (res: any) =>
  Number(res?.total_pages ?? res?.last_page ?? res?.pagination?.total_pages ?? res?.meta?.last_page ?? 0) || 1;

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  const status = params.get("status") || "All";
  const interested = params.get("interested") || "Buy";

  // Determine FAQ type based on search params
  let faqtype = "buy"; // default
  if (status === "Off-plan") {
    faqtype = "offplan";
  } else if (interested === "Rent") {
    faqtype = "rent";
  } else if (interested === "Buy") {
    faqtype = "buy";
  }

  try {
    const searchRes: any = await getSuggestionSearch();
    const resFAQ: any = await getFAQ(faqtype);
    return { search: searchRes, faq: resFAQ };
  } catch (error) {
    return { search: [], faq: [] };
  }
}

export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: {
  currentUrl: URL;
  nextUrl: URL;
}) {
  const currentStatus = currentUrl.searchParams.get("status") || "All";
  const currentInterested = currentUrl.searchParams.get("interested") || "Buy";
  const nextStatus = nextUrl.searchParams.get("status") || "All";
  const nextInterested = nextUrl.searchParams.get("interested") || "Buy";

  // Revalidate if status or interested params change (affects FAQ type)
  return currentStatus !== nextStatus || currentInterested !== nextInterested;
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
    const interested = params.get("interested") || "Buy";
    const status = params.get("status") || "All";
    const bedroomsParam = params.get("bedrooms") || "Any";
    const bathroomsParam = params.get("bathrooms") || "Any";
    const minPrice = params.get("min") ? Number(params.get("min")) : null;
    const maxPrice = params.get("max") ? Number(params.get("max")) : null;
    const sortField = params.get("sort_field") || "title_en";
    const sortOrder = params.get("sort_order") || "desc";

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
      const metaRes: any = await searchApi(1, SEARCH_PAGE_SIZE, body, sortField, sortOrder);
      const metaProjects = getResponseProjects(metaRes);
      const backendPageSize = Math.max(
        1,
        Number(metaRes?.per_page) || metaProjects.length || SEARCH_PAGE_SIZE
      );
      const backendTotalPages = getResponseTotalPages(metaRes);
      const totalItems = getResponseTotal(metaRes, backendPageSize * backendTotalPages);
      const uiStartIndex = (page - 1) * SEARCH_PAGE_SIZE;
      const firstBackendPage = Math.floor(uiStartIndex / backendPageSize) + 1;
      const firstBackendOffset = uiStartIndex % backendPageSize;

      let aggregatedProjects: any[] = [];
      let backendPage = firstBackendPage;

      while (aggregatedProjects.length < SEARCH_PAGE_SIZE && backendPage <= backendTotalPages) {
        const pageRes: any =
          backendPage === 1
            ? metaRes
            : await searchApi(backendPage, SEARCH_PAGE_SIZE, body, sortField, sortOrder);
        const pageProjects = getResponseProjects(pageRes);
        if (!pageProjects.length) break;

        const usableProjects =
          backendPage === firstBackendPage
            ? pageProjects.slice(firstBackendOffset)
            : pageProjects;

        aggregatedProjects = [...aggregatedProjects, ...usableProjects];
        backendPage += 1;
      }

      setProjects(aggregatedProjects.slice(0, SEARCH_PAGE_SIZE));

      // Desktop renders 11 listings + 1 promo tile for a complete 4x3 grid.
      setTotalPages(Math.max(1, Math.ceil(totalItems / SEARCH_PAGE_SIZE)));
    } catch (err) {
      console.error("Search API error:", err);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProjects(1);
  }, [location.search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProjects(page);
  };

  // Determine FAQ title based on search params
  const getFAQTitle = () => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status") || "All";
    const interested = params.get("interested") || "Buy";

    if (status === "Off-plan") {
      return "FAQs about offPlan properties in Dubai";
    } else if (interested === "Rent") {
      return "FAQs about rental properties in Dubai";
    } else if (interested === "Buy") {
      return "FAQs about properties for sale in Dubai";
    }

    return "FAQs about properties in Dubai";
  };

  return (
    <div className="relative">
      <div className="[&_h1]:-translate-y-[32px] lg:[&_h1]:-translate-y-[70px] [&_h1]:transition-transform [&_h1]:duration-300">
        <SearchHero />
      </div>

      <div className="relative z-20 -mt-[142px] px-[16px] pb-[30px] lg:-mt-[225px] lg:px-[45px] lg:pb-[40px]">
        <div className="mx-auto w-full max-w-[1404px]">
          <div
            style={{
              backgroundImage: `url(${icon.vLetter})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex flex-col items-start gap-[30px] lg:gap-[34px]">
              <SearchFIlterItems />

              <SearchResults projects={projects} currentPage={currentPage} />

              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            <div className="mt-[66px] flex w-full flex-col items-center gap-[22px] lg:gap-[53px]">
              <p className="CormorantGaramond text-[28px] leading-[1.05] text-black lg:text-[44px]">
                {getFAQTitle()}
              </p>

              <FAQs questions={faq} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
