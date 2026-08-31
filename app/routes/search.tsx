import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router";
import type { Route } from "./+types/search";
import { getSuggestionSearch, search as searchApi } from "~/api/home.service";
import SearchFIlterItems from "~/components/Search/SearchFIlterItems";
import SearchHero from "~/components/Search/SearchHero";
import SearchResults from "~/components/Search/SearchResults";
import FAQs from "~/UI/FAQs";
import CustomPagination from "~/UI/CustomPagination";
import { getFAQ } from "~/api/faq.service";
import useIcons from "~/hooks/imageHooks/useIcons";

const SEARCH_PAGE_SIZE = 11;

const getResponseProjects = (res: any) =>
  Array.isArray(res?.data) ? res.data : [];

const getResponseTotal = (res: any, fallbackLength: number) =>
  Number(res?.total ?? res?.pagination?.total ?? res?.meta?.total ?? 0) ||
  fallbackLength;

const getResponseTotalPages = (res: any) =>
  Number(
    res?.total_pages ??
      res?.last_page ??
      res?.pagination?.total_pages ??
      res?.meta?.last_page ??
      0
  ) || 1;

const parseCount = (value: string) => {
  if (value === "Any") return null;
  if (value === "Studio") return 0;
  if (value === "5+") return 5;

  const n = Number(value);
  return isNaN(n) ? null : n;
};

const getFaqType = (status: string, interested: string) => {
  if (status === "Off-plan") return "offplan";
  if (interested === "Rent") return "rent";
  return "buy";
};

const getSearchSeo = (interested: string, status: string, origin: string) => {
  if (status === "Off-plan") {
    return {
      title: "Off Plan Properties in Dubai | Savoir",
      description:
        "Discover the best off-plan properties in Dubai with Savoir. Browse exclusive new developments and luxury listings.",
      image: `${origin}/images/placeholders/hero.webp`,
    };
  }

  if (interested === "Rent") {
    return {
      title: "Properties for Rent in Dubai | Savoir",
      description:
        "Discover the best properties for rent in Dubai with Savoir. Browse luxury apartments, villas, and exclusive rental listings.",
      image: `${origin}/images/placeholders/hero.webp`,
    };
  }

  return {
    title: "Properties for Sale in Dubai | Savoir",
    description:
      "Discover the best properties for sale in Dubai with Savoir. Browse luxury apartments, villas, and exclusive listings.",
    image: `${origin}/images/placeholders/hero.webp`,
  };
};

const normalizeFaq = (value: any) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const buildSearchBody = (params: URLSearchParams) => {
  const query = params.get("query") ? params.get("query")!.split(",") : [];
  const types = params.get("types") ? params.get("types")!.split(",") : [];
  const interested = params.get("interested") || "Buy";
  const status = params.get("status") || "All";
  const bedroomsParam = params.get("bedrooms") || "Any";
  const bathroomsParam = params.get("bathrooms") || "Any";
  const minPrice = params.get("min") ? Number(params.get("min")) : null;
  const maxPrice = params.get("max") ? Number(params.get("max")) : null;

  let completion_status: null | "completed" | "off_plan" = null;

  if (status === "Ready") {
    completion_status = "completed";
  } else if (status === "Off-plan") {
    completion_status = "off_plan";
  }

  return {
    query,
    offering_type: interested === "Rent" ? "RR" : "RS",
    completion_status,
    type: types.length ? types[0] : null,
    bedroom: parseCount(bedroomsParam),
    bathroom: parseCount(bathroomsParam),
    min_price: minPrice,
    max_price: maxPrice,
  };
};

const fetchSearchPage = async (params: URLSearchParams, page: number) => {
  const body = buildSearchBody(params);
  const sortField = params.get("sort_field") || "title_en";
  const sortOrder = params.get("sort_order") || "desc";

  const metaRes: any = await searchApi(
    1,
    SEARCH_PAGE_SIZE,
    body,
    sortField,
    sortOrder
  );

  const metaProjects = getResponseProjects(metaRes);

  const backendPageSize = Math.max(
    1,
    Number(metaRes?.per_page) || metaProjects.length || SEARCH_PAGE_SIZE
  );

  const backendTotalPages = getResponseTotalPages(metaRes);
  const totalItems = getResponseTotal(
    metaRes,
    backendPageSize * backendTotalPages
  );

  const uiStartIndex = (page - 1) * SEARCH_PAGE_SIZE;
  const firstBackendPage = Math.floor(uiStartIndex / backendPageSize) + 1;
  const firstBackendOffset = uiStartIndex % backendPageSize;

  let aggregatedProjects: any[] = [];
  let backendPage = firstBackendPage;

  while (
    aggregatedProjects.length < SEARCH_PAGE_SIZE &&
    backendPage <= backendTotalPages
  ) {
    const pageRes: any =
      backendPage === 1
        ? metaRes
        : await searchApi(
            backendPage,
            SEARCH_PAGE_SIZE,
            body,
            sortField,
            sortOrder
          );

    const pageProjects = getResponseProjects(pageRes);

    if (!pageProjects.length) break;

    const usableProjects =
      backendPage === firstBackendPage
        ? pageProjects.slice(firstBackendOffset)
        : pageProjects;

    aggregatedProjects = [...aggregatedProjects, ...usableProjects];
    backendPage += 1;
  }

  return {
    projects: aggregatedProjects.slice(0, SEARCH_PAGE_SIZE),
    totalPages: Math.max(1, Math.ceil(totalItems / SEARCH_PAGE_SIZE)),
  };
};

export function meta({ data }: Route.MetaArgs) {
  const title = data?.seo?.title || "Properties in Dubai | Savoir";
  const description =
    data?.seo?.description ||
    "Browse luxury properties for sale and rent in Dubai with Savoir.";
  const image = data?.seo?.image || "";

  const metaTags = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (image) {
    metaTags.push(
      { property: "og:image", content: image },
      { name: "twitter:image", content: image }
    );
  }

  return metaTags;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const status = params.get("status") || "All";
  const interested = params.get("interested") || "Buy";
  const seo = getSearchSeo(interested, status, url.origin);

  const [searchResult, faqResult, projectsResult] = await Promise.allSettled([
    getSuggestionSearch(),
    getFAQ(getFaqType(status, interested)),
    fetchSearchPage(params, 1),
  ]);

  const search = searchResult.status === "fulfilled" ? searchResult.value : [];
  const faq =
    faqResult.status === "fulfilled" ? normalizeFaq(faqResult.value) : [];
  const projectsData =
    projectsResult.status === "fulfilled"
      ? projectsResult.value
      : { projects: [], totalPages: 1 };

  return {
    search,
    faq,
    projects: projectsData.projects,
    totalPages: projectsData.totalPages,
    seo,
  };
}

export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: {
  currentUrl: URL;
  nextUrl: URL;
}) {
  return currentUrl.search !== nextUrl.search;
}

export default function Search() {
  const {
    faq,
    projects: loaderProjects,
    totalPages: loaderTotalPages,
  } = useLoaderData() as {
    faq: any[];
    projects: any[];
    totalPages: number;
  };
  const [projects, setProjects] = useState<any[]>(loaderProjects);
  const [totalPages, setTotalPages] = useState(loaderTotalPages);
  const [currentPage, setCurrentPage] = useState(1);

  const icon = useIcons();
  const location = useLocation();

  useEffect(() => {
    setProjects(loaderProjects);
    setTotalPages(loaderTotalPages);
    setCurrentPage(1);
  }, [loaderProjects, loaderTotalPages]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);

    try {
      const params = new URLSearchParams(location.search);
      const results = await fetchSearchPage(params, page);
      setProjects(results.projects);
      setTotalPages(results.totalPages);
    } catch (err) {
      console.error("Search API error:", err);
    }
  };

  const getFAQTitle = () => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status") || "All";
    const interested = params.get("interested") || "Buy";

    if (status === "Off-plan") {
      return "FAQs about off-plan properties in Dubai";
    }

    if (interested === "Rent") {
      return "FAQs about rental properties in Dubai";
    }

    if (interested === "Buy") {
      return "FAQs about properties for sale in Dubai";
    }

    return "FAQs about properties in Dubai";
  };

  return (
    <div className="relative">
      <div className="[&_h1]:-translate-y-[32px] [&_h1]:transition-transform [&_h1]:duration-300 lg:[&_h1]:-translate-y-[70px]">
        <SearchHero />
      </div>

      <div className="relative z-20 -mt-[142px] px-[16px] pb-[30px] lg:-mt-[245px] lg:px-[45px] lg:pb-[40px]">
        <div className="mx-auto w-full max-w-[1404px]">
          <div
            style={{
              backgroundImage: `url(${icon.vLetter})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex flex-col items-start gap-[30px] lg:gap-[24px]">
              <SearchFIlterItems />

              <SearchResults projects={projects} currentPage={currentPage} />

              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            <div className="mt-[62px] flex w-full flex-col items-center gap-[22px] lg:mt-[64px] lg:gap-[46px]">
              <p
                className="
                  CormorantGaramond
                  max-w-[900px]
                  text-center
                  text-[24px]
                  leading-[1.12]
                  text-black
                  lg:text-[36px]
                "
                style={{
                  fontWeight: 500,
                  opacity: 1,
                  textShadow: "0 0 0.12px #111111",
                }}
              >
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
