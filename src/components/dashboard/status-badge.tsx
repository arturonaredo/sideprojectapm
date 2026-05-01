import { cn } from "@/lib/utils";

export type Status = "healthy" | "degraded" | "critical" | "down";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const statusConfig: Record<
  Status,
  { bg: string; text: string; dot: string; label: string }
> = {
  healthy: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
    label: "Healthy",
  },
  degraded: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Degraded",
  },
  critical: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "Critical",
  },
  down: {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500 animate-pulse",
    label: "Down",
  },
};

const sizes = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-sm gap-1.5",
  lg: "px-3 py-1.5 text-base gap-2",
};

const dotSizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

export function StatusBadge({
  status,
  size = "md",
  showLabel = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        config.bg,
        config.text,
        sizes[size],
        className
      )}
    >
      <span
        className={cn("rounded-full", config.dot, dotSizes[size])}
        aria-hidden="true"
      />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}