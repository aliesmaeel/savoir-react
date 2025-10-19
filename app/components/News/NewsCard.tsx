import React from "react";
import { Link } from "react-router";
import Card from "~/UI/Card";

export default function NewsCard() {
  return (
    <Card className="!px-[23px] !py-[27px] !rounded-[46.534px]">
      <div className="flex flex-col items-start gap-[21px] w-full">
        <img
          loading="lazy"
          src="/images/placeholders/NewsPlaceholder.jpg"
          alt=""
          className="w-full aspect-[375/277] rounded-[10px] object-cover"
        />
        <div className="flex flex-col items-start gap-[11px]">
          <div className="flex flex-col items-start gap-[2px]">
            <p className="text-[#C6A45A] text-[15px] font-semibold">
              Bringing South African Luxury to Dubai: Savoir Properties x Chas Everitt
            </p>
            <p className="text-[#505050] text-[15px]">12 / 8 / 2025</p>
          </div>
          <Link to={`/news/1`} className="text-[15px] font-semibold underline">
            Read more
          </Link>
        </div>
      </div>
    </Card>
  );
}
