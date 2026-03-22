import type { Strategy, FilterStrategy, Stock } from "./types";

export const STRATEGIES: Strategy[] = [
  // === AVAILABLE STRATEGIES ===
  {
    type: "filter",
    id: "graham",
    name: "格雷厄姆防御型",
    master: "本杰明·格雷厄姆",
    description: "极度保守，要求极高的安全边际，买入静态估值极低且财务绝对安全的资产。",
    critique:
      "在轻资产、科技主导的经济中，符合标准的往往是重资产或夕阳产业，容易陷入「价值陷阱」。",
    available: true,
    filters: {
      pe: [0, 15],
      pb: [0, 1.5],
      pePbProduct: [0, 22.5],
      dividendYield: [0.01, null],
    },
  },
  {
    type: "filter",
    id: "high-dividend",
    name: "高股息蓝筹",
    master: "经典策略",
    description: "选取高股息率的大市值蓝筹股，追求稳定的现金回报。",
    critique:
      "高股息可能意味着公司缺乏成长性投资机会，或者股息不可持续。需关注派息率和盈利稳定性。",
    available: true,
    filters: {
      dividendYield: [4, null],
      marketCap: [50_000_000_000, null], // 500亿 CNY / 50B
    },
  },
  {
    type: "filter",
    id: "deep-value",
    name: "低估值精选",
    master: "经典策略",
    description: "寻找 PE 和 PB 均极低且有股息回报的深度价值股。",
    critique:
      "极低估值可能反映市场对公司前景的悲观预期。需结合行业趋势判断是否为价值陷阱。",
    available: true,
    filters: {
      pe: [0, 10],
      pb: [0, 1.0],
      dividendYield: [2, null],
    },
  },

  // === UNAVAILABLE STRATEGIES (data source TBD) ===
  {
    type: "rank",
    id: "magic-formula",
    name: "神奇公式",
    master: "乔尔·格林布拉特",
    description: "以低于市场平均的价格，买入资本运作效率远高于市场平均水平的企业。",
    critique:
      "纯量化模型，高 ROIC 若无护城河保护，竞争者将侵蚀利润率。不考虑成长性和行业周期。",
    available: false,
    preFilters: { marketCap: [50_000_000, null] },
    rankFields: [
      { field: "roic", order: "desc" },
      { field: "earningsYield", order: "desc" },
    ],
    rankMethod: "sum",
    topN: 30,
  },
  {
    type: "filter",
    id: "buffett-moat",
    name: "巴菲特护城河",
    master: "沃伦·巴菲特",
    description: "寻找具有持续竞争优势、优秀管理层、不需大量资本就能维持增长的企业。",
    critique:
      "好公司的特征在报表上一目了然，市场极少给出便宜价格。支付过高溢价可能吞噬多年增长。",
    available: false,
    filters: {
      roe: [15, null],
      roic: [15, null],
      grossMargin: [40, null],
      debtToEquity: [null, 0.5],
      peg: [null, 1.5],
    },
  },
  {
    type: "filter",
    id: "piotroski",
    name: "皮奥特罗斯基 F-Score",
    master: "约瑟夫·皮奥特罗斯基",
    description: "低 PB 公司如果底层财务正在改善，市场价格往往滞后，存在巨大向上修正空间。",
    critique:
      "反人性策略，入选的往往有负面新闻。高度依赖统计概率，集中持仓单只风险极高。",
    available: false,
    filters: {
      fScore: [7, 9],
      altmanZScore: [2.99, null],
    },
  },
];

export function getStrategyById(id: string): Strategy | undefined {
  return STRATEGIES.find((s) => s.id === id);
}

export function getAvailableStrategies(): Strategy[] {
  return STRATEGIES.filter((s) => s.available);
}

export function getStrategyFiltersAsUrlParams(
  strategy: FilterStrategy
): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [field, [min, max]] of Object.entries(strategy.filters)) {
    if (min !== null) params[`${field}_min`] = String(min);
    if (max !== null) params[`${field}_max`] = String(max);
  }
  return params;
}

export function matchesStrategy(stock: Stock, strategy: FilterStrategy): boolean {
  for (const [field, [min, max]] of Object.entries(strategy.filters)) {
    const value = stock[field as keyof Stock] as number | null;
    if (value === null || value === undefined) return false;
    if (min !== null && value < min) return false;
    if (max !== null && value > max) return false;
  }
  return true;
}
