import React from "react";

export type CardVariant = "default" | "outlined" | "elevated";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const cardVariants: Record<CardVariant, string> = {
  default: "bg-white border border-gray-200 shadow-sm",
  outlined: "bg-white border-2 border-gray-300",
  elevated: "bg-white border border-gray-200 shadow-lg",
};

const cardPaddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card: React.FC<CardProps> = ({
  variant = "default",
  padding = "md",
  header,
  footer,
  className = "",
  children,
  ...props
}) => {
  const baseClasses = "rounded-lg transition-shadow duration-200";
  const variantClasses = cardVariants[variant];
  const paddingClasses = cardPaddings[padding];

  const finalClassName = `${baseClasses} ${variantClasses} ${className}`.trim();

  return (
    <div className={finalClassName} {...props}>
      {header && (
        <div
          className={`border-b border-gray-200 ${
            padding !== "none" ? "px-6 py-4" : ""
          }`}
        >
          {header}
        </div>
      )}

      <div className={paddingClasses}>{children}</div>

      {footer && (
        <div
          className={`border-t border-gray-200 ${
            padding !== "none" ? "px-6 py-4" : ""
          }`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
