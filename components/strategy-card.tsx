"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Strategy, FilterStrategy } from "@/lib/types";
import { getStrategyFiltersAsUrlParams } from "@/lib/strategies";

export function StrategyCard({ strategy }: { strategy: Strategy }) {
  const router = useRouter();
  const [showCritique, setShowCritique] = useState(false);

  const handleClick = () => {
    if (!strategy.available) return;

    if (strategy.type === "filter") {
      const params = getStrategyFiltersAsUrlParams(strategy as FilterStrategy);
      const searchParams = new URLSearchParams({
        strategy: strategy.id,
        market: "cn",
        ...params,
      });
      router.push(`/screener?${searchParams.toString()}`);
    }
  };

  const filterEntries =
    strategy.type === "filter"
      ? Object.entries(strategy.filters)
      : strategy.type === "rank" && strategy.preFilters
        ? Object.entries(strategy.preFilters)
        : [];

  return (
    <div
      onClick={handleClick}
      className={`border border-gray-200 rounded-lg p-5 bg-white transition-all ${
        strategy.available
          ? "cursor-pointer hover:border-blue-400 hover:shadow-sm"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900">{strategy.name}</h3>
        {!strategy.available && (
          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full whitespace-nowrap">
            即将支持
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-2">{strategy.master}</p>
      <p className="text-xs text-gray-600 leading-relaxed mb-3">
        {strategy.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {filterEntries.slice(0, 4).map(([key, [min, max]]) => (
          <span
            key={key}
            className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
          >
            {key} {min !== null ? `≥${min}` : ""} {max !== null ? `≤${max}` : ""}
          </span>
        ))}
        {strategy.type === "rank" && (
          <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
            排名策略 Top{strategy.topN}
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowCritique(!showCritique);
        }}
        className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1"
      >
        <svg
          className={`w-3 h-3 transition-transform ${showCritique ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        批判性思考
      </button>
      {showCritique && (
        <p className="text-[10px] text-amber-700 bg-amber-50 rounded p-2 mt-2 leading-relaxed">
          {strategy.critique}
        </p>
      )}
    </div>
  );
}
