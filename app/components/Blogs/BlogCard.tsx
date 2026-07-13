import React from "react";
import { Link } from "react-router";
import { useFormattedDate } from "~/hooks/functionHooks/useFormattedDate";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";

type Props = {
  blog: any;
};

const decodeHtmlEntities = (html: string): string => {
  if (typeof window === "undefined") return html;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  const decoded = textarea.value;

  const div = document.createElement("div");
  div.innerHTML = decoded;

  return div.textContent || div.innerText || "";
};

export default function BlogCard({ blog }: Props) {
  const icon = useIcons();

  const decodedDescription = blog.title_details
    ? decodeHtmlEntities(blog.title_details)
    : "";

  return (
    <Card className="!rounded-[46px] p-[27px] pt-[24px]">
      <div className="flex h-full w-full flex-col items-start gap-[21px]">
        <img
          src={blog.blog_image[0].url}
          alt=""
          className="aspect-[369/190] w-full rounded-[10px] object-cover"
        />

        <div className="flex w-full flex-1 flex-col items-start gap-[15px]">
          <div className="flex w-full flex-col items-start gap-[7px]">
            <p
              className="text-[15px]"
              style={{
                color: "#111111",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              {blog.title}
            </p>

            <div className="flex w-full items-center gap-[15px]">
              <div className="flex items-center gap-[4px]">
                <img src={icon.calendarGray} alt="" className="brightness-0" />

                <p
                  className="text-[12px]"
                  style={{
                    color: "#111111",
                    fontWeight: 600,
                    opacity: 1,
                  }}
                >
                  {blog.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-[4px]">
                <img src={icon.folderGray} alt="" className="brightness-0" />

                <p
                  className="text-[12px]"
                  style={{
                    color: "#111111",
                    fontWeight: 600,
                    opacity: 1,
                  }}
                >
                  {blog.category}
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col items-start gap-[10px]">
            <p
              className="text-[15px] leading-[165%]"
              style={{
                color: "#111111",
                fontWeight: 600,
                opacity: 1,
              }}
            >
              {decodedDescription}
            </p>

            <Link
              to={`/blogs/${blog.slug}`}
              className="
                mt-auto flex h-[30px] items-center justify-center rounded-[6px]
                bg-[#2B2B2B] px-[13px]
                text-[12px] font-semibold text-white
                shadow-[0_8px_18px_rgba(43,43,43,0.16)]
                transition-all duration-300 hover:bg-[#242424]
                lg:h-[32px] lg:px-[15px] lg:text-[13px]
              "
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}