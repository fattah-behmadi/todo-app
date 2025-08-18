import { Todo, TodosResponse } from "../types/todo.types";
import { CreateTodoInput, UpdateTodoInput } from "../types/validation";
import { apiProxy } from "./apiProxy";
import { TodoMapper } from "./mapper";

export class TodoService {
  private static readonly ENDPOINTS = {
    GET_ALL: "/todos",
    CREATE: "/todos/add",
    UPDATE: (id: number) => `/todos/${id}`,
    DELETE: (id: number) => `/todos/${id}`,
  };

  static async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await apiProxy.get<TodosResponse>(
        this.ENDPOINTS.GET_ALL
      );
      return TodoMapper.fromApiResponseList(response.todos);
    } catch (error) {
      console.error("Error fetching Todos:", error);
      throw error;
    }
  }

  static async createTodo(input: CreateTodoInput): Promise<Todo> {
    try {
      const request = TodoMapper.toCreateRequest(input);
      const response = await apiProxy.post<Todo>(
        this.ENDPOINTS.CREATE,
        request
      );
      return TodoMapper.fromApiResponse(response);
    } catch (error) {
      console.error("Error creating Todo:", error);
      throw error;
    }
  }

  static async updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
    try {
      const request = TodoMapper.toUpdateRequest(input);
      const response = await apiProxy.patch<Todo>(
        this.ENDPOINTS.UPDATE(id),
        request
      );
      return TodoMapper.fromApiResponse(response);
    } catch (error) {
      console.error("Error updating Todo:", error);
      throw error;
    }
  }

  static async deleteTodo(id: number): Promise<boolean> {
    try {
      await apiProxy.delete(this.ENDPOINTS.DELETE(id));
      return true;
    } catch (error) {
      console.error("Error deleting Todo:", error);
      throw error;
    }
  }

  static async toggleTodoStatus(id: number, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }

  static async updateTodoText(id: number, todo: string): Promise<Todo> {
    return this.updateTodo(id, { todo });
  }
}
