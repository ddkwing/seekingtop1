"use client";

import { FILTER_FIELDS, CATEGORY_LABELS, DEFAULT_EXPANDED_CATEGORIES, type FilterFieldCategory } from "@/lib/types";
import { getAvailableStrategies } from "@/lib/strategies";
import { FilterSection } from "./filter-section";
import { FilterRangeInput } from "./filter-range-input";

// Group fields by category
const fieldsByCategory = FILTER_FIELDS.reduce(
  (acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  },
  {} as Record<FilterFieldCategory, typeof FILTER_FIELDS>
);

const CATEGORY_ORDER: FilterFieldCategory[] = [
  "valuation",
  "shareholder",
  "basic",
  "profitability",
  "health",
  "growth",
];

export function FilterPanel({
  filters,
  activeStrategy,
  onFilterChange,
  onStrategyApply,
  onClear,
}: {
  filters: Record<string, string>;
  activeStrategy: string | null;
  onFilterChange: (urlParam: string, bound: "min" | "max", value: string) => void;
  onStrategyApply: (strategyId: string) => void;
  onClear: () => void;
}) {
  const availableStrategies = getAvailableStrategies();

  return (
    <div className="w-[280px] flex-shrink-0 overflow-y-auto max-h-[calc(100vh-120px)]">
      {/* Strategy quick buttons */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
        <h4 className="text-xs font-semibold text-gray-600 mb-3">快速应用策略</h4>
        <div className="space-y-2">
          {availableStrategies.map((s) => (
            <button
              key={s.id}
              onClick={() => onStrategyApply(s.id)}
              className={`w-full px-3 py-2 text-xs rounded-lg transition-colors ${
                activeStrategy === s.id
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <button
          onClick={onClear}
          className="w-full mt-2 px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          清除所有条件
        </button>
      </div>

      {/* Filter sections by category */}
      {CATEGORY_ORDER.map((category) => {
        const fields = fieldsByCategory[category];
        if (!fields) return null;

        const hasAvailableFields = fields.some((f) => f.available);
        const allDisabled = !hasAvailableFields;

        return (
          <FilterSection
            key={category}
            title={CATEGORY_LABELS[category]}
            defaultExpanded={DEFAULT_EXPANDED_CATEGORIES.includes(category)}
            disabled={allDisabled}
          >
            {fields.map((field) => (
              <FilterRangeInput
                key={field.key as string}
                label={field.label}
                minValue={filters[`${field.urlParam}_min`] || ""}
                maxValue={filters[`${field.urlParam}_max`] || ""}
                onMinChange={(v) => onFilterChange(field.urlParam, "min", v)}
                onMaxChange={(v) => onFilterChange(field.urlParam, "max", v)}
                disabled={!field.available}
              />
            ))}
          </FilterSection>
        );
      })}
    </div>
  );
}
