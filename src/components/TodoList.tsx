import React, {useState} from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
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
import {updateTodo} from "../store/todoSlice";
import {TodoService} from "../services/todoService";
import {AddTodoForm} from "./AddTodoForm";

export const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showDialog, setShowDialog] = useState<boolean>(false);
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

  // جدا کردن todos بر اساس وضعیت
  const incompleteTodos = sortedTodos.filter((todo) => !todo.completed);
  const completedTodos = sortedTodos.filter((todo) => todo.completed);

  const handleDragEnd = async (event: DragEndEvent) => {
    const {active, over} = event;

    if (over && active.id !== over.id) {
      const draggedTodo = sortedTodos.find((todo) => todo.id === active.id);

      if (draggedTodo) {
        // بررسی اینکه آیا وظیفه به ستون دیگری کشیده شده
        const isDraggedToCompleted = completedTodos.some(
          (todo) => todo.id === over.id
        );
        const isDraggedToIncomplete = incompleteTodos.some(
          (todo) => todo.id === over.id
        );

        // اگر وظیفه تکمیل نشده به ستون تکمیل شده کشیده شده
        if (!draggedTodo.completed && isDraggedToCompleted) {
          try {
            const updatedTodo = await TodoService.toggleTodoStatus(
              draggedTodo.id,
              true
            );
            dispatch(updateTodo(updatedTodo));
          } catch (error) {
            console.error("خطا در تغییر وضعیت:", error);
          }
        }
        // اگر وظیفه تکمیل شده به ستون ناتمام کشیده شده
        else if (draggedTodo.completed && isDraggedToIncomplete) {
          try {
            const updatedTodo = await TodoService.toggleTodoStatus(
              draggedTodo.id,
              false
            );
            dispatch(updateTodo(updatedTodo));
          } catch (error) {
            console.error("خطا در تغییر وضعیت:", error);
          }
        }
        // تغییر ترتیب درون همان ستون
        else {
          const oldIndex = sortedTodos.findIndex(
            (todo) => todo.id === active.id
          );
          const newIndex = sortedTodos.findIndex((todo) => todo.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            dispatch(reorderTodos({startIndex: oldIndex, endIndex: newIndex}));
          }
        }
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

  const scrollColumn = "overflow-y-auto max-h-[70vh]";

  return (
    <div className="space-y-6 grid grid-cols-2 gap-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        {/* ستون اول: وظایف تکمیل نشده */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          {/* header add task */}
          {/* <div className="space-y-4">
            <button
              className="w-full h-full px-2 py-4 border rounded-sm text-2xl cursor-pointer hover:bg-primary-600 hover:text-white"
              onClick={() => setShowDialog(!showDialog)}>
              +
            </button>
            {showDialog && <AddTodoForm />}
          </div> */}

          {/* <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
            <span>وظایف در حال انجام ({incompleteTodos.length})</span>
          </h3> */}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {/* title */}
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                <span>وظایف در حال انجام ({incompleteTodos.length})</span>
              </h3>

              {/* add button */}
              <button
                title="Add new task"
                className="w-8 h-8 p-1 border rounded-sm text-xl cursor-pointer hover:bg-primary-600 hover:text-white flex justify-center items-center"
                onClick={() => setShowDialog(!showDialog)}>
                +
              </button>
            </div>
            {showDialog && <AddTodoForm />}
          </div>

          {incompleteTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              همه وظایف تکمیل شده‌اند! 🎉
            </div>
          ) : (
            <SortableContext
              items={incompleteTodos.map((todo) => todo.id)}
              strategy={verticalListSortingStrategy}>
              <div className={`space-y-3 ${scrollColumn}`}>
                {incompleteTodos.map((todo, index) => (
                  <SortableTodoItem key={todo.id} todo={todo} index={index} />
                ))}
              </div>
            </SortableContext>
          )}
        </div>

        {/* ستون دوم: وظایف تکمیل شده */}
        <div className={`bg-white rounded-lg border border-gray-200 p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            وظایف تکمیل شده ({completedTodos.length})
          </h3>

          {completedTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              هنوز هیچ وظیفه‌ای تکمیل نشده است
            </div>
          ) : (
            <SortableContext
              items={completedTodos.map((todo) => todo.id)}
              strategy={verticalListSortingStrategy}>
              <div className={`space-y-3 ${scrollColumn}`}>
                {completedTodos.map((todo, index) => (
                  <SortableTodoItem key={todo.id} todo={todo} index={index} />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </DndContext>
    </div>
  );
};
