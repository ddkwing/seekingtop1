import type { Market } from "./types";

export function formatMarketCap(value: number | null, market: Market): string {
  if (value === null || value === undefined) return "—";

  if (market === "cn" || market === "hk") {
    // Chinese/HK: use 亿 (100 million)
    const yi = value / 100_000_000;
    if (yi >= 10000) return `${(yi / 10000).toFixed(1)}万亿`;
    if (yi >= 1) return `${yi.toFixed(0)}亿`;
    return `${(value / 10000).toFixed(0)}万`;
  }

  // US: use B/M
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1)}T`;
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  return `${(value / 1000).toFixed(0)}K`;
}

export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number | null, decimals: number = 2): string {
  if (value === null || value === undefined) return "—";
  return value.toFixed(decimals);
}

export function formatPrice(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatChange(value: number | null): {
  text: string;
  color: string;
} {
  if (value === null || value === undefined)
    return { text: "—", color: "text-gray-400" };
  const prefix = value > 0 ? "+" : "";
  return {
    text: `${prefix}${value.toFixed(2)}%`,
    color: value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-500",
  };
}
