export type Market = "cn" | "us" | "hk";

export interface Stock {
  symbol: string;
  market: Market;
  name: string;
  industry: string | null;
  price: number | null;
  change: number | null;
  // Valuation (available)
  pe: number | null;
  pb: number | null;
  pePbProduct: number | null;
  eps: number | null;
  bps: number | null;
  // Shareholder returns (available)
  dividendYield: number | null;
  // Market (available)
  marketCap: number | null;
  // Valuation (reserved)
  ps: number | null;
  evToEbitda: number | null;
  peg: number | null;
  earningsYield: number | null;
  // Profitability (reserved)
  roe: number | null;
  roa: number | null;
  roic: number | null;
  grossMargin: number | null;
  netMargin: number | null;
  // Financial health (reserved)
  debtToEquity: number | null;
  currentRatio: number | null;
  interestCoverage: number | null;
  altmanZScore: number | null;
  // Growth (reserved)
  revenueGrowth: number | null;
  epsGrowth: number | null;
  profitGrowth: number | null;
  // Scores (reserved)
  fScore: number | null;
  payoutRatio: number | null;
  // Metadata
  updatedAt: string;
}

export interface StockListResponse {
  stocks: Stock[];
  total: number;
  market: Market;
}

export type FilterStrategy = {
  type: "filter";
  id: string;
  name: string;
  master: string;
  description: string;
  critique: string;
  available: boolean;
  markets?: Market[];
  filters: Record<string, [number | null, number | null]>;
};

export type RankStrategy = {
  type: "rank";
  id: string;
  name: string;
  master: string;
  description: string;
  critique: string;
  available: boolean;
  markets?: Market[];
  preFilters?: Record<string, [number | null, number | null]>;
  rankFields: { field: string; order: "asc" | "desc" }[];
  rankMethod: "sum";
  topN: number;
};

export type Strategy = FilterStrategy | RankStrategy;

export type FilterFieldCategory =
  | "valuation"
  | "profitability"
  | "health"
  | "growth"
  | "shareholder"
  | "basic";

export interface FilterFieldDef {
  key: keyof Stock;
  label: string;
  category: FilterFieldCategory;
  urlParam: string;
  available: boolean;
}

// Single source of truth for all filterable fields
export const FILTER_FIELDS: FilterFieldDef[] = [
  // Valuation (available)
  { key: "pe", label: "市盈率 PE", category: "valuation", urlParam: "pe", available: true },
  { key: "pb", label: "市净率 PB", category: "valuation", urlParam: "pb", available: true },
  { key: "pePbProduct", label: "PE×PB", category: "valuation", urlParam: "pe_pb", available: true },
  // Valuation (reserved)
  { key: "ps", label: "市销率 PS", category: "valuation", urlParam: "ps", available: false },
  { key: "evToEbitda", label: "EV/EBITDA", category: "valuation", urlParam: "ev_ebitda", available: false },
  { key: "peg", label: "PEG", category: "valuation", urlParam: "peg", available: false },
  // Profitability (reserved)
  { key: "roe", label: "净资产收益率 ROE", category: "profitability", urlParam: "roe", available: false },
  { key: "roa", label: "总资产收益率 ROA", category: "profitability", urlParam: "roa", available: false },
  { key: "roic", label: "投入资本回报率 ROIC", category: "profitability", urlParam: "roic", available: false },
  { key: "grossMargin", label: "毛利率", category: "profitability", urlParam: "gross_margin", available: false },
  { key: "netMargin", label: "净利率", category: "profitability", urlParam: "net_margin", available: false },
  // Financial health (reserved)
  { key: "debtToEquity", label: "资产负债率", category: "health", urlParam: "debt_equity", available: false },
  { key: "currentRatio", label: "流动比率", category: "health", urlParam: "current_ratio", available: false },
  { key: "altmanZScore", label: "Altman Z-Score", category: "health", urlParam: "z_score", available: false },
  // Growth (reserved)
  { key: "revenueGrowth", label: "营收增长率", category: "growth", urlParam: "rev_growth", available: false },
  { key: "epsGrowth", label: "EPS增长率", category: "growth", urlParam: "eps_growth", available: false },
  { key: "profitGrowth", label: "净利润增长率", category: "growth", urlParam: "profit_growth", available: false },
  // Shareholder returns (available)
  { key: "dividendYield", label: "股息率", category: "shareholder", urlParam: "div_yield", available: true },
  { key: "payoutRatio", label: "股息支付率", category: "shareholder", urlParam: "payout", available: false },
  // Basic (available)
  { key: "marketCap", label: "市值", category: "basic", urlParam: "mcap", available: true },
  { key: "eps", label: "每股收益 EPS", category: "basic", urlParam: "eps", available: true },
  { key: "bps", label: "每股净资产 BPS", category: "basic", urlParam: "bps", available: true },
];

export const CATEGORY_LABELS: Record<FilterFieldCategory, string> = {
  valuation: "估值指标",
  profitability: "盈利能力",
  health: "财务健康",
  growth: "增长指标",
  shareholder: "股东回报",
  basic: "基础筛选",
};

// Categories that should be expanded by default in the filter panel
export const DEFAULT_EXPANDED_CATEGORIES: FilterFieldCategory[] = [
  "valuation",
  "shareholder",
  "basic",
];
