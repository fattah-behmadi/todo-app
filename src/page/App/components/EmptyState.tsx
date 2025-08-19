import React from "react";
import { ClipboardIcon } from "@/components/icons";

interface EmptyStateProps {
  filter: string;
  searchQuery: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filter,
  searchQuery,
}) => {
  const isNoTodos = filter === "all" && !searchQuery;

  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <ClipboardIcon className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isNoTodos ? "No Todos have been added yet" : "No results found"}
      </h3>
      <p className="text-gray-500">
        {isNoTodos
          ? "Add your first Todo to get started"
          : "Please change the filter or search"}
      </p>
    </div>
  );
};
