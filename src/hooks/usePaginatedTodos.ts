import { useState, useCallback, useEffect } from "react";
import { TodoService } from "../services/todoService";
import { setTodos, addTodos } from "../store/todoSlice";
import { useAppDispatch } from "@/store/useAppDispatch";
import { useAppSelector } from "@/store/useAppSelector";

export const usePaginatedTodos = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.todos);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 30;

  const fetchTodos = useCallback(
    async (shouldReset = false) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const skip = shouldReset ? 0 : page * limit;
        const response = await TodoService.getAllTodos(skip, limit);

        if (shouldReset) {
          dispatch(setTodos(response.todos));
        } else {
          dispatch(addTodos(response.todos));
        }

        const newHasMore = skip + response.todos.length < response.total;
        setHasMore(newHasMore);

        if (response.todos.length > 0) {
          setPage((prevPage) => (shouldReset ? 1 : prevPage + 1));
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [page, limit, dispatch, isLoading]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) return fetchTodos();

    // Return a resolved promise if no loading is needed
    return Promise.resolve();
  }, [fetchTodos, hasMore, isLoading]);

  useEffect(() => {
    fetchTodos(true);
  }, []);

  return {
    todos,
    isLoading,
    hasMore,
    loadMore,
  };
};
