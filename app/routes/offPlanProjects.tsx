import React from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { getAllOffPlans } from "~/api/offPlan.service";
import OffPlanHero from "~/components/OffPlanProjects/OffPlanHero";
import OffPlanResults from "~/components/OffPlanProjects/OffPlanResults";
import PageLayout from "~/layouts/PageLayout";
import CustomPagination from "~/UI/CustomPagination";

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = 6;

  try {
    const res: any = await getAllOffPlans(page, limit);
    const offPlan = res.data ?? [];
    const p = res.pagination ?? {};

    // Prefer server-provided total_pages. Fallback to total/per_page.
    const totalPages =
      p.total_pages ??
      Math.max(1, Math.ceil((Number(p.total) || offPlan.length) / (Number(p.per_page) || limit)));

    return {
      offPlan,
      currentPage: Number(p.current_page) || page,
      totalPages,
    };
  } catch {
    return { offPlan: [], currentPage: 1, totalPages: 1 };
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
    navigate(`${location.pathname}?${url.searchParams.toString()}`, {
      preventScrollReset: true,
    });
  };

  return (
    <div className="relative">
      <OffPlanHero />
      <PageLayout>
        <OffPlanResults />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </PageLayout>
    </div>
  );
}
