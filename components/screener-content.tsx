"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Stock, Market, StockListResponse } from "@/lib/types";
import { getStrategyById } from "@/lib/strategies";
import type { FilterStrategy } from "@/lib/types";
import { getStrategyFiltersAsUrlParams } from "@/lib/strategies";
import { MarketTabs } from "./market-tabs";
import { FilterPanel } from "./filter-panel";
import { ResultsTable } from "./results-table";

export function ScreenerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const market = (searchParams.get("market") || "cn") as Market;
  const activeStrategy = searchParams.get("strategy");
  const sortField = searchParams.get("sort");
  const sortOrder = (searchParams.get("order") || "asc") as "asc" | "desc";

  // Get all current filter params as a flat object
  const currentFilters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (!["market", "strategy", "sort", "order"].includes(key)) {
      currentFilters[key] = value;
    }
  });

  const searchParamsString = searchParams.toString();

  const fetchStocks = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks?${searchParamsString}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data: StockListResponse = await res.json();
      setStocks(data.stocks);
      setTotal(data.total);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("数据加载失败");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [searchParamsString]);

  useEffect(() => {
    fetchStocks();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchStocks]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>, immediate = false) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      const action = () => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === "") {
            params.delete(key);
          } else {
            params.set(key, value);
          }
        }
        router.replace(`/screener?${params.toString()}`, { scroll: false });
      };

      if (immediate) {
        action();
      } else {
        debounceRef.current = setTimeout(action, 300);
      }
    },
    [searchParams, router]
  );

  const handleMarketChange = (m: Market) => {
    // Clear all filters and strategy when switching markets
    const clearParams: Record<string, string | null> = {};
    searchParams.forEach((_, key) => {
      if (key !== "market") clearParams[key] = null;
    });
    updateParams({ ...clearParams, market: m }, true);
  };

  const handleFilterChange = (urlParam: string, bound: "min" | "max", value: string) => {
    // When user manually edits filters, clear the strategy label
    updateParams({
      [`${urlParam}_${bound}`]: value || null,
      strategy: null,
    });
  };

  const handleStrategyApply = (strategyId: string) => {
    const strategy = getStrategyById(strategyId);
    if (!strategy || !strategy.available || strategy.type !== "filter") return;

    // Clear all existing filter params first
    const clearParams: Record<string, string | null> = {};
    searchParams.forEach((_, key) => {
      if (!["market", "sort", "order"].includes(key)) {
        clearParams[key] = null;
      }
    });

    // Apply strategy filters
    const strategyParams = getStrategyFiltersAsUrlParams(strategy as FilterStrategy);
    updateParams(
      {
        ...clearParams,
        strategy: strategyId,
        ...strategyParams,
      },
      true
    );
  };

  const handleClear = () => {
    const clearParams: Record<string, string | null> = {};
    searchParams.forEach((_, key) => {
      if (key !== "market") clearParams[key] = null;
    });
    updateParams(clearParams, true);
  };

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    updateParams({ sort: field, order: newOrder }, true);
  };

  return (
    <div>
      <MarketTabs active={market} onChange={handleMarketChange} />
      <div className="flex gap-4 p-4">
        <FilterPanel
          filters={currentFilters}
          activeStrategy={activeStrategy}
          onFilterChange={handleFilterChange}
          onStrategyApply={handleStrategyApply}
          onClear={handleClear}
        />
        <ResultsTable
          stocks={stocks}
          total={total}
          market={market}
          loading={loading}
          error={error}
          activeStrategy={activeStrategy}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRetry={fetchStocks}
        />
      </div>
    </div>
  );
}
