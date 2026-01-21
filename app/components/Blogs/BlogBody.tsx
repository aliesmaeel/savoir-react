import React from "react";
import { useLoaderData } from "react-router";

export default function BlogBody() {
  const { blog } = useLoaderData() as { blog: any };

  if (!blog) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-[53px] w-full relative z-10">
      {/* title_details */}
      {blog.title_details && (
        <article
          className="text-black text-[24px] lg:text-[32px] leading-[214.286%]"
          dangerouslySetInnerHTML={{ __html: blog.title_details }}
        />
      )}

      {/* description_one_title and description_one */}
      {blog.description_one_title && (
        <div className="flex flex-col items-start gap-[22px] w-full">
          <h2 className="text-black text-[20px] lg:text-[27px] font-semibold">
            {blog.description_one_title}
          </h2>
          {blog.description_one && (
            <article
              className="text-black text-[14px] lg:text-[21px] leading-[214.286%]"
              dangerouslySetInnerHTML={{ __html: blog.description_one }}
            />
          )}
        </div>
      )}

      {/* Three images */}
      {blog.first_image && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-[22px] w-full">
          <img
            loading="lazy"
            src={blog.first_image}
            alt=""
            className="w-full aspect-[676/564] rounded-[15px] lg:col-span-3 object-cover"
          />
          <div className="flex flex-col items-start gap-[22px] w-full lg:col-span-2">
            {blog.second_image && (
              <img
                loading="lazy"
                src={blog.second_image}
                alt=""
                className="w-full aspect-[453/271] rounded-[15px] object-cover"
              />
            )}
            {blog.third_image && (
              <img
                loading="lazy"
                src={blog.third_image}
                alt=""
                className="w-full aspect-[453/271] rounded-[15px] object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* description_two_title and description_two */}
      {blog.description_two_title && (
        <div className="flex flex-col items-start gap-[22px] w-full">
          <h2 className="text-black text-[20px] lg:text-[27px] font-semibold">
            {blog.description_two_title}
          </h2>
          {blog.description_two && (
            <article
              className="text-black text-[14px] lg:text-[21px] leading-[214.286%]"
              dangerouslySetInnerHTML={{ __html: blog.description_two }}
            />
          )}
        </div>
      )}

      {/* description_three_title and description_three */}
      {blog.description_three_title && (
        <div className="flex flex-col items-start gap-[22px] w-full">
          <h2 className="text-black text-[20px] lg:text-[27px] font-semibold">
            {blog.description_three_title}
          </h2>
          {blog.description_three && (
            <article
              className="text-black text-[14px] lg:text-[21px] leading-[214.286%]"
              dangerouslySetInnerHTML={{ __html: blog.description_three }}
            />
          )}
        </div>
      )}

      {/* description_four_title and description_four */}
      {blog.description_four_title && (
        <div className="flex flex-col items-start gap-[22px] w-full">
          <h2 className="text-black text-[20px] lg:text-[27px] font-semibold">
            {blog.description_four_title}
          </h2>
          {blog.description_four && (
            <article
              className="text-black text-[14px] lg:text-[21px] leading-[214.286%]"
              dangerouslySetInnerHTML={{ __html: blog.description_four }}
            />
          )}
        </div>
      )}
    </div>
  );
}
