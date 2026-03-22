import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SeekingTop1 - 专业选股筛选器",
  description: "用大师级投资策略筛选全球股票，覆盖 A 股、美股、港股",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50" style={{ fontFamily: 'var(--font-geist-sans), "PingFang SC", "Microsoft YaHei", sans-serif' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
