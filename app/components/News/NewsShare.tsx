import React, { useCallback, useEffect, useState } from "react";
import { Link, useLoaderData, useLocation } from "react-router";
import { getNewsShare } from "~/api/news.service";

export default function NewsShare() {
  const { newsItem } = useLoaderData() as { newsItem: any };
  const location = useLocation();

  const [shares, setShares] = useState<number>(newsItem.shares ?? 0);
  const [pending, setPending] = useState(false);
  const [hasShared, setHasShared] = useState(false);

  const isClient = typeof window !== "undefined";
  const shareUrl = isClient
    ? `${window.location.origin}${location.pathname}`
    : location.pathname;
  const STORAGE_KEY = isClient ? `news_shared_${newsItem.id}` : "";

  useEffect(() => {
    if (!isClient) return;
    setHasShared(localStorage.getItem(STORAGE_KEY) === "1");
  }, [STORAGE_KEY, isClient]);

  const copyToClipboard = useCallback(async () => {
    if (pending) return;
    setPending(true);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const el = document.createElement("textarea");
        el.value = shareUrl;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
    } catch {
      // ignore copy failures
    }

    if (hasShared) {
      setPending(false);
      return;
    }

    const prev = shares;
    setShares(prev + 1);

    try {
      await getNewsShare(newsItem.id);
      if (isClient) {
        localStorage.setItem(STORAGE_KEY, "1");
      }
      setHasShared(true);
    } catch {
      setShares(prev);
    } finally {
      setPending(false);
    }
  }, [pending, hasShared, shares, shareUrl, newsItem?.id, isClient, STORAGE_KEY]);

  const iconBoxClass =
    "flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#111111] shadow-[0_10px_24px_rgba(17,17,17,0.18)] transition-all duration-300 hover:bg-[#000000] hover:scale-[1.04] lg:h-[58px] lg:w-[58px]";

  const iconTextClass =
    "flex items-center justify-center text-[24px] font-bold leading-none text-white lg:text-[27px]";

  return (
    <div className="flex flex-row items-start gap-[33.6px] lg:flex-col">
      <div className="flex flex-col items-start gap-[27px]">
        <div className="flex flex-col items-start">
          <p className="text-[32px] text-[#121416]">{shares}</p>
          <p className="text-[20px] text-[#111111]">Shares</p>
        </div>

        <hr className="hidden w-full border-[#E9ECEF] lg:block" />
      </div>

      <div className="flex flex-row items-start gap-[11px] lg:flex-col">
        <Link
          to="https://www.facebook.com/"
          onClick={copyToClipboard}
          aria-label="Share on Facebook"
          target="_blank"
          className={iconBoxClass}
        >
          <span className={iconTextClass}>f</span>
        </Link>

        <Link
          to="https://www.instagram.com/"
          onClick={copyToClipboard}
          aria-label="Share on Instagram"
          target="_blank"
          className={iconBoxClass}
        >
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border-[2px] border-white text-[15px] font-bold leading-none text-white lg:h-[27px] lg:w-[27px] lg:text-[16px]">
            ◎
          </span>
        </Link>

        <Link
          to="https://www.linkedin.com/"
          onClick={copyToClipboard}
          aria-label="Share on LinkedIn"
          target="_blank"
          className={iconBoxClass}
        >
          <span className="text-[19px] font-bold leading-none text-white lg:text-[21px]">
            in
          </span>
        </Link>

        <button
          type="button"
          onClick={copyToClipboard}
          disabled={pending}
          aria-label="Copy link"
          title={
            pending
              ? "Working..."
              : hasShared
              ? "Link copied. Already counted."
              : "Copy link"
          }
          className={`${iconBoxClass} ${pending ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <span className="relative h-[24px] w-[24px] lg:h-[27px] lg:w-[27px]">
            <span className="absolute left-[2px] top-[5px] h-[17px] w-[14px] rounded-[2px] border-[2px] border-white lg:h-[19px] lg:w-[16px]" />
            <span className="absolute left-[8px] top-[1px] h-[17px] w-[14px] rounded-[2px] border-[2px] border-white bg-[#111111] lg:h-[19px] lg:w-[16px]" />
          </span>
        </button>
      </div>
    </div>
  );
}