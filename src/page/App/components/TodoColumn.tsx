import React, { useRef } from "react";
import { Todo } from "@/types/todo.types";
import { TodoItem } from "./TodoItem";
import { Loading } from "@/components/Loading";

interface TodoColumnProps {
  title: string;
  todos: Todo[];
  color: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  intersectionRef: any;
  isIntersecting: boolean;
  isEmptyMessage: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  children?: React.ReactNode;
}

export const TodoColumn: React.FC<TodoColumnProps> = ({
  title,
  todos,
  color,
  containerRef,
  scrollRef,
  intersectionRef,
  isIntersecting,
  isEmptyMessage,
  showAddButton = false,
  onAddClick,
  children,
}) => {
  const scrollColumn = "overflow-y-auto min-h-[50vh] max-h-[70vh]";

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
      data-container-id={
        title === "Tasks in Progress" ? "incomplete" : "completed"
      }
      style={{ pointerEvents: "auto" }}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className={`w-3 h-3 ${color} rounded-full mr-2`}></span>
            <span>
              {title} ({todos.length})
            </span>
          </h3>

          {showAddButton && (
            <button
              title="Add new task"
              className="w-8 h-8 p-1 border rounded-sm text-xl cursor-pointer hover:bg-primary-600 hover:text-white flex justify-center items-center"
              onClick={onAddClick}
            >
              +
            </button>
          )}
        </div>
        {children}
      </div>

      <div className={scrollColumn} ref={scrollRef}>
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{isEmptyMessage}</div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo, index) => (
              <TodoItem key={todo.id} todo={todo} index={index} />
            ))}
          </div>
        )}

        <div ref={intersectionRef as any} className="min-h-10">
          {isIntersecting ? "" : <Loading />}
        </div>
      </div>
    </div>
  );
};
