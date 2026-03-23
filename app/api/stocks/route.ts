import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stocks } from "@/db/schema";
import { parseUrlParams, buildWhereClause, buildOrderBy } from "@/lib/filters";
import { getStrategyById } from "@/lib/strategies";
import type { FilterStrategy } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { market, strategy, sort, order, limit, filters } =
      parseUrlParams(searchParams);

    // If a strategy is specified and it's a filter strategy, merge its filters
    let activeFilters = { ...filters };
    if (strategy) {
      const strat = getStrategyById(strategy);
      if (strat && strat.available && strat.type === "filter") {
        // Strategy filters are the base; user overrides take precedence
        const stratFilters = (strat as FilterStrategy).filters;
        for (const [key, value] of Object.entries(stratFilters)) {
          if (!activeFilters[key]) {
            activeFilters[key] = value;
          }
        }
      }
    }

    const whereClause = buildWhereClause(market, activeFilters);
    const orderByClause = buildOrderBy(sort, order);

    const results = await db
      .select()
      .from(stocks)
      .where(whereClause)
      .orderBy(...orderByClause)
      .limit(limit);

    return NextResponse.json({
      stocks: results,
      total: results.length,
      market,
    });
  } catch (error) {
    console.error("Stock API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}
