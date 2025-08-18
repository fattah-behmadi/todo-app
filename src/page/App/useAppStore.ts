import { TodoService } from "@/services/todoService";
import { useAppDispatch } from "@/store/useAppDispatch";
import {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
  setLoading,
  setError,
} from "@/store/todoSlice";
import { CreateTodoInput, CreateTodoSchema } from "@/types/validation";
import { Todo } from "@/types/todo.types";

export const useAppStore = () => {
  const dispatch = useAppDispatch();

  const fetchTodos = async () => {
    try {
      dispatch(setLoading(true));
      const todosData = await TodoService.getAllTodos();
      dispatch(setTodos(todosData));
    } catch (error: any) {
      const errorMessage = error.message || "Error fetching Todos";
      dispatch(setError(errorMessage));
      console.error("Error fetching Todos:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createTodo = async (todoText: string) => {
    try {
      const input: CreateTodoInput = {
        todo: todoText.trim(),
        completed: false,
        userId: 13,
      };

      const validatedInput = CreateTodoSchema.parse(input);
      const newTodo = await TodoService.createTodo(validatedInput);
      dispatch(addTodo(newTodo));
      return newTodo;
    } catch (error: any) {
      console.error("Error creating Todo:", error);
      throw error;
    }
  };

  const updateTodoText = async (todoId: number, newText: string) => {
    try {
      const updatedTodo = await TodoService.updateTodoText(
        todoId,
        newText.trim()
      );
      dispatch(updateTodo(updatedTodo));
      return updatedTodo;
    } catch (error) {
      console.error("Error updating Todo:", error);
      throw error;
    }
  };

  const toggleTodo = async (todoId: number, completed: boolean) => {
    try {
      const updatedTodo = await TodoService.toggleTodoStatus(todoId, completed);
      dispatch(updateTodo(updatedTodo));
      return updatedTodo;
    } catch (error) {
      console.error("Error changing Todo status:", error);
      throw error;
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      await TodoService.deleteTodo(todoId);
      dispatch(deleteTodo(todoId));
    } catch (error) {
      console.error("Error deleting Todo:", error);
      throw error;
    }
  };

  return {
    fetchTodos,
    createTodo,
    updateTodoText,
    toggleTodo,
    removeTodo,
  };
};
