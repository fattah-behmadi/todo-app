import { Todo } from "../types/todo.types";

export const filterTodos = (
  todos: Todo[],
  filter: "all" | "completed" | "incomplete",
  searchQuery: string
): Todo[] => {
  let filtered = todos;

  // Apply status filter
  if (filter === "completed") {
    filtered = filtered.filter((todo) => todo.completed);
  } else if (filter === "incomplete") {
    filtered = filtered.filter((todo) => !todo.completed);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((todo) =>
      todo.todo.toLowerCase().includes(query)
    );
  }

  return filtered;
};

export const getCompletedCount = (todos: Todo[]): number => {
  return todos.filter((todo) => todo.completed).length;
};

export const getIncompleteCount = (todos: Todo[]): number => {
  return todos.filter((todo) => !todo.completed).length;
};

export const getTotalCount = (todos: Todo[]): number => {
  return todos.length;
};

export const sortTodos = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then sort by creation time (assuming newer items have higher IDs)
    return b.id - a.id;
  });
};
