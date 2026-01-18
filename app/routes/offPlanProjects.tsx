import React from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { getAllOffPlans, getOffSearch } from "~/api/offPlan.service";
import OffPlanHero from "~/components/OffPlanProjects/OffPlanHero";
import OffPlanResults from "~/components/OffPlanProjects/OffPlanResults";
import PageLayout from "~/layouts/PageLayout";
import CustomPagination from "~/UI/CustomPagination";

function parseCsv(q: string | null) {
  return (q ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = 6;

  // read filters from query
  const developersQ = parseCsv(url.searchParams.get("developers"));
  const locationsQ = parseCsv(url.searchParams.get("locations"));
  const dateQ = url.searchParams.get("date"); // string like "Q1 2029" or null
  
  // read sort parameters from query
  const sortField = url.searchParams.get("sort_field") || "updated_at";
  const sortOrder = url.searchParams.get("sort_order") || "desc";

  // build request body for API
  const body = {
    developers: developersQ.length ? developersQ : null,
    completion_date: dateQ || null, // API expects string or null
    locations: locationsQ.length ? locationsQ : null,
  };

  try {
    const searchRes: any = await getOffSearch();
    const res: any = await getAllOffPlans(page, limit, body, sortField, sortOrder);
    const offPlan = res.data ?? [];
    const p = res.pagination ?? {};

    const totalPages =
      p.total_pages ??
      Math.max(1, Math.ceil((Number(p.total) || offPlan.length) / (Number(p.per_page) || limit)));

    const filters = {
      developers: developersQ,
      completion_date: dateQ || null,
      locations: locationsQ,
      hasActive: developersQ.length > 0 || !!dateQ || locationsQ.length > 0,
    };

    return {
      searchRes,
      offPlan,
      currentPage: Number(p.current_page) || page,
      totalPages,
      filters,
    };
  } catch {
    return {
      searchRes: [],
      offPlan: [],
      currentPage: 1,
      totalPages: 1,
      filters: { developers: [], completion_date: null, locations: [], hasActive: false },
    };
  }
}

export default function offPlanProjects() {
  const { offPlan, currentPage, totalPages } = useLoaderData() as {
    offPlan: any[];
    currentPage: number;
    totalPages: number;
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (nextPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(nextPage));
    navigate(`${location.pathname}?${url.searchParams.toString()}`, { preventScrollReset: true });
  };

  return (
    <div className="relative">
      <OffPlanHero />
      <PageLayout>
        <OffPlanResults offPlan={offPlan} />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </PageLayout>
    </div>
  );
}
