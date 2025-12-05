import React from "react";
import { useLoaderData } from "react-router";

export default function BlogsHero() {
  const { blog } = useLoaderData() as { blog: any };
  console.log(blog);
  return (
    <div className="flex flex-col items-center justify-center w-full h-[48vh] lg:h-screen relative">
      <img
        loading="lazy"
        src={blog.blog_image[0].url}
        alt=""
        className="w-full h-screen object-contain lg:object-cover"
      />
      <div className="flex flex-col items-center justify-center w-full h-[50vh] lg:h-screen absolute top-0 left-0 px-[16px] lg:px-[45px]">
        <div className="flex flex-col items-center gap-[53.68px] w-full max-w-[1226px]">
          <div className="flex flex-col items-center gap-[17px] w-full">
            <h1 className="text-white text-[16px] lg:text-[51.04px] text-center ">{blog.title}</h1>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[176px] z-10"
          style={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
          }}
        />
      </div>
    </div>
  );
}
