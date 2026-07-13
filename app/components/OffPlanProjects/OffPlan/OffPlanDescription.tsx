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

  const addBreakAfterFullStop = (html: string): string => {
    if (!html) return "";
    return html.replace(/\.\s*/g, ".<br/>");
  };

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
          node.textContent = node.textContent.substring(0, remainingChars);
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
    return addBreakAfterFullStop(truncateHtml(property.description, 85));
  }, [property.description]);

  const fullDescriptionWithBreaks = useMemo(() => {
    if (!property.description) return "";
    return addBreakAfterFullStop(property.description);
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
    <div className="flex w-full flex-col items-start gap-[29px]">
      <p className="CormorantGaramond text-[28px] font-[900] leading-[1.08] text-[#050505] [text-shadow:0_0_0.45px_#050505] lg:text-[34px]">
        {property.title}
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

      {showPopup && (
        <div className="fixed left-0 top-0 z-[99999] flex h-screen w-full items-center justify-center bg-[#00000066] px-[16px]">
          <div className="relative z-10 flex max-h-[75vh] w-full max-w-[759.75px] flex-col rounded-[15.711px] bg-white lg:rounded-[37.5px]">
            <div className="flex w-full flex-shrink-0 items-center justify-between bg-[#111111] px-[21px] py-[14px] lg:px-[40px] lg:py-[27px]">
              <p className="text-[15px] font-bold text-white lg:text-[29px]">
                {property.title}
              </p>

              <button onClick={handleClosePopup}>
                <img
                  loading="lazy"
                  src={icon.popupClose}
                  alt=""
                  className="w-[12px] brightness-0 invert lg:w-[24px]"
                />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-[21px] pb-[40px] pt-[20px] lg:px-[40px] lg:pb-[60px]">
              <div
                className="CormorantGaramond text-[14px] font-normal leading-[160%] tracking-[0.01em] text-[#050505] lg:text-[18px] [&_*]:!font-normal"
                style={{ textShadow: "0 0 0.22px currentColor" }}
                dangerouslySetInnerHTML={{
                  __html: fullDescriptionWithBreaks,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}