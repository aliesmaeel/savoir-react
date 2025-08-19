import React from "react";
import useArrow from "~/hooks/imageHooks/useArrow";
import useIcons from "~/hooks/imageHooks/useIcons";

type ButtonProps = {
  type?: "primary" | "red" | "login" | "yellow" | "gray" | "back" | "blue" | "pink"; // Expandable for more types later
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

  if (type === "red") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-[8px] px-[25px] py-[10px] rounded-[6px] text-[#350613] text-[16px] font-SemiBold  bg-[#F71756] hover:bg-[#C61245] ${className}`}
      >
        {children}
      </button>
    );
  }

  if (type === "gray") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-[8px] px-[25px] py-[10px] rounded-[6px] text-[#FFFFFFCC] text-[16px] font-SemiBold cursor-pointer bg-[#FFFFFF1A] ${className}`}
      >
        {children}
      </button>
    );
  }

  if (type === "blue") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-[6px] px-[25px] py-[12px] rounded-[4px] text-[#8EC9ED] hover:text-[#1F2D35] text-[16px] font-SemiBold cursor-pointer bg-[#8EC9ED26] hover:bg-[#8EC9ED] ${className}`}
      >
        {children}
      </button>
    );
  }

  if (type === "pink") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-[6px] px-[25px] py-[12px] rounded-[4px] text-[#BC5AD7] hover:text-[#33183A] text-[16px] font-SemiBold cursor-pointer bg-[#BC5AD726] hover:bg-[#BC5AD7] ${className}`}
      >
        {children}
      </button>
    );
  }

  return null;
};

export default Button;
