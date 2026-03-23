export function EmptyState({
  message = "没有找到符合条件的股票",
  suggestion = "试试放宽筛选条件？",
}: {
  message?: string;
  suggestion?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p className="text-lg font-medium text-gray-500">{message}</p>
      <p className="text-sm text-gray-400 mt-1">{suggestion}</p>
    </div>
  );
}
