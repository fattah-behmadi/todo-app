import React from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { setFilter, setSearchQuery } from "../../../store/todoSlice";
import {
  getCompletedCount,
  getIncompleteCount,
  getTotalCount,
} from "../../../utils/todoUtils";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

export const TodoFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, filter, searchQuery } = useAppSelector((state) => state.todos);

  const totalCount = getTotalCount(todos);
  const completedCount = getCompletedCount(todos);
  const incompleteCount = getIncompleteCount(todos);

  const handleFilterChange = (
    newFilter: "all" | "completed" | "incomplete"
  ) => {
    dispatch(setFilter(newFilter));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  return (
    <div className="card mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <label htmlFor="searchInput" className="sr-only">
            جستجو در Todos
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="searchInput"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="جستجو در Todos..."
              className="input pr-10"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange("all")}
            className={`btn-secondary ${
              filter === "all"
                ? "bg-primary-100 text-primary-700 border-primary-300"
                : "hover:bg-gray-300"
            }`}
          >
            همه ({totalCount})
          </button>

          <button
            onClick={() => handleFilterChange("incomplete")}
            className={`btn-secondary ${
              filter === "incomplete"
                ? "bg-primary-100 text-primary-700 border-primary-300"
                : "hover:bg-gray-300"
            }`}
          >
            ناتمام ({incompleteCount})
          </button>

          <button
            onClick={() => handleFilterChange("completed")}
            className={`btn-secondary ${
              filter === "completed"
                ? "bg-primary-100 text-primary-700 border-primary-300"
                : "hover:bg-gray-300"
            }`}
          >
            تکمیل شده ({completedCount})
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>پیشرفت کلی</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-success-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
