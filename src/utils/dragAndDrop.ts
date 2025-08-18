export interface CustomDragEvent {
  active: {
    id: string | number;
    rect: DOMRect;
  };
  over: {
    id: string | number;
    rect: DOMRect;
  } | null;
}

export interface DragState {
  isDragging: boolean;
  draggedId: string | number | null;
  draggedElement: HTMLElement | null;
  originalPosition: { x: number; y: number } | null;
  placeholder: HTMLElement | null;
}

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
    console.log("🏗️ REGISTERING CONTAINER:", id, "Element:", element);
    console.log("🏗️ Element attributes:", element.getAttributeNames());
    this.containers.set(id, element);
    this.setupContainerListeners(element);
    console.log("✅ Container registered successfully:", id);

    // Add global document drag over handler to prevent default behavior
    if (!this.globalDragOverHandler) {
      this.globalDragOverHandler = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("🌍 GLOBAL DRAG OVER - Target:", e.target);
        console.log("🎯 Current drag state:", this.state);
      };
      document.addEventListener("dragover", this.globalDragOverHandler);

      // Add global drop handler for debugging
      this.globalDropHandler = (e: DragEvent) => {
        console.log("🌍 GLOBAL DROP - Event:", e.type, "Target:", e.target);
        console.log("🎯 Current drag state:", this.state);

        // Don't prevent default here to allow container handlers to work
        // e.preventDefault();
      };
      document.addEventListener("drop", this.globalDropHandler);
    }
  }

  // Register a draggable element
  registerDraggable(id: string | number, element: HTMLElement): void {
    console.log("🎯 REGISTERING DRAGGABLE:", id);
    console.log("🎯 Element attributes:", element.getAttributeNames());
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
    console.log("🔧 SETTING DRAG END CALLBACK");
    this.onDragEnd = callback;
    console.log("✅ Drag end callback set successfully");
  }

  // Check if an element is being dragged
  isDragging(id: string | number): boolean {
    const isDragging = this.state.isDragging && this.state.draggedId === id;
    console.log("🎯 isDragging check for ID:", id, "Result:", isDragging);
    return isDragging;
  }

  private setupContainerListeners(container: HTMLElement): void {
    console.log(
      "🔧 SETTING UP CONTAINER LISTENERS for:",
      container.getAttribute("data-container-id")
    );

    const dragOverHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer!.dropEffect = "move";
      container.classList.add("drag-over");
      console.log(
        "📦 DRAG OVER - Container:",
        container.getAttribute("data-container-id"),
        "Mouse position:",
        e.clientX,
        e.clientY
      );
      console.log("🎯 Current drag state:", this.state);
    };

    const dropHandler = (e: DragEvent) => {
      console.log("🎯 DROP HANDLER TRIGGERED!");
      e.preventDefault();
      e.stopPropagation();
      container.classList.remove("drag-over");

      const draggedId = e.dataTransfer?.getData("text/plain");
      if (!draggedId) {
        console.log("❌ No dragged ID found in dataTransfer");
        return;
      }

      console.log(
        "🎯 DROP - Container:",
        container.getAttribute("data-container-id"),
        "Dragged ID:",
        draggedId
      );

      // Find the drop target
      const dropTarget = this.findDropTarget(e);
      console.log("🎯 Drop target found:", dropTarget);

      if (this.onDragEnd) {
        let dragEvent: CustomDragEvent;

        if (dropTarget) {
          const dropTargetId = dropTarget.getAttribute("data-draggable-id");
          const dropTargetContainerId =
            dropTarget.getAttribute("data-container-id");
          console.log("🎯 Drop target ID:", dropTargetId);
          console.log("🎯 Drop target Container ID:", dropTargetContainerId);

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

        console.log("📞 Calling onDragEnd with:", dragEvent);
        console.log("🔍 onDragEnd callback exists:", !!this.onDragEnd);
        console.log("🔍 onDragEnd callback type:", typeof this.onDragEnd);
        if (this.onDragEnd) {
          console.log("✅ Executing onDragEnd callback");
          try {
            this.onDragEnd(dragEvent);
            console.log("✅ onDragEnd callback executed successfully");
          } catch (error) {
            console.error("❌ Error executing onDragEnd callback:", error);
          }
        } else {
          console.log("❌ onDragEnd callback is null!");
        }
      } else {
        console.log("❌ onDragEnd is null - callback not set!");
      }
    };

    const dragLeaveHandler = (e: DragEvent) => {
      container.classList.remove("drag-over");
      console.log(
        "⬅️ DRAG LEAVE - Container:",
        container.getAttribute("data-container-id")
      );
      console.log("🎯 Current drag state:", this.state);
    };

    console.log(
      "🔧 Adding event listeners to container:",
      container.getAttribute("data-container-id")
    );
    container.addEventListener("dragover", dragOverHandler);
    container.addEventListener("drop", dropHandler);
    container.addEventListener("dragleave", dragLeaveHandler);
    console.log("✅ Event listeners added successfully");

    // Store handlers for cleanup
    (container as any)._dragOverHandler = dragOverHandler;
    (container as any)._dropHandler = dropHandler;
    (container as any)._dragLeaveHandler = dragLeaveHandler;
  }

  private setupDraggableListeners(
    element: HTMLElement,
    id: string | number
  ): void {
    console.log("🔧 SETTING UP DRAGGABLE LISTENERS for ID:", id);
    element.setAttribute("draggable", "true");
    element.setAttribute("data-draggable-id", id.toString());
    console.log(
      "🔧 Element attributes after setup:",
      element.getAttributeNames()
    );

    const dragStartHandler = (e: DragEvent) => {
      console.log("🟢 DRAG START - Element ID:", id);

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

      console.log(
        "✅ Drag start completed - dataTransfer set:",
        e.dataTransfer!.getData("text/plain")
      );

      // Add a small delay to ensure drag operation starts
      setTimeout(() => {
        console.log("⏰ Drag operation should be active now");
        console.log("🎯 Current drag state:", this.state);
      }, 100);
    };

    const dragEndHandler = (e: DragEvent) => {
      console.log("🔴 DRAG END - Element ID:", id);

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

      console.log("✅ Drag end cleanup completed");
      console.log("🎯 Final drag state:", this.state);
    };

    const dragHandler = (e: DragEvent) => {
      // Prevent default to allow drop
      e.preventDefault();
    };

    element.addEventListener("dragstart", dragStartHandler);
    element.addEventListener("drag", dragHandler);
    element.addEventListener("dragend", dragEndHandler);

    // Add mousedown listener to help with drag initiation
    const mouseDownHandler = (e: MouseEvent) => {
      console.log("🖱️ MOUSE DOWN - Element ID:", id, "Button:", e.button);
    };
    element.addEventListener("mousedown", mouseDownHandler);

    // Store handlers for cleanup
    (element as any)._dragStartHandler = dragStartHandler;
    (element as any)._dragHandler = dragHandler;
    (element as any)._dragEndHandler = dragEndHandler;
    (element as any)._mouseDownHandler = mouseDownHandler;
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
    if ((element as any)._mouseDownHandler) {
      element.removeEventListener(
        "mousedown",
        (element as any)._mouseDownHandler
      );
    }
  }

  private findDropTarget(e: DragEvent): HTMLElement | null {
    console.log("🔍 Finding drop target at position:", e.clientX, e.clientY);
    console.log("🔍 Event target:", e.target);
    console.log("🔍 Event currentTarget:", e.currentTarget);

    // First try the event target itself
    const target = e.target as HTMLElement;
    if (target) {
      // Check if target has container-id
      const containerId = target.getAttribute("data-container-id");
      if (containerId) {
        console.log("🎯 Found container from event target:", containerId);
        return target;
      }

      // Check if target has draggable-id
      const draggableId = target.getAttribute("data-draggable-id");
      if (draggableId) {
        console.log("🎯 Found draggable from event target:", draggableId);
        return target;
      }

      // Find closest container
      const closestContainer = target.closest("[data-container-id]");
      if (closestContainer) {
        console.log(
          "🎯 Found closest container:",
          closestContainer.getAttribute("data-container-id")
        );
        return closestContainer as HTMLElement;
      }
    }

    // Use elementsFromPoint as fallback
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    console.log(
      "🔍 Elements at drop point:",
      elements.map(
        (el) =>
          el.tagName +
          (el.getAttribute("data-container-id") ||
            el.getAttribute("data-draggable-id") ||
            "")
      )
    );

    for (const element of elements) {
      if (element instanceof HTMLElement) {
        const draggableId = element.getAttribute("data-draggable-id");
        if (draggableId) {
          console.log("🎯 Found draggable element:", draggableId);
          return element;
        }
      }
    }

    for (const element of elements) {
      if (element instanceof HTMLElement) {
        const containerId = element.getAttribute("data-container-id");
        if (containerId) {
          console.log("🎯 Found container:", containerId);
          return element;
        }
      }
    }

    console.log("❌ No drop target found");
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
