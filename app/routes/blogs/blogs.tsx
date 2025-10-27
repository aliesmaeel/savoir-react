import React from "react";
import { getAllBlogs } from "~/api/blogs.service";
import BlogsList from "~/components/Blogs/BlogsList";
import MainBlogsHero from "~/components/Blogs/MainBlogsHero";
import PageLayout from "~/layouts/PageLayout";

export async function clientLoader({ request }: { request: Request }) {
  try {
    const res: any = await getAllBlogs();

    const blogs = res.data;

    return { blogs };
  } catch (error) {
    return { blogs: [] };
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
