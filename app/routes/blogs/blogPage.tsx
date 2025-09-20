import React from "react";
import BlogCard from "~/components/Blogs/BlogCard";
import NewsBody from "~/components/News/NewsBody";
import NewsPageHero from "~/components/News/NewsPageHero";
import PageLayout from "~/layouts/PageLayout";

export default function blogPage() {
  const blogs = Array.from({ length: 3 }, (_, index) => ({
    id: index + 1,
    title: `Want to succeed in real estate? Focus on these habits`,
    subtitle:
      "A fairy tale (alternative names include fairytale, fairy story, magic tale, or wonder tale) is a short story that belongs to the folklore genre..",
    image: "/images/placeholders/blogImage.jpg",
    category: "Technology",
    createdAt: "January 10, 2022",
  }));

  return (
    <div className="relative">
      <NewsPageHero />
      <PageLayout>
        <NewsBody />

        <div className="flex flex-col items-start gap-[37px] w-full mt-[75px]">
          <p className="text-black text-[31px] font-medium">You might also be interested in...</p>
          <div className="grid grid-cols-3 gap-[30px] w-full ">
            {blogs.map((blog: any, index: number) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        </div>
      </PageLayout>
    </div>
  );
}
