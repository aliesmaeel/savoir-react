import React, { useState, useMemo, useEffect } from "react";
import useIcons from "~/hooks/imageHooks/useIcons";
import ProjectListedByContact from "./ProjectListedByContact";
import { useLoaderData } from "react-router";

export default function ProjectDescription() {
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

  // Helper function to count words from HTML content
  const countWords = (html: string): number => {
    if (!html) return 0;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
    return words.length;
  };

  const truncateHtml = (html: string, wordLimit: number): string => {
    if (!html) return "";
    
    const wordCount = countWords(html);
    if (wordCount <= wordLimit) {
      return html;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    
    // Walk through text nodes and count words
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let wordCountSoFar = 0;
    let node: Node | null = null;
    let cutNode: Node | null = null;
    const nodesToRemove: Node[] = [];
    
    while ((node = walker.nextNode())) {
      const nodeText = node.textContent || "";
      const words = nodeText.trim().split(/\s+/).filter((word) => word.length > 0);
      const nodeWordCount = words.length;
      
      if (wordCountSoFar + nodeWordCount >= wordLimit) {
        cutNode = node;
        // Calculate how many words we need from this node
        const wordsNeeded = wordLimit - wordCountSoFar;
        
        if (wordsNeeded <= 0) {
          // We've already reached the limit, mark this node for removal
          nodesToRemove.push(node);
        } else {
          // Take only the needed words from this node
          const wordsToKeep = words.slice(0, wordsNeeded);
          
          // Find the position in the original text where these words end
          let searchPos = 0;
          let charPos = 0;
          for (let i = 0; i < wordsNeeded && i < words.length; i++) {
            const wordIndex = nodeText.indexOf(words[i], searchPos);
            if (wordIndex >= 0) {
              charPos = wordIndex + words[i].length;
              searchPos = charPos;
            }
          }
          
          // Find the last space to cut at word boundary
          const textBeforeCut = nodeText.substring(0, charPos);
          const lastSpaceIndex = textBeforeCut.lastIndexOf(" ");
          const cutPosition = lastSpaceIndex > 0 ? lastSpaceIndex : charPos;
          
          if (node.textContent) {
            node.textContent = nodeText.substring(0, cutPosition).trim() + "...";
          }
        }
        
        // Mark all remaining nodes for removal
        while ((node = walker.nextNode())) {
          nodesToRemove.push(node);
        }
        break;
      }
      
      wordCountSoFar += nodeWordCount;
    }
    
    // Remove all marked nodes
    nodesToRemove.forEach(nodeToRemove => {
      if (nodeToRemove.parentNode) {
        nodeToRemove.parentNode.removeChild(nodeToRemove);
      }
    });
    
    // Remove empty parent elements that might be left behind
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
      title: "Area",
      icon: icon.searchSquare,
      value: `${property.size?.toLocaleString()} Square Feet`,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-start gap-[53px] w-full mt-[34px]">
      <div className="flex flex-col items-start gap-[31px] w-full">
        <div className="flex flex-col items-start gap-[17px] w-full">
          <p className="text-black text-[21px]">{property.title_en}</p>
          <div className="flex flex-col items-start gap-[4px] w-full">
            <p className="text--[27px] font-semibold">Description</p>
            <div
              className="text-[#505050] text-[14px] lg:text-[18px] leading-[180%]"
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
        </div>
        <div className="flex items-start gap-[17px]">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-start gap-[4px] lg:gap-[8px] pr-[26px] lg:pr-[52px] border-r border-[#353635]"
            >
              <div className="flex items-center gap-[3px] lg:gap-[7px]">
                <img loading="lazy" src={item.icon} alt="" className="w-[12px] lg:w-[25px]" />
                <p className="text-[#505050] text-[8px] lg:text-[16px] font-medium">{item.title}</p>
              </div>
              <p className="text-[10px] lg:text-[18px] font-semibold">{item.value}</p>
            </div>
          ))}
          <div className="flex flex-col items-start gap-[3px] lg:gap-[8px]">
            <p className="text-[#505050] text-[8px] lg:text-[16px] font-medium">
              Completion Status:
            </p>
            <p className="text-[#C6A45A] text-[10px] lg:text-[18px] font-semibold">{property.completion_status}</p>
          </div>
        </div>
      </div>
      <ProjectListedByContact user={property.user} />
      {showPopup && (
        <div className="flex items-center justify-center w-full h-screen fixed top-0 left-0 z-[99999] bg-[#00000066] px-[16px]">
          <div className="w-full max-w-[759.75px] max-h-[75vh] rounded-[15.711px] lg:rounded-[37.5px] bg-white relative z-10 flex flex-col">
            <div className="flex items-center justify-between w-full px-[21px] lg:px-[40px] py-[14px] lg:py-[27px] bg-[#C6A45A33] flex-shrink-0">
              <p className="text-[15px] lg:text-[29px] font-bold">{property.title_en}</p>
              <button onClick={handleClosePopup}>
                <img loading="lazy" src={icon.popupClose} alt="" className="w-[12px] lg:w-[24px]" />
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
