import { pgTable, varchar, real, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const stocks = pgTable("stocks", {
  // Primary key: symbol + market
  symbol: varchar("symbol", { length: 20 }).notNull(),
  market: varchar("market", { length: 4 }).notNull(), // "cn" | "us" | "hk"

  // Basic info
  name: varchar("name", { length: 100 }).notNull(),
  industry: varchar("industry", { length: 100 }),

  // Price data (Longbridge available)
  price: real("price"),
  change: real("change"), // daily change %

  // Valuation (Longbridge available)
  pe: real("pe"),
  pb: real("pb"),
  pePbProduct: real("pe_pb_product"), // PE × PB, computed
  eps: real("eps"),
  bps: real("bps"), // book value per share

  // Shareholder returns (Longbridge available)
  dividendYield: real("dividend_yield"),

  // Market (Longbridge available)
  marketCap: real("market_cap"), // in native currency

  // === RESERVED: Deep fundamentals (nullable, future data source) ===

  // Valuation (reserved)
  ps: real("ps"),
  evToEbitda: real("ev_to_ebitda"),
  peg: real("peg"),
  earningsYield: real("earnings_yield"),

  // Profitability (reserved)
  roe: real("roe"),
  roa: real("roa"),
  roic: real("roic"),
  grossMargin: real("gross_margin"),
  netMargin: real("net_margin"),

  // Financial health (reserved)
  debtToEquity: real("debt_to_equity"),
  currentRatio: real("current_ratio"),
  interestCoverage: real("interest_coverage"),
  altmanZScore: real("altman_z_score"),

  // Growth (reserved)
  revenueGrowth: real("revenue_growth"),
  epsGrowth: real("eps_growth"),
  profitGrowth: real("profit_growth"),

  // Scores (reserved)
  fScore: integer("f_score"),
  payoutRatio: real("payout_ratio"),

  // Metadata
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.symbol, table.market] }),
]);

export type StockRecord = typeof stocks.$inferSelect;
export type NewStockRecord = typeof stocks.$inferInsert;
