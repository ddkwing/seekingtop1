"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Stock, Market } from "@/lib/types";
import { formatPrice, formatChange, formatMarketCap } from "@/lib/format";
import { MetricsGrid } from "@/components/metrics-grid";
import { StrategyTags } from "@/components/strategy-tags";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

export default function StockDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const symbol = params.symbol as string;
  const market = (searchParams.get("market") || "cn") as Market;

  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}?market=${market}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setStock(data);
    } catch {
      setError("股票数据加载失败");
    } finally {
      setLoading(false);
    }
  }, [symbol, market]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-6">
        <ErrorState message={error || "股票未找到"} onRetry={fetchStock} />
      </div>
    );
  }

  const { text: changeText, color: changeColor } = formatChange(stock.change);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <Link
        href={`/screener?market=${market}`}
        className="text-xs text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← 返回筛选结果
      </Link>

      {/* Header */}
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-xl font-bold text-gray-900">{stock.name}</h1>
        <span className="text-sm text-gray-400">
          {stock.symbol} · {stock.industry || "—"}
        </span>
        <div className="ml-auto text-right">
          <div className="text-xl font-bold text-gray-900">
            {market === "us" ? "$" : market === "hk" ? "HK$" : "¥"}
            {formatPrice(stock.price)}
          </div>
          <div className={`text-sm ${changeColor}`}>{changeText}</div>
        </div>
      </div>

      {/* Market cap */}
      <div className="text-xs text-gray-400 mb-6">
        总市值: {formatMarketCap(stock.marketCap, market)}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white border border-gray-200 rounded-lg h-[200px] flex items-center justify-center text-gray-300 mb-8">
        价格走势图（敬请期待）
      </div>

      {/* Strategy tags */}
      <div className="mb-8">
        <StrategyTags stock={stock} />
      </div>

      {/* Metrics grid */}
      <MetricsGrid stock={stock} />
    </div>
  );
}
