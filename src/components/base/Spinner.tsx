import React from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerColor = "primary" | "white" | "gray" | "danger" | "success";

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const spinnerSizes: Record<SpinnerSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const spinnerColors: Record<SpinnerColor, string> = {
  primary: "border-primary-500",
  white: "border-white",
  gray: "border-gray-500",
  danger: "border-danger-500",
  success: "border-success-500",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  const sizeClasses = spinnerSizes[size];
  const colorClasses = spinnerColors[color];

  const finalClassName =
    `${sizeClasses} border-2 border-t-transparent rounded-full animate-spin ${colorClasses} ${className}`.trim();

  return <div className={finalClassName} />;
};
