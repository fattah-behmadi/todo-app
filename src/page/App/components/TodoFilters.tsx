import React from "react";
import { useAppSelector } from "@/store/useAppSelector";
import { setFilter, setSearchQuery } from "@/store/todoSlice";
import {
  getCompletedCount,
  getIncompleteCount,
  getTotalCount,
} from "@/utils/todoUtils";
import { useAppDispatch } from "@/store/useAppDispatch";
import { SearchIcon } from "@/components/icons";
import { Card, Button, Input, ProgressBar, Badge } from "@/components/base";

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
    <Card className="mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            id="searchInput"
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search in Todos..."
            rightIcon={<SearchIcon />}
            fullWidth={false}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleFilterChange("all")}
            variant={filter === "all" ? "primary" : "secondary"}
          >
            All
            <Badge variant="default" size="sm" className="ml-1">
              {totalCount}
            </Badge>
          </Button>

          <Button
            onClick={() => handleFilterChange("incomplete")}
            variant={filter === "incomplete" ? "primary" : "secondary"}
          >
            Incomplete{" "}
            <Badge variant="warning" size="sm" className="ml-1">
              {incompleteCount}
            </Badge>
          </Button>

          <Button
            onClick={() => handleFilterChange("completed")}
            variant={filter === "completed" ? "primary" : "secondary"}
          >
            Completed{" "}
            <Badge variant="success" size="sm" className="ml-1">
              {completedCount}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mt-4">
          <ProgressBar
            value={completedCount}
            max={totalCount}
            color="success"
            label="Overall Progress"
            showPercentage
          />
        </div>
      )}
    </Card>
  );
};
