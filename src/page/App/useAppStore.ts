import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

const TODOS_QUERY_KEY = "todos";
const LIMIT = 30;

interface TodoResponse {
  pages: { todos: Todo[]; total: number; nextPage?: number }[];
  pageParams: number[];
}

export const useAppStore = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const useTodos = () => {
    return useInfiniteQuery<TodoResponse, Error>({
      queryKey: [TODOS_QUERY_KEY],
      queryFn: async ({ pageParam = 0 }) => {
        try {
          dispatch(setLoading(true));
          const skip = Number(pageParam) * LIMIT;
          const response = await TodoService.getAllTodos(skip, LIMIT);

          return {
            ...response,
            nextPage:
              skip + response.todos.length < response.total
                ? Number(pageParam) + 1
                : undefined,
          };
        } catch (error: any) {
          const errorMessage = error.message || "Error fetching Todos";
          dispatch(setError(errorMessage));
          console.error("Error fetching Todos:", error);
          throw error;
        } finally {
          dispatch(setLoading(false));
        }
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
  };

  const fetchTodos = async () => {
    try {
      dispatch(setLoading(true));

      const todosData = await queryClient.fetchQuery<TodoResponse, Error>({
        queryKey: [TODOS_QUERY_KEY],
        queryFn: async () => ({
          pages: [
            {
              ...(await TodoService.getAllTodos(0, LIMIT)),
              nextPage: 1,
            },
          ],
          pageParams: [0],
        }),
        staleTime: 1000 * 60 * 5,
      });

      const items = todosData.pages.flatMap((page) => page.todos);

      dispatch(setTodos(items));
      return items;
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

      queryClient.setQueryData<TodoResponse>([TODOS_QUERY_KEY], (oldData) => {
        if (!oldData) return { todos: [newTodo], total: 1 };

        return {
          ...oldData,
          todos: [...oldData.todos, newTodo],
          total: oldData.total + 1,
        };
      });

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

      queryClient.setQueryData<TodoResponse>([TODOS_QUERY_KEY], (oldData) => {
        if (!oldData) return { todos: [], total: 0 };

        return {
          ...oldData,
          todos: oldData.todos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          ),
        };
      });

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

      queryClient.setQueryData<TodoResponse>([TODOS_QUERY_KEY], (oldData) => {
        if (!oldData) return { todos: [], total: 0 };

        return {
          ...oldData,
          todos: oldData.todos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          ),
        };
      });

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

      queryClient.setQueryData<TodoResponse>([TODOS_QUERY_KEY], (oldData) => {
        if (!oldData) return { todos: [], total: 0 };

        return {
          ...oldData,
          todos: oldData.todos.filter((todo) => todo.id !== todoId),
          total: oldData.total - 1,
        };
      });
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
