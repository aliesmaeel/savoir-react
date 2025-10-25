import React from "react";
import { Link } from "react-router";
import Card from "~/UI/Card";

type Props = {
  newsItem: any;
};

export default function NewsCard({ newsItem }: Props) {
  return (
    <Card className="!px-[23px] !py-[27px] !rounded-[46.534px]">
      <div className="flex flex-col items-start gap-[21px] w-full">
        <img
          loading="lazy"
          src={newsItem.image}
          alt=""
          className="w-full aspect-[375/277] rounded-[10px] object-cover"
        />
        <div className="flex flex-col items-start gap-[11px]">
          <div className="flex flex-col items-start gap-[2px]">
            <p className="text-[#C6A45A] text-[15px] font-semibold">{newsItem.title}</p>
            <p className="text-[#505050] text-[15px]">{newsItem.created_at}</p>
          </div>
          <Link to={`/news/${newsItem.slug}`} className="text-[15px] font-semibold underline">
            Read more
          </Link>
        </div>
      </div>
    </Card>
  );
}
