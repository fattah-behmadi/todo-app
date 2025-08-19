import { useCallback, useEffect } from "react";
import { useDragAndDrop, CustomDragEvent } from "@/plugin/Dnd-JS";
import { Todo } from "@/types/todo.types";
import { useAppStore } from "../useAppStore";

export const useTodoDragAndDrop = (
  sortedTodos: Todo[],
  incompleteContainerRef: React.RefObject<HTMLDivElement | null>,
  completedContainerRef: React.RefObject<HTMLDivElement | null>
) => {
  const { toggleTodo } = useAppStore();
  const { registerContainer, setDragEndCallback, unregisterContainer } =
    useDragAndDrop();

  const handleDragEnd = useCallback(
    async (event: CustomDragEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const draggedTodo = sortedTodos.find((todo) => todo.id === active.id);

        if (draggedTodo) {
          // Check if dropped on a container (empty column)
          if (over.id === "incomplete" || over.id === "completed") {
            const targetCompleted = over.id === "completed";

            // Only update if the completion status is different
            if (draggedTodo.completed !== targetCompleted) {
              await toggleTodo(draggedTodo.id, targetCompleted);
            }
          } else {
            // Find the target todo to determine the drop zone
            const targetTodo = sortedTodos.find((todo) => todo.id === over.id);

            if (targetTodo) {
              // Check if dragged to different completion status
              if (draggedTodo.completed !== targetTodo.completed) {
                await toggleTodo(draggedTodo.id, targetTodo.completed);
              }
            }
          }
        }
      }
    },
    [toggleTodo, sortedTodos]
  );

  // Register containers for drag and drop
  useEffect(() => {
    if (incompleteContainerRef.current) {
      registerContainer("incomplete", incompleteContainerRef.current);
    }
    if (completedContainerRef.current) {
      registerContainer("completed", completedContainerRef.current);
    }

    // Set the drag end callback
    setDragEndCallback(handleDragEnd);

    return () => {
      unregisterContainer("incomplete");
      unregisterContainer("completed");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDragEnd]);

  return { registerContainer, setDragEndCallback };
};
