import React from "react";
import GoldTitle from "./GoldTitle";
import { Link } from "react-router";
import Button from "./Button";

type Props = {
  item: any;
  isRight?: boolean;
  /** Zero-based index of this block in the list. */
  index?: number;
  /** If set, only these indexes render the “visit the site” button. If omitted, every block shows it. */
  visitSiteIndexes?: number[];
};

export default function Content({ item, isRight, index = 0, visitSiteIndexes }: Props) {
  const showVisitSite =
    visitSiteIndexes === undefined ? true : visitSiteIndexes.includes(index);
  return (
    <div
      className={`flex flex-col  items-center gap-[52px] w-full ${isRight ? "lg:flex-row" : "lg:flex-row-reverse"}`}
    >
      <div className="flex flex-col items-start gap-[37px] w-full">
        <GoldTitle>{item.title}</GoldTitle>
        <p className="whitespace-pre-line text-black text-[15px] lg:text-[15px] leading-[200%]">
          {item.text}
        </p>
        {showVisitSite ? (
          <Link to={item.link}>
            <Button className="!rounded-[4px] !py-[15px] lg:!px-[81px] text-[18px] h-[44px]">
              visit the site
            </Button>
          </Link>
        ) : null}
      </div>
      <img
        loading="lazy"
        src={item.image}
        alt=""
        className="w-[576px] aspect-[576/336] object-cover"
      />
    </div>
  );
}
