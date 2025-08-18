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
