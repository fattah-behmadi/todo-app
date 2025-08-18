import { useCallback, useRef, useEffect } from "react";

interface UseInfinitePaginationProps {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => Promise<void>;
}

export const useInfinitePagination = ({
  hasMore,
  isLoading,
  loadMore,
}: UseInfinitePaginationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoadingRef.current || isLoading) return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const scrollThreshold = 200;

    const isNearBottom =
      scrollHeight - scrollTop - clientHeight <= scrollThreshold;

    if (isNearBottom && hasMore) {
      isLoadingRef.current = true;
      const currentScrollTop = containerRef.current.scrollTop;

      loadMore()
        .then(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = currentScrollTop;
          }
          isLoadingRef.current = false;
        })
        .catch(() => {
          isLoadingRef.current = false;
        });
    }
  }, [hasMore, isLoading, loadMore]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
      return () => {
        currentContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  return {
    containerRef,
  };
};
