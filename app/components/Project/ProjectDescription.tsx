import React, { useState, useMemo, useEffect } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import ProjectListedByContact from "./ProjectListedByContact";
import { useLoaderData } from "react-router";

export default function ProjectDescription() {
  const { property } = useLoaderData() as { property: any };
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showPopup]);

  const icon = useIcons();
  const isBrowser = typeof document !== "undefined";

  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  const countWords = (html: string): number => {
    if (!html) return 0;

    if (!isBrowser) {
      return stripHtml(html)
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const text = tempDiv.textContent || tempDiv.innerText || "";
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    return words.length;
  };

  const truncateHtml = (html: string, wordLimit: number): string => {
    if (!html) return "";

    if (!isBrowser) {
      const words = stripHtml(html)
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (words.length <= wordLimit) return stripHtml(html);

      return `${words.slice(0, wordLimit).join(" ")}...`;
    }

    const wordCount = countWords(html);

    if (wordCount <= wordLimit) {
      return html;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null
    );

    let wordCountSoFar = 0;
    let node: Node | null = null;
    const nodesToRemove: Node[] = [];

    while ((node = walker.nextNode())) {
      const nodeText = node.textContent || "";
      const words = nodeText
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      const nodeWordCount = words.length;

      if (wordCountSoFar + nodeWordCount >= wordLimit) {
        const wordsNeeded = wordLimit - wordCountSoFar;

        if (wordsNeeded <= 0) {
          nodesToRemove.push(node);
        } else {
          let searchPos = 0;
          let charPos = 0;

          for (let i = 0; i < wordsNeeded && i < words.length; i++) {
            const wordIndex = nodeText.indexOf(words[i], searchPos);

            if (wordIndex >= 0) {
              charPos = wordIndex + words[i].length;
              searchPos = charPos;
            }
          }

          const textBeforeCut = nodeText.substring(0, charPos);
          const lastSpaceIndex = textBeforeCut.lastIndexOf(" ");
          const cutPosition = lastSpaceIndex > 0 ? lastSpaceIndex : charPos;

          if (node.textContent) {
            node.textContent = nodeText.substring(0, cutPosition).trim() + "...";
          }
        }

        while ((node = walker.nextNode())) {
          nodesToRemove.push(node);
        }

        break;
      }

      wordCountSoFar += nodeWordCount;
    }

    nodesToRemove.forEach((nodeToRemove) => {
      if (nodeToRemove.parentNode) {
        nodeToRemove.parentNode.removeChild(nodeToRemove);
      }
    });

    const emptyElements = tempDiv.querySelectorAll("*");

    emptyElements.forEach((el) => {
      if (el.textContent?.trim() === "" && el.children.length === 0) {
        el.remove();
      }
    });

    return tempDiv.innerHTML;
  };

  const truncatedDescription = useMemo(() => {
    if (!property.description_en) return "";

    return truncateHtml(property.description_en, 40);
  }, [property.description_en]);

  const shouldShowReadMore = useMemo(() => {
    if (!property.description_en) return false;

    return countWords(property.description_en) > 40;
  }, [property.description_en]);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const items = [
    {
      title: "Area",
      icon: icon.searchSquare,
      value: `${property.size?.toLocaleString()} sq.ft`,
    },
    {
      title: "Bedrooms",
      icon: icon.searchBedroom,
      value: property.bedroom,
    },
    {
      title: "Bathrooms",
      icon: icon.searchBathRoom,
      value: property.bathroom,
    },
    {
      title: "Status",
      icon: icon.searchType,
      value: property.completion_status,
    },
  ];

  return (
    <div className="mt-[34px] flex w-full flex-col items-start gap-[53px] lg:flex-row">
      <div className="flex w-full flex-col items-start gap-[31px]">
        <div className="flex w-full flex-col items-start gap-[17px]">
          <p className="CormorantGaramond text-[28px] font-[900] leading-[1.08] text-[#050505] [text-shadow:0_0_0.45px_#050505] lg:text-[34px]">
            {property.title_en}
          </p>

          <div className="flex w-full flex-col items-start gap-[4px]">
            <div
              className="CormorantGaramond text-[14px] font-normal leading-[165%] tracking-[0.01em] text-[#050505] lg:text-[18px] [&_*]:!font-normal"
              style={{ textShadow: "0 0 0.22px currentColor" }}
              dangerouslySetInnerHTML={{
                __html: truncatedDescription,
              }}
            />

            {shouldShowReadMore && (
              <button
                onClick={handleOpenPopup}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenPopup();
                  }
                }}
                className="CormorantGaramond mt-[4px] text-[13px] font-normal leading-[1.2] text-[#050505] transition-opacity duration-200 hover:opacity-70 focus:outline-none lg:text-[15px]"
                style={{ textShadow: "0 0 0.16px currentColor" }}
                aria-label="Read more"
                tabIndex={0}
              >
                Read more
              </button>
            )}
          </div>
        </div>

        <div className="flex items-start gap-[17px]">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-start gap-[4px] border-r border-[#353635] pr-[6px] lg:gap-[8px] lg:pr-[6px]"
            >
              <div className="flex items-center gap-[3px] lg:gap-[7px]">
                <img
                  loading="lazy"
                  src={item.icon}
                  alt=""
                  className="w-[12px] lg:w-[25px]"
                />

                <p className="Jakarta text-[8px] font-bold text-[#111111] lg:text-[16px]">
                  {item.title} {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {property?.user && <ProjectListedByContact user={property.user} />}

      {showPopup && (
        <div className="fixed left-0 top-0 z-[99999] flex h-screen w-full items-center justify-center bg-[#00000066] px-[16px]">
          <div className="relative z-10 flex max-h-[75vh] w-full max-w-[759.75px] flex-col overflow-hidden rounded-[15.711px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.35)] lg:rounded-[37.5px]">
            <div className="flex w-full flex-shrink-0 items-center justify-between bg-[#111111] px-[21px] py-[14px] lg:px-[40px] lg:py-[27px]">
              <p className="text-[15px] font-bold text-white lg:text-[29px]">
                {property.title_en}
              </p>

              <button
                type="button"
                onClick={handleClosePopup}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70 lg:h-[38px] lg:w-[38px]"
                aria-label="Close popup"
              >
                <img
                  loading="lazy"
                  src={icon.popupClose}
                  alt=""
                  className="w-[12px] brightness-0 invert lg:w-[24px]"
                />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white px-[21px] pb-[40px] pt-[20px] lg:px-[40px] lg:pb-[60px]">
              <div
                className="CormorantGaramond text-[14px] font-normal leading-[160%] tracking-[0.01em] text-[#050505] lg:text-[18px] [&_*]:!font-normal"
                style={{ textShadow: "0 0 0.22px currentColor" }}
                dangerouslySetInnerHTML={{
                  __html: property.description_en,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}