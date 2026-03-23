import type { Stock, FilterStrategy } from "@/lib/types";
import { STRATEGIES, matchesStrategy } from "@/lib/strategies";

export function StrategyTags({ stock }: { stock: Stock }) {
  const filterStrategies = STRATEGIES.filter(
    (s) => s.type === "filter" && s.available
  ) as FilterStrategy[];

  const matched = filterStrategies.filter((s) => matchesStrategy(stock, s));

  if (matched.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-3">符合的策略</h3>
      <div className="flex flex-wrap gap-2">
        {matched.map((s) => (
          <span
            key={s.id}
            className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200"
          >
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
