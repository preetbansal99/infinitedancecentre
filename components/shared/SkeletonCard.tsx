import { cn } from "@/lib/cn";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg p-4 space-y-3", className)} aria-busy="true" aria-label="Loading">
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="skeleton h-8 w-24 rounded-full mt-2" />
    </div>
  );
}
