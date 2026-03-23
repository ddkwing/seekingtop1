import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { stocks } from "../db/schema";
import type { NewStockRecord } from "../db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const MOCK_CN: NewStockRecord[] = [
  { symbol: "600519.SH", market: "cn", name: "贵州茅台", industry: "白酒", price: 1680, change: 1.2, pe: 28.5, pb: 8.2, pePbProduct: 233.7, eps: 58.9, bps: 204.8, dividendYield: 2.8, marketCap: 2_100_000_000_000 },
  { symbol: "600036.SH", market: "cn", name: "招商银行", industry: "银行", price: 38.5, change: -0.3, pe: 6.8, pb: 0.9, pePbProduct: 6.12, eps: 5.66, bps: 42.8, dividendYield: 5.1, marketCap: 970_000_000_000 },
  { symbol: "601088.SH", market: "cn", name: "中国神华", industry: "煤炭", price: 32.8, change: 0.5, pe: 9.1, pb: 1.4, pePbProduct: 12.74, eps: 3.6, bps: 23.4, dividendYield: 6.8, marketCap: 650_000_000_000 },
  { symbol: "600900.SH", market: "cn", name: "长江电力", industry: "电力", price: 28.9, change: 0.2, pe: 14.2, pb: 1.3, pePbProduct: 18.46, eps: 2.03, bps: 22.2, dividendYield: 3.9, marketCap: 700_000_000_000 },
  { symbol: "000333.SZ", market: "cn", name: "美的集团", industry: "家电", price: 72.3, change: -0.8, pe: 11.5, pb: 1.1, pePbProduct: 12.65, eps: 6.28, bps: 65.7, dividendYield: 3.5, marketCap: 500_000_000_000 },
  { symbol: "600585.SH", market: "cn", name: "海螺水泥", industry: "建材", price: 25.1, change: -1.2, pe: 8.7, pb: 0.8, pePbProduct: 6.96, eps: 2.88, bps: 31.4, dividendYield: 4.8, marketCap: 133_000_000_000 },
  { symbol: "601398.SH", market: "cn", name: "工商银行", industry: "银行", price: 6.2, change: 0.1, pe: 5.5, pb: 0.6, pePbProduct: 3.3, eps: 1.13, bps: 10.3, dividendYield: 5.8, marketCap: 2_200_000_000_000 },
  { symbol: "601288.SH", market: "cn", name: "农业银行", industry: "银行", price: 4.8, change: 0.0, pe: 5.2, pb: 0.5, pePbProduct: 2.6, eps: 0.92, bps: 9.6, dividendYield: 6.2, marketCap: 1_680_000_000_000 },
  { symbol: "600028.SH", market: "cn", name: "中国石化", industry: "石油", price: 5.9, change: -0.5, pe: 7.8, pb: 0.7, pePbProduct: 5.46, eps: 0.76, bps: 8.4, dividendYield: 7.1, marketCap: 720_000_000_000 },
  { symbol: "601318.SH", market: "cn", name: "中国平安", industry: "保险", price: 52.3, change: 1.5, pe: 8.9, pb: 1.0, pePbProduct: 8.9, eps: 5.87, bps: 52.3, dividendYield: 4.5, marketCap: 950_000_000_000 },
  { symbol: "000858.SZ", market: "cn", name: "五粮液", industry: "白酒", price: 145.0, change: 0.8, pe: 18.5, pb: 4.2, pePbProduct: 77.7, eps: 7.84, bps: 34.5, dividendYield: 3.2, marketCap: 562_000_000_000 },
  { symbol: "002594.SZ", market: "cn", name: "比亚迪", industry: "汽车", price: 285.0, change: 2.1, pe: 22.3, pb: 3.8, pePbProduct: 84.74, eps: 12.78, bps: 75.0, dividendYield: 0.8, marketCap: 830_000_000_000 },
  { symbol: "600276.SH", market: "cn", name: "恒瑞医药", industry: "医药", price: 48.5, change: -0.6, pe: 35.2, pb: 5.6, pePbProduct: 197.12, eps: 1.38, bps: 8.7, dividendYield: 1.2, marketCap: 310_000_000_000 },
  { symbol: "601012.SH", market: "cn", name: "隆基绿能", industry: "光伏", price: 18.2, change: -2.3, pe: 12.8, pb: 1.5, pePbProduct: 19.2, eps: 1.42, bps: 12.1, dividendYield: 2.5, marketCap: 138_000_000_000 },
  { symbol: "000651.SZ", market: "cn", name: "格力电器", industry: "家电", price: 42.0, change: 0.3, pe: 8.2, pb: 1.8, pePbProduct: 14.76, eps: 5.12, bps: 23.3, dividendYield: 5.5, marketCap: 236_000_000_000 },
];

const MOCK_US: NewStockRecord[] = [
  { symbol: "AAPL", market: "us", name: "Apple Inc.", industry: "Technology", price: 195.0, change: 0.8, pe: 30.5, pb: 45.2, pePbProduct: 1378.6, eps: 6.39, bps: 4.31, dividendYield: 0.5, marketCap: 3_000_000_000_000 },
  { symbol: "MSFT", market: "us", name: "Microsoft Corp.", industry: "Technology", price: 420.0, change: 1.2, pe: 35.8, pb: 12.5, pePbProduct: 447.5, eps: 11.73, bps: 33.6, dividendYield: 0.7, marketCap: 3_120_000_000_000 },
  { symbol: "BRK.B", market: "us", name: "Berkshire Hathaway", industry: "Financial", price: 420.0, change: 0.3, pe: 9.5, pb: 1.4, pePbProduct: 13.3, eps: 44.21, bps: 300.0, dividendYield: 0.0, marketCap: 900_000_000_000 },
  { symbol: "JNJ", market: "us", name: "Johnson & Johnson", industry: "Healthcare", price: 160.0, change: -0.2, pe: 12.8, pb: 5.8, pePbProduct: 74.24, eps: 12.5, bps: 27.6, dividendYield: 3.0, marketCap: 385_000_000_000 },
  { symbol: "JPM", market: "us", name: "JPMorgan Chase", industry: "Financial", price: 195.0, change: 0.5, pe: 11.2, pb: 1.8, pePbProduct: 20.16, eps: 17.41, bps: 108.3, dividendYield: 2.3, marketCap: 565_000_000_000 },
  { symbol: "XOM", market: "us", name: "Exxon Mobil", industry: "Energy", price: 108.0, change: -0.4, pe: 13.5, pb: 1.9, pePbProduct: 25.65, eps: 8.0, bps: 56.8, dividendYield: 3.5, marketCap: 450_000_000_000 },
  { symbol: "KO", market: "us", name: "Coca-Cola", industry: "Consumer", price: 62.0, change: 0.1, pe: 24.5, pb: 10.2, pePbProduct: 249.9, eps: 2.53, bps: 6.08, dividendYield: 3.0, marketCap: 267_000_000_000 },
  { symbol: "PG", market: "us", name: "Procter & Gamble", industry: "Consumer", price: 165.0, change: 0.4, pe: 26.8, pb: 7.5, pePbProduct: 201.0, eps: 6.16, bps: 22.0, dividendYield: 2.4, marketCap: 390_000_000_000 },
  { symbol: "VZ", market: "us", name: "Verizon", industry: "Telecom", price: 42.0, change: -0.1, pe: 9.2, pb: 1.6, pePbProduct: 14.72, eps: 4.57, bps: 26.3, dividendYield: 6.3, marketCap: 177_000_000_000 },
  { symbol: "T", market: "us", name: "AT&T", industry: "Telecom", price: 18.5, change: 0.2, pe: 8.5, pb: 1.1, pePbProduct: 9.35, eps: 2.18, bps: 16.8, dividendYield: 6.0, marketCap: 132_000_000_000 },
  { symbol: "IBM", market: "us", name: "IBM", industry: "Technology", price: 175.0, change: 0.6, pe: 14.5, pb: 6.2, pePbProduct: 89.9, eps: 12.07, bps: 28.2, dividendYield: 3.8, marketCap: 161_000_000_000 },
  { symbol: "CVX", market: "us", name: "Chevron", industry: "Energy", price: 155.0, change: -0.3, pe: 11.8, pb: 1.7, pePbProduct: 20.06, eps: 13.14, bps: 91.2, dividendYield: 4.0, marketCap: 290_000_000_000 },
];

const MOCK_HK: NewStockRecord[] = [
  { symbol: "0700.HK", market: "hk", name: "腾讯控股", industry: "科技", price: 380.0, change: 1.8, pe: 22.5, pb: 4.8, pePbProduct: 108.0, eps: 16.89, bps: 79.2, dividendYield: 0.8, marketCap: 3_600_000_000_000 },
  { symbol: "1299.HK", market: "hk", name: "友邦保险", industry: "保险", price: 68.0, change: 0.5, pe: 15.2, pb: 1.8, pePbProduct: 27.36, eps: 4.47, bps: 37.8, dividendYield: 2.5, marketCap: 785_000_000_000 },
  { symbol: "0005.HK", market: "hk", name: "汇丰控股", industry: "银行", price: 65.0, change: -0.2, pe: 7.8, pb: 0.9, pePbProduct: 7.02, eps: 8.33, bps: 72.2, dividendYield: 5.5, marketCap: 1_250_000_000_000 },
  { symbol: "0941.HK", market: "hk", name: "中国移动", industry: "电信", price: 72.0, change: 0.3, pe: 10.5, pb: 1.2, pePbProduct: 12.6, eps: 6.86, bps: 60.0, dividendYield: 6.5, marketCap: 1_540_000_000_000 },
  { symbol: "2318.HK", market: "hk", name: "中国平安", industry: "保险", price: 48.0, change: 1.0, pe: 6.5, pb: 0.8, pePbProduct: 5.2, eps: 7.38, bps: 60.0, dividendYield: 5.8, marketCap: 880_000_000_000 },
  { symbol: "0939.HK", market: "hk", name: "建设银行", industry: "银行", price: 6.5, change: 0.1, pe: 4.8, pb: 0.5, pePbProduct: 2.4, eps: 1.35, bps: 13.0, dividendYield: 7.2, marketCap: 1_620_000_000_000 },
  { symbol: "1398.HK", market: "hk", name: "工商银行", industry: "银行", price: 5.5, change: 0.0, pe: 4.5, pb: 0.5, pePbProduct: 2.25, eps: 1.22, bps: 11.0, dividendYield: 7.5, marketCap: 1_950_000_000_000 },
  { symbol: "0388.HK", market: "hk", name: "香港交易所", industry: "金融", price: 320.0, change: 2.5, pe: 32.0, pb: 8.5, pePbProduct: 272.0, eps: 10.0, bps: 37.6, dividendYield: 2.8, marketCap: 405_000_000_000 },
  { symbol: "9988.HK", market: "hk", name: "阿里巴巴", industry: "科技", price: 85.0, change: -1.5, pe: 11.2, pb: 1.5, pePbProduct: 16.8, eps: 7.59, bps: 56.7, dividendYield: 1.5, marketCap: 1_650_000_000_000 },
  { symbol: "3968.HK", market: "hk", name: "招商银行", industry: "银行", price: 42.0, change: 0.4, pe: 6.2, pb: 0.8, pePbProduct: 4.96, eps: 6.77, bps: 52.5, dividendYield: 5.3, marketCap: 1_060_000_000_000 },
  { symbol: "0002.HK", market: "hk", name: "中电控股", industry: "电力", price: 68.0, change: 0.1, pe: 13.5, pb: 1.3, pePbProduct: 17.55, eps: 5.04, bps: 52.3, dividendYield: 4.7, marketCap: 172_000_000_000 },
  { symbol: "0003.HK", market: "hk", name: "香港中华煤气", industry: "公用事业", price: 7.2, change: -0.3, pe: 18.0, pb: 2.1, pePbProduct: 37.8, eps: 0.4, bps: 3.43, dividendYield: 4.9, marketCap: 128_000_000_000 },
];

async function seed() {
  console.log("Seeding database...");

  const allStocks = [...MOCK_CN, ...MOCK_US, ...MOCK_HK];

  for (const stock of allStocks) {
    await db
      .insert(stocks)
      .values(stock)
      .onConflictDoUpdate({
        target: [stocks.symbol, stocks.market],
        set: {
          name: stock.name,
          industry: stock.industry,
          price: stock.price,
          change: stock.change,
          pe: stock.pe,
          pb: stock.pb,
          pePbProduct: stock.pePbProduct,
          eps: stock.eps,
          bps: stock.bps,
          dividendYield: stock.dividendYield,
          marketCap: stock.marketCap,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`Seeded ${allStocks.length} stocks (${MOCK_CN.length} CN, ${MOCK_US.length} US, ${MOCK_HK.length} HK)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
