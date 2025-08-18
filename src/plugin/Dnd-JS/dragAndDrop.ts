import { CustomDragEvent, DragState } from "./dragAndDrop.type";

class DragAndDropManager {
  private state: DragState = {
    isDragging: false,
    draggedId: null,
    draggedElement: null,
    originalPosition: null,
    placeholder: null,
  };

  private containers: Map<string, HTMLElement> = new Map();
  private draggableElements: Map<string | number, HTMLElement> = new Map();
  private onDragEnd: ((event: CustomDragEvent) => void) | null = null;
  private globalDragOverHandler: ((e: DragEvent) => void) | null = null;
  private globalDropHandler: ((e: DragEvent) => void) | null = null;

  // Register a container (column) for drop zones
  registerContainer(id: string, element: HTMLElement): void {
    this.containers.set(id, element);
    this.setupContainerListeners(element);

    // Add global document drag over handler to prevent default behavior
    if (!this.globalDragOverHandler) {
      this.globalDragOverHandler = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      document.addEventListener("dragover", this.globalDragOverHandler);

      // Add global drop handler for debugging
      this.globalDropHandler = (_e: DragEvent) => {
        // Don't prevent default here to allow container handlers to work
        // e.preventDefault();
      };
      document.addEventListener("drop", this.globalDropHandler);
    }
  }

  // Register a draggable element
  registerDraggable(id: string | number, element: HTMLElement): void {
    this.draggableElements.set(id, element);
    this.setupDraggableListeners(element, id);
  }

  // Unregister a draggable element
  unregisterDraggable(id: string | number): void {
    const element = this.draggableElements.get(id);
    if (element) {
      this.removeDraggableListeners(element);
      this.draggableElements.delete(id);
    }
  }

  // Unregister a container
  unregisterContainer(id: string): void {
    const container = this.containers.get(id);
    if (container) {
      this.removeContainerListeners(container);
      this.containers.delete(id);
    }
  }

  // Set the drag end callback
  setDragEndCallback(callback: (event: CustomDragEvent) => void): void {
    this.onDragEnd = callback;
  }

  // Check if an element is being dragged
  isDragging(id: string | number): boolean {
    return this.state.isDragging && this.state.draggedId === id;
  }

  private setupContainerListeners(container: HTMLElement): void {
    const dragOverHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer!.dropEffect = "move";
      container.classList.add("drag-over");
    };

    const dropHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      container.classList.remove("drag-over");

      const draggedId = e.dataTransfer?.getData("text/plain");
      if (!draggedId) {
        return;
      }

      // Find the drop target
      const dropTarget = this.findDropTarget(e);

      if (this.onDragEnd) {
        let dragEvent: CustomDragEvent;

        if (dropTarget) {
          const dropTargetId = dropTarget.getAttribute("data-draggable-id");
          const dropTargetContainerId =
            dropTarget.getAttribute("data-container-id");

          if (dropTargetId) {
            // Dropped on another draggable item
            dragEvent = {
              active: {
                id: isNaN(Number(draggedId)) ? draggedId : Number(draggedId),
                rect: dropTarget.getBoundingClientRect(),
              },
              over: {
                id: isNaN(Number(dropTargetId))
                  ? dropTargetId
                  : Number(dropTargetId),
                rect: dropTarget.getBoundingClientRect(),
              },
            };
          } else if (dropTargetContainerId) {
            // Dropped on a container (empty column)
            dragEvent = {
              active: {
                id: isNaN(Number(draggedId)) ? draggedId : Number(draggedId),
                rect: dropTarget.getBoundingClientRect(),
              },
              over: {
                id: dropTargetContainerId,
                rect: dropTarget.getBoundingClientRect(),
              },
            };
          } else {
            // Fallback: dropped on the container itself
            dragEvent = {
              active: {
                id: isNaN(Number(draggedId)) ? draggedId : Number(draggedId),
                rect: container.getBoundingClientRect(),
              },
              over: {
                id: "container",
                rect: container.getBoundingClientRect(),
              },
            };
          }
        } else {
          // Fallback: dropped on the container itself
          const containerId = container.getAttribute("data-container-id");
          dragEvent = {
            active: {
              id: isNaN(Number(draggedId)) ? draggedId : Number(draggedId),
              rect: container.getBoundingClientRect(),
            },
            over: {
              id: containerId || "container",
              rect: container.getBoundingClientRect(),
            },
          };
        }

        if (this.onDragEnd) {
          this.onDragEnd(dragEvent);
        }
      }
    };

    const dragLeaveHandler = (_e: DragEvent) => {
      container.classList.remove("drag-over");
    };

    container.addEventListener("dragover", dragOverHandler);
    container.addEventListener("drop", dropHandler);
    container.addEventListener("dragleave", dragLeaveHandler);

    // Store handlers for cleanup
    (container as any)._dragOverHandler = dragOverHandler;
    (container as any)._dropHandler = dropHandler;
    (container as any)._dragLeaveHandler = dragLeaveHandler;
  }

  private setupDraggableListeners(
    element: HTMLElement,
    id: string | number
  ): void {
    element.setAttribute("draggable", "true");
    element.setAttribute("data-draggable-id", id.toString());

    const dragStartHandler = (e: DragEvent) => {
      this.state.isDragging = true;
      this.state.draggedId = id;
      this.state.draggedElement = element;

      // Set drag data
      e.dataTransfer!.setData("text/plain", id.toString());
      e.dataTransfer!.effectAllowed = "move";

      // Set drag image
      const rect = element.getBoundingClientRect();
      e.dataTransfer!.setDragImage(element, rect.width / 2, rect.height / 2);

      // Add dragging styles
      element.style.opacity = "0.5";
      element.style.transform = "rotate(5deg)";
      element.style.zIndex = "1000";
    };

    const dragEndHandler = (_e: DragEvent) => {
      // Reset styles
      if (this.state.draggedElement) {
        this.state.draggedElement.style.opacity = "";
        this.state.draggedElement.style.transform = "";
        this.state.draggedElement.style.zIndex = "";
      }

      // Reset state
      this.state = {
        isDragging: false,
        draggedId: null,
        draggedElement: null,
        originalPosition: null,
        placeholder: null,
      };

      // Remove drag-over classes from all containers
      this.containers.forEach((container) => {
        container.classList.remove("drag-over");
      });
    };

    const dragHandler = (e: DragEvent) => {
      // Prevent default to allow drop
      e.preventDefault();
    };

    element.addEventListener("dragstart", dragStartHandler);
    element.addEventListener("drag", dragHandler);
    element.addEventListener("dragend", dragEndHandler);

    // Store handlers for cleanup
    (element as any)._dragStartHandler = dragStartHandler;
    (element as any)._dragHandler = dragHandler;
    (element as any)._dragEndHandler = dragEndHandler;
  }

  private removeContainerListeners(container: HTMLElement): void {
    if ((container as any)._dragOverHandler) {
      container.removeEventListener(
        "dragover",
        (container as any)._dragOverHandler
      );
    }
    if ((container as any)._dropHandler) {
      container.removeEventListener("drop", (container as any)._dropHandler);
    }
    if ((container as any)._dragLeaveHandler) {
      container.removeEventListener(
        "dragleave",
        (container as any)._dragLeaveHandler
      );
    }
  }

  private removeDraggableListeners(element: HTMLElement): void {
    if ((element as any)._dragStartHandler) {
      element.removeEventListener(
        "dragstart",
        (element as any)._dragStartHandler
      );
    }
    if ((element as any)._dragHandler) {
      element.removeEventListener("drag", (element as any)._dragHandler);
    }
    if ((element as any)._dragEndHandler) {
      element.removeEventListener("dragend", (element as any)._dragEndHandler);
    }
  }

  private findDropTarget(e: DragEvent): HTMLElement | null {
    // First try the event target itself
    const target = e.target as HTMLElement;
    if (target) {
      // Check if target has container-id
      const containerId = target.getAttribute("data-container-id");
      if (containerId) {
        return target;
      }

      // Check if target has draggable-id
      const draggableId = target.getAttribute("data-draggable-id");
      if (draggableId) {
        return target;
      }

      // Find closest container
      const closestContainer = target.closest("[data-container-id]");
      if (closestContainer) {
        return closestContainer as HTMLElement;
      }
    }

    // Use elementsFromPoint as fallback
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    for (const element of elements) {
      if (element instanceof HTMLElement) {
        const draggableId = element.getAttribute("data-draggable-id");
        if (draggableId) {
          return element;
        }
      }
    }

    for (const element of elements) {
      if (element instanceof HTMLElement) {
        const containerId = element.getAttribute("data-container-id");
        if (containerId) {
          return element;
        }
      }
    }

    return null;
  }

  destroy(): void {
    // Clean up all containers
    this.containers.forEach((container) => {
      this.removeContainerListeners(container);
    });

    // Clean up all draggable elements
    this.draggableElements.forEach((element) => {
      this.removeDraggableListeners(element);
    });

    this.containers.clear();
    this.draggableElements.clear();
    this.onDragEnd = null;

    // Clean up global handlers
    if (this.globalDragOverHandler) {
      document.removeEventListener("dragover", this.globalDragOverHandler);
      this.globalDragOverHandler = null;
    }
    if (this.globalDropHandler) {
      document.removeEventListener("drop", this.globalDropHandler);
      this.globalDropHandler = null;
    }
  }
}

// Export singleton instance
export const dragAndDropManager = new DragAndDropManager();
