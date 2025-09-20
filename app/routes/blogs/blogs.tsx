import React from "react";
import BlogsHero from "~/components/Blogs/BlogsHero";
import BlogsList from "~/components/Blogs/BlogsList";
import PageLayout from "~/layouts/PageLayout";

export default function blogs() {
  return (
    <div>
      <BlogsHero />
      <PageLayout>
        <BlogsList />
      </PageLayout>
    </div>
  );
}
