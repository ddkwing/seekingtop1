"use client";

import { useState, type ReactNode } from "react";

export function FilterSection({
  title,
  defaultExpanded = false,
  disabled = false,
  children,
}: {
  title: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className={`text-xs font-semibold ${disabled ? "text-gray-400" : "text-gray-600"}`}>
          {title}
          {disabled && (
            <span className="ml-2 text-[10px] font-normal text-gray-400">
              待数据接入
            </span>
          )}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}
