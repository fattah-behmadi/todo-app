import React, { useState, useRef, useEffect } from "react";
import { Todo } from "../../../types/todo.types";
import { useAppDispatch } from "../../../store/useAppDispatch";
import { updateTodo, deleteTodo } from "../../../store/todoSlice";
import { TodoService } from "../../../services/todoService";
import { useDragAndDrop } from "../../../plugin/Dnd-JS";
import { DeleteTodoDialog } from "../../../components";

interface TodoItemProps {
  todo: Todo;
  index: number;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, index: _index }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const { registerDraggable, unregisterDraggable, isDragging } =
    useDragAndDrop();

  const handleToggleStatus = async () => {
    try {
      setIsUpdating(true);
      const updatedTodo = await TodoService.toggleTodoStatus(
        todo.id,
        !todo.completed
      );
      dispatch(updateTodo(updatedTodo));
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsUpdating(true);
      await TodoService.deleteTodo(todo.id);
      dispatch(deleteTodo(todo.id));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting:", error);
      setIsUpdating(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.todo);
  };

  const handleSave = async () => {
    if (editText.trim() && editText !== todo.todo) {
      try {
        setIsUpdating(true);
        const updatedTodo = await TodoService.updateTodoText(
          todo.id,
          editText.trim()
        );
        dispatch(updateTodo(updatedTodo));
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating:", error);
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.todo);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const dragging = isDragging(todo.id);

  // Register this item for drag and drop
  useEffect(() => {
    if (itemRef.current) {
      registerDraggable(todo.id, itemRef.current);
    }

    return () => {
      unregisterDraggable(todo.id);
    };
  }, [todo.id, registerDraggable, unregisterDraggable]);

  return (
    <div
      ref={itemRef}
      data-draggable-id={todo.id}
      className={`group bg-white rounded-lg border border-gray-200 p-4 shadow-xs hover:shadow-md transition-all duration-200 animate-fade-in ${
        dragging ? "opacity-50 transform rotate-2 z-50" : ""
      }`}
    >
      <div className="flex items-center space-x-3 space-x-reverse">
        {/* Drag Handle */}
        <div
          className="shrink-0 w-4 h-4 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
          onMouseDown={(e) => {
            // Prevent any interference with drag start
            e.stopPropagation();
          }}
        >
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zM8 12a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0zM20 6a2 2 0 11-4 0 2 2 0 014 0zM20 12a2 2 0 11-4 0 2 2 0 014 0zM20 18a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        {/* Checkbox */}
        <button
          onClick={handleToggleStatus}
          disabled={isUpdating}
          className={`shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
            todo.completed
              ? "bg-success-500 border-success-500 text-white"
              : "border-gray-300 hover:border-primary-400"
          } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {todo.completed && (
            <svg
              className="w-3 h-3 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Todo Text */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSave}
              className="w-full px-2 py-1 border border-gray-300 rounded-sm focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <p
              className={`text-gray-900 transition-all duration-200 cursor-pointer ${
                todo.completed
                  ? "line-through text-gray-500"
                  : "hover:text-primary-600"
              }`}
              onClick={handleEdit}
            >
              <span>{todo.id} - </span>
              {todo.todo}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!isEditing && (
            <button
              onClick={handleEdit}
              disabled={isUpdating}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors duration-200"
              title="Edit"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isUpdating}
            className="p-1 text-gray-400 hover:text-danger-600 transition-colors duration-200"
            title="Delete"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isUpdating && (
        <div className="mt-2 flex justify-center">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteTodoDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        todo={todo}
        isLoading={isUpdating}
      />
    </div>
  );
};
