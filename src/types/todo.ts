export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface CreateTodoRequest {
  todo: string;
  completed: boolean;
  userId: number;
}

export interface UpdateTodoRequest {
  todo?: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
