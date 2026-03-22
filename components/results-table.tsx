"use client";

import { useRouter } from "next/navigation";
import type { Stock, Market } from "@/lib/types";
import { formatPrice, formatChange, formatPercent, formatMarketCap, formatNumber } from "@/lib/format";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

interface Column {
  key: string;
  label: string;
  render: (stock: Stock, market: Market) => React.ReactNode;
}

const BASE_COLUMNS: Column[] = [
  {
    key: "name",
    label: "股票",
    render: (s) => (
      <div>
        <div className="font-semibold text-gray-900">{s.name}</div>
        <div className="text-[10px] text-gray-400">{s.symbol}</div>
      </div>
    ),
  },
  {
    key: "price",
    label: "价格",
    render: (s) => formatPrice(s.price),
  },
  {
    key: "change",
    label: "涨跌",
    render: (s) => {
      const { text, color } = formatChange(s.change);
      return <span className={color}>{text}</span>;
    },
  },
  { key: "pe", label: "PE", render: (s) => formatNumber(s.pe, 1) },
  { key: "pb", label: "PB", render: (s) => formatNumber(s.pb, 1) },
  { key: "dividendYield", label: "股息率", render: (s) => formatPercent(s.dividendYield) },
  {
    key: "marketCap",
    label: "市值",
    render: (s, m) => formatMarketCap(s.marketCap, m),
  },
];

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

  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading) return <div className="bg-white border border-gray-200 rounded-lg p-6"><TableSkeleton /></div>;
  if (stocks.length === 0) return <EmptyState />;

  const columns = BASE_COLUMNS;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">筛选结果</h3>
        <span className="text-xs text-gray-400">
          共 <strong className="text-gray-600">{total}</strong> 只股票
          {activeStrategy && <span className="ml-1 text-blue-500">· 策略已应用</span>}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 cursor-pointer hover:text-gray-700 select-none"
                >
                  {col.label}
                  {sortField === col.key && (
                    <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr
                key={`${stock.symbol}-${stock.market}`}
                onClick={() => router.push(`/stock/${encodeURIComponent(stock.symbol)}?market=${market}`)}
                className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30 cursor-pointer transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-3 text-xs text-gray-700">
                    {col.render(stock, market)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
