import { and, gte, lte, eq, desc, asc, type SQL } from "drizzle-orm";
import { stocks } from "@/db/schema";
import { FILTER_FIELDS } from "./types";

type StocksColumns = typeof stocks.$inferSelect;

// Map URL param names to Drizzle column references
const COLUMN_MAP: Record<string, keyof typeof stocks> = {};
for (const field of FILTER_FIELDS) {
  COLUMN_MAP[field.urlParam] = field.key as keyof typeof stocks;
}

// Also map direct field names (for strategy filters that use camelCase keys)
for (const field of FILTER_FIELDS) {
  COLUMN_MAP[field.key as string] = field.key as keyof typeof stocks;
}

export function parseUrlParams(searchParams: URLSearchParams): {
  market: string;
  strategy: string | null;
  sort: string | null;
  order: "asc" | "desc";
  limit: number;
  filters: Record<string, [number | null, number | null]>;
} {
  const market = searchParams.get("market") || "cn";
  const strategy = searchParams.get("strategy");
  const sort = searchParams.get("sort");
  const order = (searchParams.get("order") || "asc") as "asc" | "desc";
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);

  const filters: Record<string, [number | null, number | null]> = {};

  for (const [key, value] of searchParams.entries()) {
    const minMatch = key.match(/^(.+)_min$/);
    const maxMatch = key.match(/^(.+)_max$/);

    if (minMatch) {
      const field = minMatch[1];
      if (!filters[field]) filters[field] = [null, null];
      filters[field][0] = parseFloat(value);
    } else if (maxMatch) {
      const field = maxMatch[1];
      if (!filters[field]) filters[field] = [null, null];
      filters[field][1] = parseFloat(value);
    }
  }

  return { market, strategy, sort, order, limit, filters };
}

export function buildWhereClause(
  market: string,
  filters: Record<string, [number | null, number | null]>
): SQL | undefined {
  const conditions: SQL[] = [eq(stocks.market, market)];

  for (const [field, [min, max]] of Object.entries(filters)) {
    const columnKey = COLUMN_MAP[field];
    if (!columnKey) continue;

    const column = stocks[columnKey];
    if (!column) continue;

    if (min !== null && !isNaN(min)) {
      conditions.push(gte(column as any, min));
    }
    if (max !== null && !isNaN(max)) {
      conditions.push(lte(column as any, max));
    }
  }

  return and(...conditions);
}

export function buildOrderBy(
  sortField: string | null,
  order: "asc" | "desc"
) {
  if (!sortField) return [desc(stocks.marketCap)]; // default: by market cap

  const columnKey = COLUMN_MAP[sortField] || (sortField as keyof typeof stocks);
  const column = stocks[columnKey as keyof typeof stocks];
  if (!column) return [desc(stocks.marketCap)];

  return [order === "desc" ? desc(column as any) : asc(column as any)];
}

export function filtersToUrlParams(
  filters: Record<string, [number | null, number | null]>
): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [field, [min, max]] of Object.entries(filters)) {
    if (min !== null) params[`${field}_min`] = String(min);
    if (max !== null) params[`${field}_max`] = String(max);
  }
  return params;
}
