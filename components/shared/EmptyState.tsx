import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center" role="status">
      <div className="w-14 h-14 rounded-full bg-surface-el flex items-center justify-center mb-4 border border-white/5">
        <Icon className="w-7 h-7 text-text-muted" aria-hidden="true" />
      </div>
      <p className="text-body-sm font-semibold text-text-secondary mb-1">{title}</p>
      {description && <p className="text-caption text-text-muted max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
