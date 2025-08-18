import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "@/services/todoService";
import { useAppDispatch } from "@/store/useAppDispatch";
import {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  setLoading,
  setError,
  toggleTodoStatus,
} from "@/store/todoSlice";
import { CreateTodoInput, CreateTodoSchema } from "@/types/validation";
import { Todo } from "@/types/todo.types";

export const useAppStore = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const useTodos = () => {
    return useQuery<Todo[], Error>({
      queryKey: ["todos"],
      queryFn: async () => {
        try {
          dispatch(setLoading(true));
          const todosData = await TodoService.getAllTodos();
          dispatch(setTodos(todosData.todos));
          return todosData.todos;
        } catch (error: any) {
          const errorMessage = error.message || "Error fetching Todos";
          dispatch(setError(errorMessage));
          console.error("Error fetching Todos:", error);
          throw error;
        } finally {
          dispatch(setLoading(false));
        }
      },
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
  };

  const fetchTodos = async () => {
    try {
      dispatch(setLoading(true));

      const todosData = await queryClient.fetchQuery<Todo[], Error>({
        queryKey: ["todos"],
        queryFn: async () => {
          const data = await TodoService.getAllTodos();
          return data.todos;
        },
        staleTime: 1000 * 60 * 5,
      });

      dispatch(setTodos(todosData));
      return todosData;
    } catch (error: any) {
      const errorMessage = error.message || "Error fetching Todos";
      dispatch(setError(errorMessage));
      console.error("Error fetching Todos:", error);
      throw error;
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

      queryClient.setQueryData<Todo[]>(["todos"], (oldTodos) =>
        oldTodos ? [...oldTodos, newTodo] : [newTodo]
      );

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

      queryClient.setQueryData<Todo[]>(
        ["todos"],
        (oldTodos) =>
          oldTodos?.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          ) || []
      );

      return updatedTodo;
    } catch (error) {
      console.error("Error updating Todo:", error);
      throw error;
    }
  };

  const toggleTodo = async (todoId: number, completed: boolean) => {
    try {
      const updatedTodo = await TodoService.toggleTodoStatus(todoId, completed);

      dispatch(toggleTodoStatus(todoId));

      queryClient.setQueryData<Todo[]>(
        ["todos"],
        (oldTodos) =>
          oldTodos?.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          ) || []
      );

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

      queryClient.setQueryData<Todo[]>(
        ["todos"],
        (oldTodos) => oldTodos?.filter((todo) => todo.id !== todoId) || []
      );
    } catch (error) {
      console.error("Error deleting Todo:", error);
      throw error;
    }
  };

  return {
    useTodos,
    fetchTodos,
    createTodo,
    updateTodoText,
    toggleTodo,
    removeTodo,
  };
};
