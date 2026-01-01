import React from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import SearchSortBy from "../Search/SearchSortBy";
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

  const handlePageChange = (nextPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(nextPage));
    navigate(`${location.pathname}?${url.searchParams.toString()}`, {
      preventScrollReset: true,
    });
  };

  return (
    <div className="flex flex-col items-start gap-[50px] w-full">
      <div className="flex flex-col lg:flex-row gap-[10px] items-start justify-between w-full">
        <div className="flex flex-col items-start gap-[9px] lg:gap-[15px] max-w-[835px]">
          <p className="text-[16px] lg:text-[24px] font-medium">
            From market insights and investment tips to luxury lifestyle trends and expert opinions,
            our blog is your go-to source for knowledge, inspiration, and opportunities in one of
            the world's most dynamic property markets. Stay informed, stay inspired, and stay ahead
            with Savoir.
          </p>
          <div className="flex flex-col items-start">
            <p className="text-[#505050] text-[12px] lg:text-[21px]">
              Here, you can find articles covering a variety of topics that interest you
            </p>
            <p className="text-[12px] lg:text-[21px] font-semibold">{total} results</p>
          </div>
        </div>
        <SearchSortBy />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-x-[30px] gap-y-[45px]">
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
