import { cn } from "@/lib/cn";

type Status = "Paid" | "Pending" | "Overdue" | "New" | "Contacted" | "Joined" | "Declined" | "Active" | "Filling" | "Full" | "Inactive";

const STATUS_STYLES: Record<Status, string> = {
  Paid:       "bg-success/15 text-success border border-success/30",
  Pending:    "bg-warning/15 text-warning border border-warning/30",
  Overdue:    "bg-error/15 text-error border border-error/30 animate-overdue-pulse",
  New:        "bg-cta-magenta/15 text-cta-magenta border border-cta-magenta/30",
  Contacted:  "bg-accent-blue/15 text-accent-blue border border-accent-blue/30",
  Joined:     "bg-success/15 text-success border border-success/30",
  Declined:   "bg-text-muted/15 text-text-muted border border-text-muted/20",
  Active:     "bg-success/10 text-success border border-success/20",
  Filling:    "bg-warning/10 text-warning border border-warning/20",
  Full:       "bg-error/10 text-error border border-error/20",
  Inactive:   "bg-text-muted/10 text-text-muted border border-text-muted/15",
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
