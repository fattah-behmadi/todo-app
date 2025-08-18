import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAppSelector } from "@/store/useAppSelector";
import { filterTodos, sortTodos } from "@/utils/todoUtils";
import { TodoItem } from "./TodoItem";
import { useAppStore } from "../useAppStore";
import { AddTodoForm } from "./AddTodoForm";
import { useDragAndDrop, CustomDragEvent } from "@/plugin/Dnd-JS";
import { Loading } from "@/components/Loading";
import { ClipboardIcon } from "@/components/icons";
import { Spinner } from "@/components/base/Spinner";
import { useInfinitePagination } from "@/hooks/useInfinitePagination";
import { useInitialTodoLoad } from "@/hooks/useTodoQuery";

export const TodoList: React.FC = () => {
  const { toggleTodo } = useAppStore();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const {
    todos: paginatedTodos,
    isLoading,
    hasMore,
    loadMore,
  } = useInitialTodoLoad();
  const { filter, searchQuery, loading } = useAppSelector(
    (state) => state.todos
  );

  const incompleteContainerRef = useRef<HTMLDivElement>(null);
  const completedContainerRef = useRef<HTMLDivElement>(null);

  const { registerContainer, setDragEndCallback } = useDragAndDrop();

  const filteredTodos = filterTodos(paginatedTodos, filter, searchQuery);
  const sortedTodos = sortTodos(filteredTodos);

  // Separate todos based on status
  const incompleteTodos = sortedTodos.filter((todo) => !todo.completed);
  const completedTodos = sortedTodos.filter((todo) => todo.completed);

  // Infinite scroll for incomplete todos
  const { containerRef: incompleteContainerScrollRef } = useInfinitePagination({
    hasMore,
    isLoading,
    loadMore,
  });

  // Infinite scroll for completed todos
  const { containerRef: completedContainerScrollRef } = useInfinitePagination({
    hasMore,
    isLoading,
    loadMore,
  });

  // Handle drag end callback function
  const handleDragEnd = useCallback(
    async (event: CustomDragEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const draggedTodo = sortedTodos.find((todo) => todo.id === active.id);
        console.log("🚀 ~ TodoList ~ draggedTodo:", draggedTodo);

        if (draggedTodo) {
          // Check if dropped on a container (empty column)
          if (over.id === "incomplete" || over.id === "completed") {
            const targetCompleted = over.id === "completed";

            // Only update if the completion status is different
            if (draggedTodo.completed !== targetCompleted) {
              await toggleTodo(draggedTodo.id, targetCompleted);
            }
          } else {
            // Find the target todo to determine the drop zone
            const targetTodo = sortedTodos.find((todo) => todo.id === over.id);

            if (targetTodo) {
              // Check if dragged to different completion status
              if (draggedTodo.completed !== targetTodo.completed) {
                await toggleTodo(draggedTodo.id, targetTodo.completed);
              }
            }
          }
        }
      }
    },
    [sortedTodos, toggleTodo]
  );

  // Register containers for drag and drop
  useEffect(() => {
    if (incompleteContainerRef.current) {
      registerContainer("incomplete", incompleteContainerRef.current);
    }
    if (completedContainerRef.current) {
      registerContainer("completed", completedContainerRef.current);
    }

    // Set the drag end callback
    setDragEndCallback(handleDragEnd);
  }, [registerContainer, setDragEndCallback, handleDragEnd]);

  if (loading) return <Loading />;

  if (sortedTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ClipboardIcon className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {filter === "all" && !searchQuery
            ? "No Todos have been added yet"
            : "No results found"}
        </h3>
        <p className="text-gray-500">
          {filter === "all" && !searchQuery
            ? "Add your first Todo to get started"
            : "Please change the filter or search"}
        </p>
      </div>
    );
  }

  const scrollColumn = "overflow-y-auto max-h-[70vh]";

  return (
    <div className="space-y-6 grid grid-cols-2 gap-6">
      {/* First column: Incomplete tasks */}
      <div
        ref={incompleteContainerRef}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
        data-container-id="incomplete"
        style={{ pointerEvents: "auto" }}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            {/* title */}
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
              <span>Tasks in Progress ({incompleteTodos.length})</span>
            </h3>

            {/* add button */}
            <button
              title="Add new task"
              className="w-8 h-8 p-1 border rounded-sm text-xl cursor-pointer hover:bg-primary-600 hover:text-white flex justify-center items-center"
              onClick={() => setShowDialog(!showDialog)}
            >
              +
            </button>
          </div>
          {showDialog && <AddTodoForm />}
        </div>

        {incompleteTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            All tasks completed! 🎉
          </div>
        ) : (
          <div
            ref={incompleteContainerScrollRef}
            className={`space-y-3 ${scrollColumn}`}
          >
            {incompleteTodos.map((todo, index) => (
              <TodoItem key={todo.id} todo={todo} index={index} />
            ))}
            {isLoading && <Spinner />}
          </div>
        )}
      </div>

      {/* Second column: Completed tasks */}
      <div
        ref={completedContainerRef}
        className={`bg-white rounded-lg border border-gray-200 p-6`}
        data-container-id="completed"
        style={{ pointerEvents: "auto" }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
          Completed Tasks ({completedTodos.length})
        </h3>

        {completedTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks have been completed yet
          </div>
        ) : (
          <div
            ref={completedContainerScrollRef}
            className={`space-y-3 ${scrollColumn}`}
          >
            {completedTodos.map((todo, index) => (
              <TodoItem key={todo.id} todo={todo} index={index} />
            ))}
            {isLoading && <Spinner />}
          </div>
        )}
      </div>
    </div>
  );
};
