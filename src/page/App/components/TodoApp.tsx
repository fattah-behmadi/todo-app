import React, { useEffect } from "react";
import { useAppSelector } from "../../../store/useAppSelector";
import { TodoFilters } from "./TodoFilters";
import { TodoList } from "./TodoList";
import { ErrorBoundary } from "./ErrorBoundary";
import { WarningIcon } from "../../../components/icons";
import { Button, Card } from "../../../components/base";
import { useAppStore } from "../useAppStore";

export const TodoApp: React.FC = () => {
  const { fetchTodos } = useAppStore();
  const { error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full text-center" variant="elevated">
          <div className="text-danger-500 mb-4">
            <WarningIcon className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Error
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRetry} variant="primary">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 pt-6 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Task Management
              </h1>
            </div>
            <p className="text-lg text-gray-600">Easily manage your tasks</p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <TodoFilters />
            <TodoList />
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500">
            <p>Built with ❤️ and React + TypeScript</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
