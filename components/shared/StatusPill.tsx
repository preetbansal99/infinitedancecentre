import { cn } from "@/lib/cn";

type Status = "Paid" | "Pending" | "Overdue" | "New" | "Contacted" | "Joined" | "Declined" | "Active" | "Filling" | "Full" | "Inactive";

const STATUS_STYLES: Record<Status, string> = {
  Paid:       "bg-[#141413] text-[#FAF9F6] border border-[#141413]",
  Pending:    "bg-[#F59E0B] text-[#141413] border border-[#F59E0B]",
  Overdue:    "bg-[#DC2626] text-[#FAF9F6] border border-[#DC2626]",
  New:        "bg-[#2563EB] text-[#FAF9F6] border border-[#2563EB]",
  Contacted:  "bg-[#141413] text-[#FAF9F6] border border-[#141413]",
  Joined:     "bg-[#141413] text-[#FAF9F6] border border-[#141413]",
  Declined:   "bg-[#FFFFFF] text-[#4B5563] border border-[#4B5563]",
  Active:     "bg-[#141413] text-[#FAF9F6] border border-[#141413]",
  Filling:    "bg-[#F59E0B] text-[#141413] border border-[#F59E0B]",
  Full:       "bg-[#DC2626] text-[#FAF9F6] border border-[#DC2626]",
  Inactive:   "bg-[#FFFFFF] text-[#4B5563] border border-[#4B5563]",
};

interface StatusPillProps {
  status: Status;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-semibold uppercase tracking-wide",
        STATUS_STYLES[status],
        className
      )}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}
