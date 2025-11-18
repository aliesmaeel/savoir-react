import React, { useState, useMemo, useEffect } from "react";
import { useLoaderData } from "react-router";
import useIcons from "~/hooks/imageHooks/useIcons";

export default function OffPlanDescription() {
  const { property } = useLoaderData() as { property: any };
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      // disable scrolling
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        // re-enable scrolling on unmount
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showPopup]);

  const icon = useIcons();

  const truncateHtml = (html: string, wordLimit: number): string => {
    if (!html) return "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0);

    if (words.length <= wordLimit) {
      return html;
    }

    // Get the first 85 words
    const truncatedWords = words.slice(0, wordLimit);
    const truncatedText = truncatedWords.join(" ");

    // Find the position in the original text where we should cut
    const textBeforeTruncation = text.substring(
      0,
      text.indexOf(truncatedText) + truncatedText.length
    );

    // Try to find a good breaking point (end of sentence or word boundary)
    let cutPosition = textBeforeTruncation.length;
    const lastChar = textBeforeTruncation[cutPosition - 1];

    // If we're in the middle of a word, try to find the end of the last complete word
    if (lastChar && lastChar.match(/\w/)) {
      const lastSpaceIndex = textBeforeTruncation.lastIndexOf(" ");
      if (lastSpaceIndex > 0) {
        cutPosition = lastSpaceIndex;
      }
    }

    // Create a temporary element to find where to cut in HTML
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentTextLength = 0;
    let node: Node | null = null;

    while ((node = walker.nextNode())) {
      const nodeText = node.textContent || "";
      const nextLength = currentTextLength + nodeText.length;

      if (nextLength >= cutPosition) {
        // We found the node where we need to cut
        const remainingChars = cutPosition - currentTextLength;
        if (remainingChars > 0 && node.textContent) {
          node.textContent = node.textContent.substring(0, remainingChars) + "...";
        }
        // Remove all following nodes
        let nextNode: Node | null = node.nextSibling;
        while (nextNode) {
          const toRemove = nextNode;
          nextNode = nextNode.nextSibling;
          toRemove.parentNode?.removeChild(toRemove);
        }
        break;
      }

      currentTextLength = nextLength;
    }

    return tempDiv.innerHTML;
  };

  const truncatedDescription = useMemo(() => {
    if (!property.description) return "";
    return truncateHtml(property.description, 85);
  }, [property.description]);

  const shouldShowReadMore = useMemo(() => {
    if (!property.description) return false;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = property.description;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const words = text.trim().split(/\s+/);
    return words.length > 85;
  }, [property.description]);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col items-start gap-[29px] w-full">
      <p className="text-[#C6A45A] text-[27px] font-semibold">{property.title}</p>
      <div className="flex flex-col items-start gap-[4px] w-full">
        <p className="text-[27px] font-semibold">Description</p>
        <div
          className="text-[#505050] text-[18px] leading-[180%]"
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
            className="text-[#C6A45A] text-[14px] lg:text-[18px] font-medium mt-[8px] hover:underline focus:outline-none focus:underline"
            aria-label="Read more"
            tabIndex={0}
          >
            Read more
          </button>
        )}
      </div>
      {showPopup && (
        <div className="flex items-center justify-center w-full h-screen fixed top-0 left-0 z-[99999] bg-[#00000066] px-[16px]">
          <div className="w-full max-w-[759.75px] max-h-[75vh] rounded-[15.711px] lg:rounded-[37.5px] bg-white relative z-10 flex flex-col">
            <div className="flex items-center justify-between w-full px-[21px] lg:px-[40px] py-[14px] lg:py-[27px] bg-[#C6A45A33] flex-shrink-0">
              <p className="text-[15px] lg:text-[29px] font-bold">{property.title}</p>
              <button onClick={handleClosePopup}>
                <img
                  loading="lazy"
                  src={icon.popupClose}
                  alt=""
                  className="w-[12px] lg:w-[24px]"
                />
              </button>
            </div>
            <img
              loading="lazy"
              src={icon.popupPaterrn}
              alt=""
              className="absolute bottom-0 right-0 z-[-1] w-[187px] lg:w-[358px]"
            />
            <div className="overflow-y-auto flex-1 px-[21px] lg:px-[40px] pb-[40px] lg:pb-[60px] pt-[20px]">
              <div
                className="text-[#505050] text-[14px] lg:text-[18px] leading-[180%]"
                dangerouslySetInnerHTML={{
                  __html: property.description,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
