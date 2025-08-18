import { useEffect, useRef, useCallback } from "react";
import { dragAndDropManager, CustomDragEvent } from "../utils/dragAndDrop";

export const useDragAndDrop = () => {
  const containerRefs = useRef<Map<string, HTMLElement>>(new Map());
  const draggableRefs = useRef<Map<string | number, HTMLElement>>(new Map());

  // Register a container (column) for drop zones
  const registerContainer = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (!element) return;

      containerRefs.current.set(id, element);
      dragAndDropManager.registerContainer(id, element);
    },
    []
  );

  // Register a draggable element
  const registerDraggable = useCallback(
    (id: string | number, element: HTMLElement | null) => {
      if (!element) return;

      draggableRefs.current.set(id, element);
      dragAndDropManager.registerDraggable(id, element);
    },
    []
  );

  // Unregister elements when components unmount
  const unregisterDraggable = useCallback((id: string | number) => {
    draggableRefs.current.delete(id);
    dragAndDropManager.unregisterDraggable(id);
  }, []);

  const unregisterContainer = useCallback((id: string) => {
    containerRefs.current.delete(id);
    dragAndDropManager.unregisterContainer(id);
  }, []);

  // Set the drag end callback
  const setDragEndCallback = useCallback(
    (callback: (event: CustomDragEvent) => void) => {
      dragAndDropManager.setDragEndCallback(callback);
    },
    []
  );

  // Check if an element is being dragged
  const isDragging = useCallback((id: string | number): boolean => {
    return dragAndDropManager.isDragging(id);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up all registered elements
      containerRefs.current.forEach((_, id) => {
        dragAndDropManager.unregisterContainer(id);
      });
      draggableRefs.current.forEach((_, id) => {
        dragAndDropManager.unregisterDraggable(id);
      });
    };
  }, []);

  return {
    registerContainer,
    registerDraggable,
    unregisterDraggable,
    unregisterContainer,
    setDragEndCallback,
    isDragging,
  };
};
