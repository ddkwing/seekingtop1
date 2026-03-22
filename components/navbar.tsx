import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
      <Link href="/" className="text-lg font-bold tracking-tight">
        Seeking<span className="text-blue-600">Top1</span>
      </Link>
      <div className="flex gap-6 text-sm">
        <Link
          href="/"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          策略库
        </Link>
        <Link
          href="/screener"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          筛选器
        </Link>
      </div>
    </nav>
  );
}
