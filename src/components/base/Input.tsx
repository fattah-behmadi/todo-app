import React, { forwardRef } from "react";

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "error" | "success";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const inputVariants: Record<InputVariant, string> = {
  default: "border-gray-300 focus:border-primary-500 focus:ring-primary-500",
  error: "border-danger-500 focus:border-danger-500 focus:ring-danger-500",
  success: "border-success-500 focus:border-success-500 focus:ring-success-500",
};

const inputSizes: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      variant = "default",
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses =
      "block border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";
    const variantClasses = inputVariants[variant];
    const sizeClasses = inputSizes[size];
    const widthClasses = fullWidth ? "w-full" : "";
    const iconPaddingLeft = leftIcon ? "pl-10" : "";
    const iconPaddingRight = rightIcon ? "pr-10" : "";

    const finalClassName =
      `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${iconPaddingLeft} ${iconPaddingRight} ${className}`.trim();

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full ${finalClassName}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-danger-600 animate-fade-in">
            {error}
          </p>
        )}

        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);
