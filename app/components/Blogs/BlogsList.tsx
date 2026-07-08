import React, { useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import BlogCard from "./BlogCard";
import CustomPagination from "~/UI/CustomPagination";

export default function BlogsList() {
  const { blogs, currentPage, totalPages, total } = useLoaderData() as {
    blogs: any[];
    currentPage: number;
    totalPages: number;
    total: number;
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [sortOpen, setSortOpen] = useState(false);

  const params = new URLSearchParams(location.search);
  const currentSort = params.get("sort_field") || "title";

  const handlePageChange = (nextPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(nextPage));

    navigate(`${location.pathname}?${url.searchParams.toString()}`, {
      preventScrollReset: true,
    });
  };

  const handleSortChange = (value: "title" | "date") => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort_field", value);
    url.searchParams.set("page", "1");

    navigate(`${location.pathname}?${url.searchParams.toString()}`, {
      preventScrollReset: true,
    });

    setSortOpen(false);
  };

  return (
    <div className="flex w-full flex-col items-start gap-[50px]">
      <div className="flex w-full flex-col items-start justify-between gap-[18px] lg:flex-row lg:items-center">
        <div className="flex max-w-[835px] flex-col items-start gap-[9px] lg:gap-[15px]">
          <div className="flex flex-col items-start gap-[4px]">
            <p
              className="CormorantGaramond text-[14px] leading-[1.45] lg:text-[22px]"
              style={{
                color: "#111111",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              Here, you can find articles covering a variety of topics that interest you
            </p>

            <p
              className="CormorantGaramond text-[14px] leading-[1.2] lg:text-[22px]"
              style={{
                color: "#111111",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              {total} results
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((prev) => !prev)}
            className="
              flex h-[38px] min-w-[190px] items-center justify-between
              rounded-[10px] bg-[#2B2B2B] px-[16px]
              shadow-[0_10px_24px_rgba(43,43,43,0.18)]
              transition-all duration-300 hover:bg-[#242424]
              lg:h-[40px] lg:min-w-[205px] lg:px-[17px]
            "
          >
            <div className="flex items-center gap-[13px]">
              <span className="text-[19px] font-semibold leading-none text-white">
                ⇅
              </span>

              <span className="h-[22px] w-px bg-white/45" />

              <span className="text-[13px] font-semibold text-white lg:text-[14px]">
                Sort by : {currentSort === "date" ? "Date" : "Title"}
              </span>
            </div>

            <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-white/70 bg-[#2B2B2B] text-[14px] font-bold leading-none text-white">
              {sortOpen ? "⌃" : "⌄"}
            </span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-[48px] z-30 w-full overflow-hidden rounded-[10px] bg-[#2B2B2B] shadow-[0_12px_28px_rgba(43,43,43,0.22)]">
              <button
                type="button"
                onClick={() => handleSortChange("title")}
                className="flex h-[38px] w-full items-center px-[16px] text-left text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#242424]"
              >
                Title
              </button>

              <button
                type="button"
                onClick={() => handleSortChange("date")}
                className="flex h-[38px] w-full items-center px-[16px] text-left text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#242424]"
              >
                Date
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="
          grid w-full grid-cols-1 gap-x-[30px] gap-y-[45px] lg:grid-cols-3

          [&_p]:!text-[#111111]
          [&_p]:!font-semibold
          [&_p]:!opacity-100
          [&_h1]:!text-[#111111]
          [&_h1]:!font-bold
          [&_h2]:!text-[#111111]
          [&_h2]:!font-bold
          [&_h3]:!text-[#111111]
          [&_h3]:!font-bold
          [&_span]:!text-[#111111]
          [&_span]:!font-semibold
          [&_span]:!opacity-100
          [&_a]:!font-semibold
        "
      >
        {blogs.map((blog: any, index: number) => (
          <BlogCard key={blog.id || index} blog={blog} />
        ))}
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}