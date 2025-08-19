import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAppSelector } from "@/store/useAppSelector";
import { filterTodos, sortTodos } from "@/utils/todoUtils";
import { useInitialTodoLoad } from "@/hooks/useTodoQuery";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Loading } from "@/components/Loading";
import { TodoColumn } from "./TodoColumn";
import { EmptyState } from "./EmptyState";
import { AddTodoForm } from "./AddTodoForm";
import { useTodoDragAndDrop } from "../hooks/useTodoDragAndDrop";

export const TodoList: React.FC = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const {
    todos: paginatedTodos,
    isLoading,
    fetchNextPage,
  } = useInitialTodoLoad();
  const { filter, searchQuery, loading } = useAppSelector(
    (state) => state.todos
  );

  const incompleteContainerRef = useRef<HTMLDivElement | null>(null);
  const completedContainerRef = useRef<HTMLDivElement | null>(null);
  const incompleteScrollRef = useRef<HTMLDivElement | null>(null);
  const completeScrollRef = useRef<HTMLDivElement | null>(null);

  const filteredTodos = useMemo(
    () => filterTodos(paginatedTodos, filter, searchQuery),
    [paginatedTodos, filter, searchQuery]
  );
  const sortedTodos = useMemo(() => sortTodos(filteredTodos), [filteredTodos]);

  // Separate todos based on status
  const incompleteTodos = sortedTodos.filter((todo) => !todo.completed);
  const completedTodos = sortedTodos.filter((todo) => todo.completed);

  const {
    isIntersecting: isIntersectingIncomplete,
    ref: incompleteContainerScrollRef,
  } = useIntersectionObserver({
    threshold: 0.5,
  });

  const {
    isIntersecting: isIntersectingCompleted,
    ref: completedContainerScrollRef,
  } = useIntersectionObserver({
    threshold: 0.5,
  });

  // Initialize drag and drop
  useTodoDragAndDrop(
    sortedTodos,
    incompleteContainerRef,
    completedContainerRef
  );

  useEffect(() => {
    if (isIntersectingIncomplete || isIntersectingCompleted) {
      const scrollTopInCompleted = incompleteScrollRef.current?.scrollTop;
      const scrollTopCompleted = completeScrollRef.current?.scrollTop;
      fetchNextPage().then(() => {
        setTimeout(() => {
          if (incompleteScrollRef.current && isIntersectingIncomplete) {
            incompleteScrollRef.current.scrollTop = scrollTopInCompleted ?? 0;
          }
          if (completeScrollRef.current && isIntersectingCompleted) {
            completeScrollRef.current.scrollTop = scrollTopCompleted ?? 0;
          }
        }, 50);
      });
    }
  }, [isIntersectingIncomplete, isIntersectingCompleted, fetchNextPage]);

  if (loading || isLoading) return <Loading />;

  if (sortedTodos.length === 0) {
    return <EmptyState filter={filter} searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-6 grid grid-cols-2 gap-6">
      {/* Incomplete tasks column */}
      <TodoColumn
        title="Tasks in Progress"
        todos={incompleteTodos}
        color="bg-yellow-400"
        containerRef={incompleteContainerRef}
        scrollRef={incompleteScrollRef}
        intersectionRef={incompleteContainerScrollRef}
        isIntersecting={isIntersectingIncomplete}
        isEmptyMessage="All tasks completed! 🎉"
        showAddButton={true}
        onAddClick={() => setShowDialog(!showDialog)}
      >
        {showDialog && <AddTodoForm />}
      </TodoColumn>

      {/* Completed tasks column */}
      <TodoColumn
        title="Completed Tasks"
        todos={completedTodos}
        color="bg-green-400"
        containerRef={completedContainerRef}
        scrollRef={completeScrollRef}
        intersectionRef={completedContainerScrollRef}
        isIntersecting={isIntersectingCompleted}
        isEmptyMessage="No tasks have been completed yet"
      />
    </div>
  );
};
