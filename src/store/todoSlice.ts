import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types/todo';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'completed' | 'incomplete';
  searchQuery: string;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    toggleTodoStatus: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilter: (state, action: PayloadAction<'all' | 'completed' | 'incomplete'>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    reorderTodos: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      const { startIndex, endIndex } = action.payload;
      const [removed] = state.todos.splice(startIndex, 1);
      state.todos.splice(endIndex, 0, removed);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
  setLoading,
  setError,
  setFilter,
  setSearchQuery,
  reorderTodos,
  clearError,
} = todoSlice.actions;

export default todoSlice.reducer;
