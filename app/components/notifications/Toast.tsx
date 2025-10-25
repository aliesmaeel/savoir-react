import React from "react";

type Props = {
  id: string;
  type: "error" | "success";
  message: string;
  onClose: (id: string) => void;
};

export default function Toast({ id, type, message, onClose }: Props) {
  const bg = type === "error" ? "bg-red-600" : "bg-green-600";

  return (
    <div
      role="status"
      className={`${bg} text-white rounded-md shadow-lg px-4 py-3 flex items-start gap-3 w-[320px]`}
    >
      <div className="flex-1 text-sm leading-5">{message}</div>
      <button
        aria-label="Close notification"
        onClick={() => onClose(id)}
        className="ml-2 opacity-90 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
