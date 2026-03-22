import { Suspense } from "react";
import { ScreenerContent } from "@/components/screener-content";
import { TableSkeleton } from "@/components/ui/skeleton";

export default function ScreenerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <TableSkeleton rows={8} />
        </div>
      }
    >
      <ScreenerContent />
    </Suspense>
  );
}
