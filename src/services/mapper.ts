import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types/todo.types";
import { CreateTodoInput, UpdateTodoInput } from "../types/validation";

export class TodoMapper {
  static toCreateRequest(input: CreateTodoInput): CreateTodoRequest {
    return {
      todo: input.todo,
      completed: input.completed,
      userId: input.userId,
    };
  }

  static toUpdateRequest(input: UpdateTodoInput): UpdateTodoRequest {
    const request: UpdateTodoRequest = {};

    if (input.todo !== undefined) {
      request.todo = input.todo;
    }

    if (input.completed !== undefined) {
      request.completed = input.completed;
    }

    return request;
  }

  static fromApiResponse(apiTodo: any): Todo {
    return {
      id: apiTodo.id,
      todo: apiTodo.todo,
      completed: apiTodo.completed,
      userId: apiTodo.userId,
    };
  }

  static fromApiResponseList(apiTodos: any[]): Todo[] {
    return apiTodos.map(this.fromApiResponse);
  }

  static toLocalStorage(todo: Todo): string {
    return JSON.stringify(todo);
  }

  static fromLocalStorage(stored: string): Todo {
    try {
      return JSON.parse(stored);
    } catch {
      throw new Error("Error reading data from local storage");
    }
  }
}
