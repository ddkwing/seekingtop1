import type { Stock } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/format";

interface MetricDef {
  label: string;
  key: keyof Stock;
  format: "number" | "percent" | "integer";
}

const METRIC_SECTIONS: { title: string; metrics: MetricDef[] }[] = [
  {
    title: "估值指标",
    metrics: [
      { label: "市盈率 PE", key: "pe", format: "number" },
      { label: "市净率 PB", key: "pb", format: "number" },
      { label: "PE×PB", key: "pePbProduct", format: "number" },
      { label: "市销率 PS", key: "ps", format: "number" },
      { label: "EV/EBITDA", key: "evToEbitda", format: "number" },
      { label: "PEG", key: "peg", format: "number" },
    ],
  },
  {
    title: "盈利能力",
    metrics: [
      { label: "ROE", key: "roe", format: "percent" },
      { label: "ROA", key: "roa", format: "percent" },
      { label: "ROIC", key: "roic", format: "percent" },
      { label: "毛利率", key: "grossMargin", format: "percent" },
      { label: "净利率", key: "netMargin", format: "percent" },
      { label: "F-Score", key: "fScore", format: "integer" },
    ],
  },
  {
    title: "财务健康",
    metrics: [
      { label: "资产负债率", key: "debtToEquity", format: "number" },
      { label: "流动比率", key: "currentRatio", format: "number" },
      { label: "Z-Score", key: "altmanZScore", format: "number" },
    ],
  },
  {
    title: "增长指标",
    metrics: [
      { label: "营收增长率", key: "revenueGrowth", format: "percent" },
      { label: "EPS增长率", key: "epsGrowth", format: "percent" },
    ],
  },
  {
    title: "股东回报",
    metrics: [
      { label: "股息率", key: "dividendYield", format: "percent" },
      { label: "股息支付率", key: "payoutRatio", format: "percent" },
    ],
  },
];

function formatMetric(value: unknown, format: string): string {
  if (value === null || value === undefined) return "—";
  const num = value as number;
  switch (format) {
    case "percent":
      return formatPercent(num);
    case "integer":
      return String(Math.round(num));
    default:
      return formatNumber(num, 2);
  }
}

export function MetricsGrid({ stock }: { stock: Stock }) {
  return (
    <div className="space-y-6">
      {METRIC_SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">{section.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {section.metrics.map((metric) => {
              const value = stock[metric.key];
              const isNull = value === null || value === undefined;
              return (
                <div
                  key={metric.key as string}
                  className={`bg-white border border-gray-200 rounded-lg p-3 ${
                    isNull ? "opacity-50" : ""
                  }`}
                >
                  <div className="text-[10px] text-gray-400 mb-1">{metric.label}</div>
                  <div className={`text-base font-semibold ${isNull ? "text-gray-300" : "text-gray-900"}`}>
                    {formatMetric(value, metric.format)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
