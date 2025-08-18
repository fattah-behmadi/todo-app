import { TodoService } from "@/services/todoService";
import { useQuery } from "@tanstack/react-query";

type Post = {
  id: number;
  title: string;
  body: string;
};
export const useAppStore = () => {
  function getTodos() {
    // dispatch(setLoading(true));
    // const todosData = await TodoService.getAllTodos();
    // dispatch(setTodos(todosData));

    return useQuery({
      queryKey: ["todos"],
      queryFn: TodoService.getAllTodos,
    });
  }
};
