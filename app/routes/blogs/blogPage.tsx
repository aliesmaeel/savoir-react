import React from "react";
import { useLoaderData } from "react-router";
import { SwiperSlide } from "swiper/react";
import { getBlogPage } from "~/api/blogs.service";
import BlogBody from "~/components/Blogs/BlogBody";
import BlogCard from "~/components/Blogs/BlogCard";
import BlogsHero from "~/components/Blogs/BlogsHero";
import BlogShare from "~/components/Blogs/BlogShare";
import PageLayout from "~/layouts/PageLayout";
import ThreeSwiper from "~/UI/ThreeSwiper";

export async function clientLoader({ params }: { params: { blogSlug: string } }) {
  const blogSlug = params.blogSlug;
  try {
    const res: any = await getBlogPage(blogSlug);

    const blog = res.blog || null;
    const blogs = res.suggested_blogs || [];

    return { blog, blogs };
  } catch (error) {
    return { blog: null, blogs: [] };
  }
}

export default function blogPage() {
  const { blog, blogs } = useLoaderData() as { blog: any; blogs: any[] };

  if (!blog) {
    return (
      <div className="relative">
        <PageLayout>
          <p className="text-black text-[21px]">Blog not found</p>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="relative">
      <BlogsHero />
      <PageLayout>
        <div className="flex flex-col lg:flex-row items-start gap-[33px] w-full">
          <BlogShare />
          <BlogBody />
        </div>

        {blogs.length > 0 && (
          <div className="flex flex-col items-start gap-[37px] w-full mt-[75px]">
            <p className="text-black text-[31px] font-medium">You might also be interested in...</p>
            <ThreeSwiper>
              {blogs.map((blogItem: any, index: number) => (
                <SwiperSlide key={blogItem.id || index}>
                  <BlogCard blog={blogItem} />
                </SwiperSlide>
              ))}
            </ThreeSwiper>
          </div>
        )}
      </PageLayout>
    </div>
  );
}
