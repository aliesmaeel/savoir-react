import React from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

type ButtonProps = {
  type?: "primary" | "border" | "white" | "transparent"; // Expandable for more types later
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  type = "primary",
  className = "",
  children,
  onClick,
  disabled = false,
}) => {
  const icon = useIcons();
  const arrow = useArrow();

  if (type === "primary") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-[3.5px] px-[24.88px] py-[9.7px] rounded-[10.5px] text-white text-[16px] font-semibold ${className}`}
        style={{
          background: !disabled
            ? "linear-gradient(94deg, #C6A45A 3.17%, rgba(255, 255, 255, 0.60) 224.54%)"
            : "",
        }}
      >
        {children}
      </button>
    );
  }

  if (type === "border") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-[3.5px] px-[24.88px] py-[9.7px] rounded-[10.5px] text-[#353635] text-[16px] font-semibold border border-[#C6A45A] ${className}`}
      >
        {children}
      </button>
    );
  }

  if (type === "white") {
    return (
      <a
        href="#current-vacancies"
        className={`flex items-center justify-center gap-[3.5px] px-[20px] lg:px-[93px] py-[18px] rounded-[10.5px] text-[#C6A45A] text-[24px] font-semibold bg-[#FFFFFF] ${className}`}
      >
        {children}
      </a>
    );
  }

  if (type === "transparent") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-[3.5px] px-[20px] lg:px-[93px] py-[18px] rounded-[10.5px] text-white text-[24px]  bg-[#FFFFFF40] backdrop-blur-[10px] ${className}`}
      >
        {children}
      </button>
    );
  }

  return null;
};

export default Button;
