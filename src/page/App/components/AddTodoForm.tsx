import React, { useState } from "react";
import { useAppDispatch } from "../../../store/useAppDispatch";
import { addTodo } from "../../../store/todoSlice";
import { TodoService } from "../../../services/todoService";
import { CreateTodoSchema, CreateTodoInput } from "../../../types/validation";
import { Card, Button, Input } from "../../../components/base";

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
    <Card className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Todo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="todoInput"
          type="text"
          value={todoText}
          onChange={handleInputChange}
          placeholder="Example: Buy groceries..."
          label="Todo Title"
          variant={error ? "error" : "default"}
          error={error || undefined}
          helpText={`${todoText.length}/200 characters`}
          disabled={isSubmitting}
          maxLength={200}
        />

        <Button
          type="submit"
          disabled={isSubmitting || !todoText.trim()}
          loading={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Creating..." : "Add Todo"}
        </Button>
      </form>
    </Card>
  );
};
