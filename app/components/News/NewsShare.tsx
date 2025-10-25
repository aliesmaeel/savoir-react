import React, { useCallback, useState } from "react";
import { Link, useLoaderData, useLocation } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";
import { getNewsShare } from "~/api/news.service";

export default function NewsShare() {
  const icon = useIcons();
  const { newsItem } = useLoaderData() as { newsItem: any };
  const [shares, setShares] = useState<number>(newsItem.shares ?? 0);
  const [pending, setPending] = useState(false);
  const location = useLocation();

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${location.pathname}`
      : location.pathname;

  const copyToClipboard = useCallback(async () => {
    if (pending) return;
    setPending(true);

    const prev = shares;
    setShares(prev + 1); // optimistic

    try {
      // 1) copy link
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

      // 2) hit API to persist share increment
      await getNewsShare(newsItem.id);
    } catch {
      // rollback if API fails
      setShares(prev);
    } finally {
      setPending(false);
    }
  }, [pending, shares, shareUrl, newsItem?.id]);

  return (
    <div className="flex flex-row lg:flex-col items-start gap-[33.6px]">
      <div className="flex flex-col items-start gap-[27px]">
        <div className="flex flex-col items-start">
          <p className="text-[#121416] text-[32px]">{shares}</p>
          <p className="text-[#A7A7A7] text-[20px]">Shares</p>
        </div>
        <hr className="w-full border-[#E9ECEF] hidden lg:block" />
      </div>

      <div className="flex flex-row lg:flex-col items-start gap-[11px]">
        <Link
          to="https://www.facebook.com/"
          onClick={copyToClipboard}
          aria-label="Share on Facebook"
          target="_blank"
        >
          <img loading="lazy" src={icon.facebookShare} alt="Facebook" />
        </Link>
        <Link
          to="https://www.instagram.com/"
          onClick={copyToClipboard}
          aria-label="Share on Instagram"
          target="_blank"
        >
          <img loading="lazy" src={icon.instagramShare} alt="Instagram" />
        </Link>
        <Link
          to="https://www.linkedin.com/"
          onClick={copyToClipboard}
          aria-label="Share on LinkedIn"
          target="_blank"
        >
          <img loading="lazy" src={icon.linkedinShare} alt="LinkedIn" />
        </Link>

        <button
          type="button"
          onClick={copyToClipboard}
          disabled={pending}
          aria-label="Copy link"
          title={pending ? "Working..." : "Copy link"}
          className={pending ? "opacity-60 cursor-not-allowed" : ""}
        >
          <img loading="lazy" src={icon.bodyShare} alt="Copy link" />
        </button>
      </div>
    </div>
  );
}
