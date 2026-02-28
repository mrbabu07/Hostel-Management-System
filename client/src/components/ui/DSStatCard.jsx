/**
 * Design System Stat Card (Quick Action style)
 * Uses neutral surface + small brand accent (left border or icon bg).
 * Optionally pass status for semantic color (success, warning, danger, info).
 */
import { TrendingUp, TrendingDown } from "lucide-react";

const DSStatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  status, // "success" | "warning" | "danger" | "info" | undefined
  prefix = "",
  suffix = "",
  className = "",
}) => {
  const statusBorder = status
    ? {
        success: "border-l-status-success",
        warning: "border-l-status-warning",
        danger: "border-l-status-danger",
        info: "border-l-status-info",
      }[status]
    : "border-l-brand";

  const statusIconBg = status
    ? {
        success: "bg-status-success-soft text-status-success",
        warning: "bg-status-warning-soft text-status-warning",
        danger: "bg-status-danger-soft text-status-danger",
        info: "bg-status-info-soft text-status-info",
      }[status]
    : "bg-brand-soft text-brand";

  return (
    <div
      className={`bg-surface border border-border border-l-4 ${statusBorder} rounded-xl p-5 shadow-sm transition-shadow duration-200 hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="mt-1 text-2xl font-bold text-text-primary tabular-nums">
            {prefix}
            {value}
            {suffix}
          </p>
          {trend && (
            <div
              className={`mt-2 flex items-center gap-1 text-sm font-medium ${
                trend === "up" ? "text-status-success" : "text-status-danger"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${statusIconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DSStatCard;
