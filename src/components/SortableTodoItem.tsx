import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';

interface SortableTodoItemProps {
  todo: Todo;
  index: number;
}

export const SortableTodoItem: React.FC<SortableTodoItemProps> = ({ todo, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'z-50' : ''}`}
    >
      <TodoItem todo={todo} index={index} dragListeners={listeners} dragAttributes={attributes} />
    </div>
  );
};
