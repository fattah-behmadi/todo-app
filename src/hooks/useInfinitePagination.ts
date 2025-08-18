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
  const scrollStateRef = useRef({
    isLoading: false,
    beforeLoadScrollTop: 0,
    beforeLoadScrollHeight: 0,
    beforeLoadClientHeight: 0,
  });

  const handleScroll = useCallback(() => {
    if (!containerRef.current || scrollStateRef.current.isLoading || isLoading)
      return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

    const scrollThreshold = 200;

    const isNearBottom =
      scrollHeight - scrollTop - clientHeight <= scrollThreshold;

    if (isNearBottom && hasMore) {
      // Store precise scroll state before loading
      scrollStateRef.current = {
        isLoading: true,
        beforeLoadScrollTop: scrollTop,
        beforeLoadScrollHeight: scrollHeight,
        beforeLoadClientHeight: clientHeight,
      };

      loadMore()
        .then(() => {
          if (containerRef.current) {
            setTimeout(() => {
              // Restore to the exact previous scroll position
              containerRef.current!.scrollTop =
                scrollStateRef.current.beforeLoadScrollTop;
            }, 100);
          }
        })
        .catch((error) => {
          console.error("Error loading more items:", error);
        })
        .finally(() => {
          // Reset loading state
          scrollStateRef.current.isLoading = false;
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
