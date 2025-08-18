import React from "react";

export type ProgressBarSize = "sm" | "md" | "lg";
export type ProgressBarColor = "primary" | "success" | "warning" | "danger";

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: ProgressBarSize;
  color?: ProgressBarColor;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

const progressBarSizes: Record<ProgressBarSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const progressBarColors: Record<ProgressBarColor, string> = {
  primary: "bg-primary-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "md",
  color = "primary",
  label,
  showPercentage = false,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = progressBarSizes[size];
  const colorClasses = progressBarColors[color];

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}

      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses}`}>
        <div
          className={`${colorClasses} ${sizeClasses} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
