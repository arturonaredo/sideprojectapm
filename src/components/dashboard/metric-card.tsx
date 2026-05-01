import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  variant?: "default" | "success" | "warning" | "danger";
  children?: ReactNode;
  className?: string;
}

const variantStyles = {
  default: {
    icon: "text-gray-400",
    value: "text-gray-900",
    subtitle: "text-gray-500",
  },
  success: {
    icon: "text-green-500",
    value: "text-green-600",
    subtitle: "text-green-500",
  },
  warning: {
    icon: "text-amber-500",
    value: "text-amber-600",
    subtitle: "text-amber-500",
  },
  danger: {
    icon: "text-red-500",
    value: "text-red-600",
    subtitle: "text-red-500",
  },
};

const trendColors = {
  up: "text-green-500",
  down: "text-red-500",
  neutral: "text-gray-500",
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  children,
  className,
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className={cn("text-2xl font-semibold", styles.value)}>
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium flex items-center gap-0.5",
                  trendColors[trend.direction]
                )}
              >
                {trend.direction === "up" && "↑"}
                {trend.direction === "down" && "↓"}
                {trend.value}% {trend.label}
              </span>
            )}
          </div>
          {subtitle && (
            <p className={cn("mt-1 text-sm", styles.subtitle)}>{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100",
              styles.icon
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </Card>
  );
}