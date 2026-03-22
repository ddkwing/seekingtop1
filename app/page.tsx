import Link from "next/link";
import { STRATEGIES } from "@/lib/strategies";
import { StrategyCard } from "@/components/strategy-card";

export default function HomePage() {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        用大师级策略，筛选全球股票
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        内置经典投资策略，覆盖 A 股 / 美股 / 港股，让你像专业投资者一样选股
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STRATEGIES.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}

        {/* Custom strategy entry card */}
        <Link
          href="/screener"
          className="border border-dashed border-gray-300 rounded-lg p-5 bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center min-h-[180px]"
        >
          <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium text-gray-500">自定义策略</span>
          <span className="text-xs text-gray-400 mt-1">自由组合筛选条件</span>
        </Link>
      </div>
    </div>
  );
}
