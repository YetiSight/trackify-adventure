
import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = "snow" }) => {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">dalla scorsa sessione</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
