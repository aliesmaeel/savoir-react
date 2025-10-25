import React from "react";
import { useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function BlogBody() {
  const icon = useIcons();
  const { blog } = useLoaderData() as { blog: any };

  return (
    <div className="flex flex-col items-start gap-[53px] w-full relative z-10">
      <article
        className="text-black text-[14px] lg:text-[21px] leading-[214.286%]"
        dangerouslySetInnerHTML={{ __html: blog.body }}
      />

      {/* <div className="grid grid-cols-1 lg:grid-cols-5 gap-[22px] w-full">
        <img
          loading="lazy"
          src={blogs.first_image}
          alt=""
          className="w-full aspect-[676/564] rounded-[15px] lg:col-span-3 object-cover"
        />
        <div className="flex flex-col items-start gap-[22px] w-full lg:col-span-2">
          <img
            loading="lazy"
            src={blogs.second_image}
            alt=""
            className="w-full aspect-[453/271] rounded-[15px] object-cover"
          />
          <img
            loading="lazy"
            src={blogs.third_image}
            alt=""
            className="w-full aspect-[453/271] rounded-[15px] object-cover"
          />
        </div>
      </div> */}
    </div>
  );
}
