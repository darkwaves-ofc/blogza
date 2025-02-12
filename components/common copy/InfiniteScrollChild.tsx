import { useInfiniteScroll } from "@/providers/InfiniteScrollProvider";
import React, { useRef, useEffect } from "react";

interface InfiniteScrollChildProps {
  item: any; // Item to render
  isLastItem: boolean; // Indicates whether this is the last item
  children:React.ReactNode
}

export const InfiniteScrollChild: React.FC<InfiniteScrollChildProps> = ({
  item,
  isLastItem,
  children,
}) => {
  const { handleLoadMore } = useInfiniteScroll();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  // Use IntersectionObserver to trigger loading more items
  useEffect(() => {
    if (!isLastItem || !itemRef.current) return;

    // Initialize the observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "100px" }
    );

    const observer = observerRef.current;
    observer.observe(itemRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isLastItem, handleLoadMore]);

  return (
    <div ref={itemRef}>
      {children}
    </div>
  );
};
