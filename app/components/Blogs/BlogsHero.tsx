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
        className="h-full w-full object-cover object-[center_38%] brightness-[0.48]"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center px-[16px] lg:px-[45px]">
        <div className="relative z-10 flex w-full max-w-[920px] -translate-y-[8px] flex-col items-center lg:-translate-y-[18px]">
          <h1
            className="
              CormorantGaramond
              text-center
              text-[26px]
              leading-[1.16]
              text-white
              drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]
              lg:text-[42px]
            "
            style={{
              fontWeight: 500,
              opacity: 1,
              textShadow: "0 4px 18px rgba(0,0,0,0.75)",
            }}
          >
            {blog?.title || ""}
          </h1>
        </div>

        <div
          className="absolute bottom-0 left-0 z-10 h-[160px] w-full lg:h-[190px]"
          style={{
            background:
              "linear-gradient(0deg, #FFF 0%, rgba(255,255,255,0.88) 14%, rgba(255,255,255,0.48) 40%, rgba(255,255,255,0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}