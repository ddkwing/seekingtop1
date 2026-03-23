import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stocks } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const market = request.nextUrl.searchParams.get("market") || "cn";

    const result = await db
      .select()
      .from(stocks)
      .where(and(eq(stocks.symbol, symbol), eq(stocks.market, market)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Stock not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Stock detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock" },
      { status: 500 }
    );
  }
}
