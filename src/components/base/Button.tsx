import React from "react";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 focus:ring-primary-500",
  secondary:
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-primary-500",
  danger:
    "bg-danger-600 text-white border-danger-600 hover:bg-danger-700 hover:border-danger-700 focus:ring-danger-500",
  ghost:
    "bg-transparent text-gray-600 border-transparent hover:bg-gray-100 focus:ring-primary-500",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];
  const widthClasses = fullWidth ? "w-full" : "";
  const disabledClasses =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  const finalClassName =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${disabledClasses} ${className}`.trim();

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Spinner size="sm" className="mr-2" />
          <span className="opacity-75">{children}</span>
        </>
      );
    }

    const iconElement = icon && (
      <span className={iconPosition === "left" ? "mr-2" : "ml-2"}>{icon}</span>
    );

    return (
      <>
        {icon && iconPosition === "left" && iconElement}
        {children}
        {icon && iconPosition === "right" && iconElement}
      </>
    );
  };

  return (
    <button
      className={finalClassName}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};
