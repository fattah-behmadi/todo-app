import React, { useEffect } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { setTodos, setLoading, setError } from "../../../store/todoSlice";
import { TodoService } from "../../../services/todoService";
import { TodoFilters } from "./TodoFilters";
import { TodoList } from "./TodoList";
import { ErrorBoundary } from "./ErrorBoundary";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

export const TodoApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        dispatch(setLoading(true));
        const todosData = await TodoService.getAllTodos();
        dispatch(setTodos(todosData));
      } catch (error: any) {
        const errorMessage = error.message || "خطا در دریافت Todos";
        dispatch(setError(errorMessage));
        console.error("خطا در دریافت Todos:", error);
      }
    };

    fetchTodos();
  }, [dispatch]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-danger-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            خطا در بارگذاری
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={handleRetry} className="btn-primary">
            تلاش مجدد
          </button>
        </div>
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
                مدیریت وظایف
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              وظایف خود را به راحتی مدیریت کنید
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <TodoFilters />
            <TodoList />
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500">
            <p>ساخته شده با ❤️ و React + TypeScript</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
