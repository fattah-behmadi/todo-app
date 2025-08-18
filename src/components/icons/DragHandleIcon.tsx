import React from "react";

interface IconProps {
  className?: string;
}

export const DragHandleIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
}) => {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
      <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zM8 12a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0zM20 6a2 2 0 11-4 0 2 2 0 014 0zM20 12a2 2 0 11-4 0 2 2 0 014 0zM20 18a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
};
