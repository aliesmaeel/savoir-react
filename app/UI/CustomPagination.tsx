import React from "react";
import useIcons from "~/hooks/imageHooks/useIcons";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
};

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = totalPages > 5 ? Math.ceil(totalPages /5) : 5,
}: Props) {
 
  const icon = useIcons();

  const half = Math.floor(maxVisible / 2);
  
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
    end = Math.min(totalPages, start + maxVisible - 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-[10px] mt-6 mr-auto ml-auto">
      <button
        type="button"
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className="flex items-center w-[140px] h-[40px] justify-center cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
        aria-label="Previous page"
        tabIndex={0}
      >
        <img loading="lazy" src={icon.propertiesPrev} alt="Previous" />
      </button>
      
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`flex items-center  justify-center min-w-[40px] h-[40px] px-3 py-1 rounded-[10.5px] text-[16px] font-semibold transition-all duration-200 ${
            p === currentPage
              ? "bg-[#C6A45A] text-white"
              : "border border-[#C6A45A] text-[#353635] hover:bg-[#C6A45A] hover:text-white"
          }`}
          aria-label={`Go to page ${p}`}
          tabIndex={0}
        >
          {p}
        </button>
      ))}
      
      <button
        type="button"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className="flex items-center w-[140px] h-[40px] justify-center cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
        aria-label="Next page"
        tabIndex={0}
      >
        <img loading="lazy" src={icon.propertiesNext} alt="Next" />
      </button>
    </div>
  );
}
