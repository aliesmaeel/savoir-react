import React from "react";
import { useLoaderData } from "react-router";

export default function BlogBody() {
  const { blog } = useLoaderData() as { blog: any };

  if (!blog) {
    return null;
  }

  return (
    <div
      className="
        relative z-10 flex w-full flex-col items-start gap-[53px]

        [&_article]:!text-[#111111]
        [&_article]:!opacity-100
        [&_article_p]:!text-[#111111]
        [&_article_p]:!opacity-100
        [&_article_span]:!text-[#111111]
        [&_article_span]:!opacity-100
        [&_article_li]:!text-[#111111]
        [&_article_strong]:!text-[#111111]
      "
    >
      {/* title_details */}
      {blog.title_details && (
        <article
          className="description-body article-heading-body article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
          style={{
            color: "#111111",
            fontWeight: 400,
            opacity: 1,
          }}
          dangerouslySetInnerHTML={{ __html: blog.title_details }}
        />
      )}

      {/* description_one_title and description_one */}
      {blog.description_one_title && (
        <div className="flex w-full flex-col items-start gap-[22px]">
          <h2
            className="CormorantGaramond article-point-heading text-[20px] leading-[1.18] lg:text-[28px]"
            style={{
              color: "#050505",
              fontWeight: 400,
              opacity: 1,
              textShadow: "0 0 0.28px currentColor",
            }}
          >
            {blog.description_one_title}
          </h2>

          {blog.description_one && (
            <article
              className="description-body article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 400,
                opacity: 1,
              }}
              dangerouslySetInnerHTML={{ __html: blog.description_one }}
            />
          )}
        </div>
      )}

      {/* Three images */}
      {blog.first_image && (
        <div className="grid w-full grid-cols-1 items-start gap-[22px] lg:grid-cols-5">
          <img
            loading="lazy"
            src={blog.first_image}
            alt=""
            className="aspect-[676/564] w-full rounded-[15px] object-cover lg:col-span-3"
          />

          <div className="flex w-full flex-col items-start gap-[22px] lg:col-span-2">
            {blog.second_image && (
              <img
                loading="lazy"
                src={blog.second_image}
                alt=""
                className="aspect-[453/271] w-full rounded-[15px] object-cover"
              />
            )}

            {blog.third_image && (
              <img
                loading="lazy"
                src={blog.third_image}
                alt=""
                className="aspect-[453/271] w-full rounded-[15px] object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* description_two_title and description_two */}
      {blog.description_two_title && (
        <div className="flex w-full flex-col items-start gap-[22px]">
          <h2
            className="CormorantGaramond article-point-heading text-[20px] leading-[1.18] lg:text-[28px]"
            style={{
              color: "#050505",
              fontWeight: 400,
              opacity: 1,
              textShadow: "0 0 0.28px currentColor",
            }}
          >
            {blog.description_two_title}
          </h2>

          {blog.description_two && (
            <article
              className="description-body article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 400,
                opacity: 1,
              }}
              dangerouslySetInnerHTML={{ __html: blog.description_two }}
            />
          )}
        </div>
      )}

      {/* description_three_title and description_three */}
      {blog.description_three_title && (
        <div className="flex w-full flex-col items-start gap-[22px]">
          <h2
            className="CormorantGaramond article-point-heading text-[20px] leading-[1.18] lg:text-[28px]"
            style={{
              color: "#050505",
              fontWeight: 400,
              opacity: 1,
              textShadow: "0 0 0.28px currentColor",
            }}
          >
            {blog.description_three_title}
          </h2>

          {blog.description_three && (
            <article
              className="description-body article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 400,
                opacity: 1,
              }}
              dangerouslySetInnerHTML={{ __html: blog.description_three }}
            />
          )}
        </div>
      )}

      {/* description_four_title and description_four */}
      {blog.description_four_title && (
        <div className="flex w-full flex-col items-start gap-[22px]">
          <h2
            className="CormorantGaramond article-point-heading text-[20px] leading-[1.18] lg:text-[28px]"
            style={{
              color: "#050505",
              fontWeight: 400,
              opacity: 1,
              textShadow: "0 0 0.28px currentColor",
            }}
          >
            {blog.description_four_title}
          </h2>

          {blog.description_four && (
            <article
              className="description-body article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 400,
                opacity: 1,
              }}
              dangerouslySetInnerHTML={{ __html: blog.description_four }}
            />
          )}
        </div>
      )}
    </div>
  );
}
