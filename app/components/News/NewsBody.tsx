import React from "react";
import { useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function NewsBody() {
  const icon = useIcons();
  const { newsItem } = useLoaderData() as { newsItem: any };

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

        [&_article_h1]:!text-[#111111]
        [&_article_h1]:!opacity-100
        [&_article_h1]:!leading-[1.2]
        [&_article_h1]:!font-normal
        [&_article_h1]:!max-w-[1180px]
        [&_article_h1]:!mb-[24px]

        [&_article_h2]:!text-[#111111]
        [&_article_h2]:!opacity-100
        [&_article_h2]:!leading-[1.2]
        [&_article_h2]:!font-normal
        [&_article_h2]:!max-w-[1180px]
        [&_article_h2]:!mb-[22px]

        [&_article_h3]:!text-[#111111]
        [&_article_h3]:!opacity-100
        [&_article_h3]:!leading-[1.2]
        [&_article_h3]:!font-normal
        [&_article_h3]:!max-w-[1180px]
        [&_article_h3]:!mb-[20px]

        [&_.news-share-icons_a]:!bg-[#111111]
        [&_.news-share-icons_button]:!bg-[#111111]
        [&_.news-share-icons_img]:brightness-0
        [&_.news-share-icons_img]:invert
      "
    >
      {/* title_details */}
      {newsItem.title_details && (
        <article
          className="article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
          style={{
            color: "#111111",
            fontWeight: 400,
            opacity: 1,
          }}
          dangerouslySetInnerHTML={{ __html: newsItem.title_details }}
        />
      )}

      {/* description_one_title and description_one */}
      {newsItem.description_one_title && (
        <div className="flex w-full flex-col items-start gap-[22px]">
          <h2
            className="CormorantGaramond text-[20px] leading-[1.18] lg:text-[28px]"
            style={{
              color: "#050505",
              fontWeight: 400,
              opacity: 1,
              textShadow: "0 0 0.28px currentColor",
            }}
          >
            {newsItem.description_one_title}
          </h2>

          {newsItem.description_one && (
            <article
              className="article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 400,
                opacity: 1,
              }}
              dangerouslySetInnerHTML={{ __html: newsItem.description_one }}
            />
          )}
        </div>
      )}

      {/* Three images */}
      {newsItem.first_image && (
        <div className="grid w-full grid-cols-1 items-start gap-[22px] lg:grid-cols-5">
          <img
            loading="lazy"
            src={newsItem.first_image}
            alt=""
            className="aspect-[676/564] w-full rounded-[15px] object-cover lg:col-span-3"
          />

          <div className="flex w-full flex-col items-start gap-[22px] lg:col-span-2">
            {newsItem.second_image && (
              <img
                loading="lazy"
                src={newsItem.second_image}
                alt=""
                className="aspect-[453/271] w-full rounded-[15px] object-cover"
              />
            )}

            {newsItem.third_image && (
              <img
                loading="lazy"
                src={newsItem.third_image}
                alt=""
                className="aspect-[453/271] w-full rounded-[15px] object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* description_two_title and description_two */}
      {newsItem.description_two_title && (
        <div className="flex w-full flex-col items-start gap-[22px]">
          <h2
            className="CormorantGaramond text-[20px] leading-[1.18] lg:text-[28px]"
            style={{
              color: "#050505",
              fontWeight: 400,
              opacity: 1,
              textShadow: "0 0 0.28px currentColor",
            }}
          >
            {newsItem.description_two_title}
          </h2>

          {newsItem.description_two && (
            <article
              className="article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 400,
                opacity: 1,
              }}
              dangerouslySetInnerHTML={{ __html: newsItem.description_two }}
            />
          )}
        </div>
      )}

      {/* description_three_title and description_three */}
      {newsItem.description_three_title && (
        <div className="flex w-full flex-col items-start gap-[22px]">
          <h2
            className="CormorantGaramond text-[20px] leading-[1.18] lg:text-[28px]"
            style={{
              color: "#050505",
              fontWeight: 400,
              opacity: 1,
              textShadow: "0 0 0.28px currentColor",
            }}
          >
            {newsItem.description_three_title}
          </h2>

          {newsItem.description_three && (
            <article
              className="article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 400,
                opacity: 1,
              }}
              dangerouslySetInnerHTML={{ __html: newsItem.description_three }}
            />
          )}
        </div>
      )}

      {/* description_four_title and description_four */}
      {newsItem.description_four_title && (
        <div className="flex w-full flex-col items-start gap-[22px]">
          <h2
            className="CormorantGaramond text-[20px] leading-[1.18] lg:text-[28px]"
            style={{
              color: "#050505",
              fontWeight: 400,
              opacity: 1,
              textShadow: "0 0 0.28px currentColor",
            }}
          >
            {newsItem.description_four_title}
          </h2>

          {newsItem.description_four && (
            <article
              className="article-rich-copy text-[14px] leading-[160%] lg:text-[18px]"
              style={{
                color: "#111111",
                fontWeight: 400,
                opacity: 1,
              }}
              dangerouslySetInnerHTML={{ __html: newsItem.description_four }}
            />
          )}
        </div>
      )}
    </div>
  );
}