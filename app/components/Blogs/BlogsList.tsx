import React from "react";
import SearchSortBy from "../Search/SearchSortBy";
import BlogCard from "./BlogCard";

export default function BlogsList() {
  const blogs = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    title: `Want to succeed in real estate? Focus on these habits`,
    subtitle:
      "A fairy tale (alternative names include fairytale, fairy story, magic tale, or wonder tale) is a short story that belongs to the folklore genre..",
    image: "/images/placeholders/blogImage.jpg",
    category: "Technology",
    createdAt: "January 10, 2022",
  }));

  return (
    <div className="flex flex-col items-start gap-[50px] w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start gap-[15px] max-w-[835px]">
          <p className="text-[27px] font-medium">
            The articles page is an ideal platform for exploring new ideas and valuable information
          </p>
          <div className="flex flex-col items-start">
            <p className="text-[#505050] text-[21px]">
              Here, you can find articles covering a variety of topics that interest you
            </p>
            <p className="text-[21px] font-semibold">1094 results</p>
          </div>
        </div>
        <SearchSortBy />
      </div>
      <div className="grid grid-cols-3 w-full gap-x-[30px] gap-y-[45px]">
        {blogs.map((blog: any, index: number) => (
          <BlogCard key={index} blog={blog} />
        ))}
      </div>
    </div>
  );
}
