import React from "react";
import { getAllBlogs } from "~/api/blogs.service";
import BlogsList from "~/components/Blogs/BlogsList";
import MainBlogsHero from "~/components/Blogs/MainBlogsHero";
import PageLayout from "~/layouts/PageLayout";

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = 9;

  try {
    const res: any = await getAllBlogs(page, limit);
    const blogs = res.data ?? [];
    const p = res.pagination ?? {};

    // Calculate total pages from pagination data
    const totalPages =
      p.last_page ??
      Math.max(1, Math.ceil((Number(p.total) || blogs.length) / (Number(p.per_page) || limit)));

    return {
      blogs,
      currentPage: Number(p.current_page) || page,
      totalPages,
      total: Number(p.total) || blogs.length,
    };
  } catch (error) {
    return { blogs: [], currentPage: 1, totalPages: 1, total: 0 };
  }
}

export default function blogs() {
  return (
    <div>
      <MainBlogsHero />
      <PageLayout>
        <BlogsList />
      </PageLayout>
    </div>
  );
}
