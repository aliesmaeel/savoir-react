import React from "react";
import { Link } from "react-router";
import { useFormattedDate } from "~/hooks/functionHooks/useFormattedDate";
import useIcons from "~/hooks/imageHooks/useIcons";
import Card from "~/UI/Card";

type Props = {
  blog: any;
};

export default function BlogCard({ blog }: Props) {
  const icon = useIcons();

  return (
    <Card className="!rounded-[46px] p-[27px] pt-[24px]">
      <div className="flex flex-col items-start gap-[21px] w-full">
        <img
          loading="lazy"
          src={blog.blog_image.url}
          alt=""
          className="w-full aspect-[369/190] rounded-[10px] object-cover"
        />
        <div className="flex flex-col items-start gap-[15px] w-full">
          <div className="flex flex-col items-start gap-[7px] w-full">
            <p className="text-[#1C1C1B] text-[21px] font-medium">{blog.title}</p>
            <div className="flex items-center gap-[15px] w-full">
              <div className="flex items-center gap-[4px]">
                <img loading="lazy" src={icon.calendarGray} alt="" />
                <p className="text-[#636366] text-[12px]">{useFormattedDate(blog.created_at)}</p>
              </div>
              {/* <div className="flex items-center gap-[4px]">
                <img loading="lazy" src={icon.folderGray} alt="" />
                <p className="text-[#636366] text-[12px]">{blog.category}</p>
              </div> */}
            </div>
          </div>
          <div className="flex flex-col items-start gap-[6px] w-full">
            <p className="text-[#636366] text-[15px]">{blog.title_details}</p>
            <Link to={`/blogs/${blog.slug}`} className="text-[15px] font-semibold underline">
              Read more
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
