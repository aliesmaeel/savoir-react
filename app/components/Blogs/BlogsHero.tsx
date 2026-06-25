import React from "react";
import { useLoaderData } from "react-router";

export default function BlogsHero() {
  const { blog } = useLoaderData() as { blog: any };

  const blogImage = blog?.blog_image?.[0]?.url || "/images/placeholders/hero.webp";

  return (
    <div className="relative flex h-[520px] w-full flex-col items-center justify-center overflow-hidden lg:h-screen">
      <img
        loading="lazy"
        src={blogImage}
        alt=""
        className="h-full w-full object-cover brightness-[0.42]"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center px-[16px] lg:px-[45px]">
        <div className="relative z-10 flex w-full max-w-[1300px] flex-col items-center">
          <h1 className="text-center text-[34px] leading-[1.15] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] lg:text-[76px]">
            {blog?.title || ""}
          </h1>
        </div>

        <div
          className="absolute bottom-0 left-0 z-10 h-[160px] w-full lg:h-[200px]"
          style={{
            background:
              "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}