import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {useAppSelector} from "../hooks/useAppSelector";
import {reorderTodos} from "../store/todoSlice";
import {filterTodos, sortTodos} from "../utils/todoUtils";
import {SortableTodoItem} from "./SortableTodoItem";
import {useAppDispatch} from "../hooks/useAppDispatch";

export const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {todos, filter, searchQuery, loading} = useAppSelector(
    (state) => state.todos
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTodos = filterTodos(todos, filter, searchQuery);
  const sortedTodos = sortTodos(filteredTodos);

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = sortedTodos.findIndex((todo) => todo.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderTodos({startIndex: oldIndex, endIndex: newIndex}));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (sortedTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {filter === "all" && !searchQuery
            ? "هنوز هیچ Todo اضافه نشده است"
            : "نتیجه‌ای یافت نشد"}
        </h3>
        <p className="text-gray-500">
          {filter === "all" && !searchQuery
            ? "اولین Todo خود را اضافه کنید تا شروع کنید"
            : "لطفاً فیلتر یا جستجو را تغییر دهید"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortedTodos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}>
          {sortedTodos.map((todo, index) => (
            <SortableTodoItem key={todo.id} todo={todo} index={index} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
