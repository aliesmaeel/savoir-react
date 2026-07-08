import React from "react";
import { Link } from "react-router";
import Card from "~/UI/Card";

type Props = {
  newsItem: any;
};

export default function NewsCard({ newsItem }: Props) {
  return (
    <Card className="!rounded-[46.534px] !px-[23px] !py-[27px]">
      <div className="flex w-full flex-col items-start gap-[21px]">
        <img
          loading="lazy"
          src={newsItem.image}
          alt=""
          className="aspect-[375/277] w-full rounded-[10px] object-cover"
        />

        <div className="flex flex-col items-start gap-[11px]">
          <div className="flex flex-col items-start gap-[4px]">
            <p
              className="text-[15px] leading-[1.45]"
              style={{
                color: "#111111",
                fontWeight: 700,
                opacity: 1,
              }}
            >
              {newsItem.title}
            </p>

            <p
              className="text-[14px]"
              style={{
                color: "#111111",
                fontWeight: 600,
                opacity: 1,
              }}
            >
              {newsItem.created_at}
            </p>
          </div>

          <Link
            to={`/news/${newsItem.slug}`}
            className="
              flex h-[30px] items-center justify-center rounded-[6px]
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
    </Card>
  );
}