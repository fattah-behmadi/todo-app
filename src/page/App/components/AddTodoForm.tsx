import React, { useState } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { addTodo } from "../../../store/todoSlice";
import { TodoService } from "../../../services/todoService";
import { CreateTodoSchema, CreateTodoInput } from "../../../types/validation";

export const AddTodoForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [todoText, setTodoText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todoText.trim()) {
      setError("Todo title cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const input: CreateTodoInput = {
        todo: todoText.trim(),
        completed: false,
        userId: 1,
      };

      // Validate input
      const validatedInput = CreateTodoSchema.parse(input);

      // Create todo
      const newTodo = await TodoService.createTodo(validatedInput);

      // Add to store
      dispatch(addTodo(newTodo));

      // Reset form
      setTodoText("");
    } catch (error: any) {
      if (error.name === "ZodError") {
        setError(error.errors[0]?.message || "Validation error");
      } else {
        setError("Error creating Todo. Please try again.");
      }
      console.error("Error creating Todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Todo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="todoInput"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Todo Title
          </label>
          <input
            id="todoInput"
            type="text"
            value={todoText}
            onChange={handleInputChange}
            placeholder="Example: Buy groceries..."
            className={`input ${
              error ? "border-danger-500 focus:ring-danger-500" : ""
            }`}
            disabled={isSubmitting}
            maxLength={200}
          />
          {error && (
            <p className="mt-1 text-sm text-danger-600 animate-fade-in">
              {error}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {todoText.length}/200 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !todoText.trim()}
          className={`btn-primary w-full ${
            isSubmitting || !todoText.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary-700"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating...</span>
            </div>
          ) : (
            "Add Todo"
          )}
        </button>
      </form>
    </div>
  );
};
