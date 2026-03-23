"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import type { Stock, Market } from "@/lib/types";
import { formatPrice, formatChange, formatPercent, formatMarketCap, formatNumber } from "@/lib/format";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

function getPerformanceColor(value: number, isDark: boolean) {
  const isPositive = value >= 0;
  return {
    bgColor: isPositive
      ? (isDark ? "bg-green-500/10" : "bg-green-50")
      : (isDark ? "bg-red-500/10" : "bg-red-50"),
    borderColor: isPositive
      ? (isDark ? "border-green-500/30" : "border-green-200")
      : (isDark ? "border-red-500/30" : "border-red-200"),
    textColor: isPositive
      ? (isDark ? "text-green-400" : "text-green-600")
      : (isDark ? "text-red-400" : "text-red-600"),
  };
}

const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.7 },
  },
};

export function ResultsTable({
  stocks,
  total,
  market,
  loading,
  error,
  activeStrategy,
  sortField,
  sortOrder,
  onSort,
  onRetry,
}: {
  stocks: Stock[];
  total: number;
  market: Market;
  loading: boolean;
  error: string | null;
  activeStrategy: string | null;
  sortField: string | null;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onRetry: () => void;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading) return <div className="bg-background border border-border/50 rounded-2xl p-6"><TableSkeleton /></div>;
  if (stocks.length === 0) return <EmptyState />;

  const columns = [
    { key: "name", label: "股票", sortable: false },
    { key: "price", label: "价格", sortable: true },
    { key: "change", label: "涨跌", sortable: true },
    { key: "pe", label: "PE", sortable: true },
    { key: "pb", label: "PB", sortable: true },
    { key: "dividendYield", label: "股息率", sortable: true },
    { key: "marketCap", label: "市值", sortable: true },
  ];

  const gridTemplate = "minmax(200px, 2fr) repeat(6, minmax(80px, 1fr))";

  return (
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-foreground/80">筛选结果</h3>
        <span className="text-xs text-muted-foreground">
          共 <strong className="text-foreground">{total}</strong> 只股票
          {activeStrategy && <span className="ml-1 text-blue-500">· 策略已应用</span>}
        </span>
      </div>

      <div className="bg-background border border-border/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div
              className="px-6 py-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wide bg-muted/15 border-b border-border/20"
              style={{ display: "grid", gridTemplateColumns: gridTemplate, columnGap: "6px" }}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  onClick={() => col.sortable && onSort(col.key)}
                  className={`text-left ${col.sortable ? "cursor-pointer hover:text-foreground/60 select-none" : ""}`}
                >
                  {col.label}
                  {sortField === col.key && (
                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {stocks.map((stock, idx) => {
                const changeVal = stock.change ?? 0;
                const { bgColor, borderColor, textColor } = mounted
                  ? getPerformanceColor(changeVal, isDark)
                  : getPerformanceColor(changeVal, false);

                return (
                  <motion.div key={`${stock.symbol}-${stock.market}`} variants={rowVariants}>
                    <div
                      className={`px-6 py-3 cursor-pointer group transition-all duration-200 hover:bg-muted/30 ${
                        idx < stocks.length - 1 ? "border-b border-border/20" : ""
                      }`}
                      style={{ display: "grid", gridTemplateColumns: gridTemplate, columnGap: "6px" }}
                      onClick={() => router.push(`/stock/${encodeURIComponent(stock.symbol)}?market=${market}`)}
                    >
                      {/* Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center text-xs font-bold text-foreground/60 flex-shrink-0">
                          {stock.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground/90 truncate">{stock.name}</div>
                          <div className="text-xs text-muted-foreground/70">{stock.symbol}</div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center">
                        <span className="font-semibold text-foreground/90">{formatPrice(stock.price)}</span>
                      </div>

                      {/* Change */}
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${bgColor} ${borderColor} ${textColor}`}>
                          {changeVal >= 0 ? "+" : ""}{changeVal.toFixed(2)}%
                        </div>
                      </div>

                      {/* PE */}
                      <div className="flex items-center">
                        <span className="font-semibold text-foreground/90">{formatNumber(stock.pe, 1)}</span>
                      </div>

                      {/* PB */}
                      <div className="flex items-center">
                        <span className="font-semibold text-foreground/90">{formatNumber(stock.pb, 1)}</span>
                      </div>

                      {/* Dividend Yield */}
                      <div className="flex items-center">
                        <span className="font-semibold text-orange-500">{formatPercent(stock.dividendYield)}</span>
                      </div>

                      {/* Market Cap */}
                      <div className="flex items-center">
                        <span className="font-semibold text-foreground/90">{formatMarketCap(stock.marketCap, market)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
