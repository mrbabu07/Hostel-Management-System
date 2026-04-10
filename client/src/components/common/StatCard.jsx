import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
  subtitle,
}) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
    cyan: "bg-cyan-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

          {(trend || subtitle) && (
            <div className="flex items-center gap-2">
              {trend && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    trend === "up" ? "text-green-600" : "text-red-600"
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
              {subtitle && (
                <span className="text-sm text-gray-500">{subtitle}</span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`${colors[color]} p-4 rounded-xl`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
