"use client";

import type { Market } from "@/lib/types";

const MARKETS: { value: Market; label: string }[] = [
  { value: "cn", label: "A 股" },
  { value: "us", label: "美股" },
  { value: "hk", label: "港股" },
];

export function MarketTabs({
  active,
  onChange,
}: {
  active: Market;
  onChange: (market: Market) => void;
}) {
  return (
    <div className="flex border-b border-gray-200 bg-white px-6">
      {MARKETS.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`px-5 py-2.5 text-sm transition-colors border-b-2 ${
            active === m.value
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
