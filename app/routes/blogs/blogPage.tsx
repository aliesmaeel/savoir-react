import React from "react";
import { useLoaderData } from "react-router";
import { SwiperSlide } from "swiper/react";
import { getBlogPage } from "~/api/blogs.service";
import BlogBody from "~/components/Blogs/BlogBody";
import BlogCard from "~/components/Blogs/BlogCard";
import BlogsHero from "~/components/Blogs/BlogsHero";
import NewsBody from "~/components/News/NewsBody";
import NewsPageHero from "~/components/News/NewsPageHero";
import PageLayout from "~/layouts/PageLayout";
import ThreeSwiper from "~/UI/ThreeSwiper";

export async function clientLoader({ params }: { params: { blogSlug: string } }) {
  const blogSlug = params.blogSlug;
  try {
    const res: any = await getBlogPage(blogSlug);

    const blog = res.blog;
    const blogs = res.suggested_blogs;

    return { blog, blogs };
  } catch (error) {
    return { blog: [], blogs: [] };
  }
}

export default function blogPage() {
  const { blogs } = useLoaderData() as { blogs: any };

  return (
    <div className="relative">
      <BlogsHero />
      <PageLayout>
        <BlogBody />

        <div className="flex flex-col items-start gap-[37px] w-full mt-[75px]">
          <p className="text-black text-[31px] font-medium">You might also be interested in...</p>
          <ThreeSwiper>
            {blogs.map((blog: any, index: number) => (
              <SwiperSlide>
                <BlogCard key={index} blog={blog} />
              </SwiperSlide>
            ))}
          </ThreeSwiper>
        </div>
      </PageLayout>
    </div>
  );
}
