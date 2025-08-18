import { useInfiniteQuery } from "@tanstack/react-query";
import { TodoService } from "@/services/todoService";
import { useAppDispatch } from "@/store/useAppDispatch";
import { setTodos } from "@/store/todoSlice";
import { useState, useEffect } from "react";
import { Todo } from "@/types/todo.types";

const TODOS_QUERY_KEY = "todos";
const LIMIT = 30;

interface TodoResponse {
  todos: Todo[];
  total: number;
  nextPage?: number;
}

const useTodoQuery = () => {
  const dispatch = useAppDispatch();

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, error } =
    useInfiniteQuery<TodoResponse, Error>({
      queryKey: [TODOS_QUERY_KEY],
      queryFn: async ({ pageParam = 0 }) => {
        const skip = Number(pageParam) * LIMIT;
        const response = await TodoService.getAllTodos(skip, LIMIT);
        return {
          ...response,
          nextPage:
            skip + response.todos.length < response.total
              ? Number(pageParam) + 1
              : undefined,
        };
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage;
      },
      staleTime: 1000 * 60 * 5,
    });

  useEffect(() => {
    if (data?.pages) {
      const allTodos = data.pages.flatMap((page) => page.todos);
      dispatch(setTodos(allTodos));
    }
  }, [data, dispatch]);

  const loadMore = async () => {
    if (hasNextPage && !isFetching) {
      await fetchNextPage();
    }
  };

  return {
    todos: data?.pages.flatMap((page) => page.todos) || [],
    isLoading,
    isFetching,
    hasMore: hasNextPage || false,
    loadMore,
    error,
  };
};

export const useInitialTodoLoad = () => {
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const todoQuery = useTodoQuery();

  useEffect(() => {
    if (!todoQuery.isLoading) {
      setIsInitialLoadComplete(true);
    }
  }, [todoQuery.isLoading]);

  return {
    ...todoQuery,
    isInitialLoadComplete,
  };
};
