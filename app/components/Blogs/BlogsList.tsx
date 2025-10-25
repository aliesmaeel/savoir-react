import React from "react";
import SearchSortBy from "../Search/SearchSortBy";
import BlogCard from "./BlogCard";
import { useLoaderData } from "react-router";

export default function BlogsList() {
  const { blogs } = useLoaderData() as { blogs: any };

  return (
    <div className="flex flex-col items-start gap-[50px] w-full">
      <div className="flex flex-col lg:flex-row gap-[10px] items-start justify-between w-full">
        <div className="flex flex-col items-start gap-[9px] lg:gap-[15px] max-w-[835px]">
          <p className="text-[16px] lg:text-[24px] font-medium">
            From market insights and investment tips to luxury lifestyle trends and expert opinions,
            our blog is your go-to source for knowledge, inspiration, and opportunities in one of
            the world’s most dynamic property markets. Stay informed, stay inspired, and stay ahead
            with Savoir.
          </p>
          <div className="flex flex-col items-start">
            <p className="text-[#505050] text-[12px] lg:text-[21px]">
              Here, you can find articles covering a variety of topics that interest you
            </p>
            <p className="text-[12px] lg:text-[21px] font-semibold">1094 results</p>
          </div>
        </div>
        <SearchSortBy />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-x-[30px] gap-y-[45px]">
        {blogs.map((blog: any, index: number) => (
          <BlogCard key={index} blog={blog} />
        ))}
      </div>
    </div>
  );
}
