import React from "react";

type Props = {
  id: string;
  type: "error" | "success";
  message: string;
  onClose: (id: string) => void;
  timeoutMs: number;
};

export default function Toast({ id, type, message, onClose, timeoutMs }: Props) {
  const bg = type === "error" ? "bg-red-600" : "bg-green-600";

  return (
    <div
      role="status"
      className={`${bg} text-white rounded-md shadow-lg px-4 py-3 flex items-start gap-3 w-[320px] relative overflow-hidden`}
    >
      {/* text + close */}
      <div className="flex-1 text-sm leading-5 pr-6">{message}</div>
      <button
        aria-label="Close notification"
        onClick={() => onClose(id)}
        className="ml-2 opacity-90 hover:opacity-100 absolute right-2 top-2"
      >
        ×
      </button>

      {/* timer track */}
      <div className="absolute left-0 bottom-0 h-[3px] w-full bg-white/20">
        {/* animated bar */}
        <div
          className="h-full bg-white/80"
          style={{ animation: `toastbar ${timeoutMs}ms linear forwards`, transformOrigin: "left" }}
        />
      </div>

      {/* keyframes (scoped) */}
      <style>
        {`
          @keyframes toastbar {
            from { transform: scaleX(1); }
            to   { transform: scaleX(0); }
          }
        `}
      </style>
    </div>
  );
}
