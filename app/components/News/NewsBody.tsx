import React from "react";
import { useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function NewsBody() {
  const icon = useIcons();
  const { newsItem } = useLoaderData() as { newsItem: any };

  return (
    <div className="flex flex-col items-start gap-[53px] w-full relative z-10">
      {/* title_details */}
      {newsItem.title_details && (
        <article
          className="text-[#505050] text-[14px] lg:text-[18px] leading-[180%]"
          dangerouslySetInnerHTML={{ __html: newsItem.title_details }}
        />
      )}

      {/* description_one_title and description_one */}
      {newsItem.description_one_title && (
        <div className="flex flex-col items-start gap-[22px] w-full">
          <h2 className="text-[15px] lg:text-[20px] font-semibold Theseasons undefined">
            {newsItem.description_one_title}
          </h2>
          {newsItem.description_one && (
            <article
              className="text-[#505050] text-[14px] lg:text-[18px] leading-[180%]"
              dangerouslySetInnerHTML={{ __html: newsItem.description_one }}
            />
          )}
        </div>
      )}

      {/* Three images */}
      {newsItem.first_image && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-[22px] w-full">
          <img
            loading="lazy"
            src={newsItem.first_image}
            alt=""
            className="w-full aspect-[676/564] rounded-[15px] lg:col-span-3 object-cover"
          />
          <div className="flex flex-col items-start gap-[22px] w-full lg:col-span-2">
            {newsItem.second_image && (
              <img
                loading="lazy"
                src={newsItem.second_image}
                alt=""
                className="w-full aspect-[453/271] rounded-[15px] object-cover"
              />
            )}
            {newsItem.third_image && (
              <img
                loading="lazy"
                src={newsItem.third_image}
                alt=""
                className="w-full aspect-[453/271] rounded-[15px] object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* description_two_title and description_two */}
      {newsItem.description_two_title && (
        <div className="flex flex-col items-start gap-[22px] w-full">
          <h2 className="text-[21px] text-[#353635] font-semibold">
            {newsItem.description_two_title}
          </h2>
          {newsItem.description_two && (
            <article
              className="text-[#505050] text-[14px] lg:text-[18px] leading-[180%]"
              dangerouslySetInnerHTML={{ __html: newsItem.description_two }}
            />
          )}
        </div>
      )}

      {/* description_three_title and description_three */}
      {newsItem.description_three_title && (
        <div className="flex flex-col items-start gap-[22px] w-full">
          <h2 className="text-[21px] text-[#353635] font-semibold">
            {newsItem.description_three_title}
          </h2>
          {newsItem.description_three && (
            <article
              className="text-[#505050] text-[14px] lg:text-[18px] leading-[180%]"
              dangerouslySetInnerHTML={{ __html: newsItem.description_three }}
            />
          )}
        </div>
      )}

      {/* description_four_title and description_four */}
      {newsItem.description_four_title && (
        <div className="flex flex-col items-start gap-[22px] w-full">
          <h2 className="text-[21px] text-[#353635] font-semibold">
            {newsItem.description_four_title}
          </h2>
          {newsItem.description_four && (
            <article
              className="text-[#505050] text-[14px] lg:text-[18px] leading-[180%]"
              dangerouslySetInnerHTML={{ __html: newsItem.description_four }}
            />
          )}
        </div>
      )}
    </div>
  );
}
