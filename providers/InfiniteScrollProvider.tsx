import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Infinite Scroll Context
const InfiniteScrollContext = createContext<any>(null);

// Provider to handle loading more items
/**
 * The `InfiniteScrollProvider` is a React component that provides the necessary
 * state and functionality for implementing an infinite scrolling feature in a
 * React application.
 *
 * The provider component takes in the following props:
 *
 * - `loadMore`: A function that is called to load more items when the user
 *   scrolls to the bottom of the page. This function should return a Promise
 *   that resolves to an array of new items.
 * - `initialItems`: An array of initial items to be displayed.
 * - `hasMore`: A boolean flag indicating whether there are more items to be
 *   loaded.
 * - `children`: The child components that will consume the infinite scroll
 *   context.
 *
 * The provider component manages the state of the loaded items, the loading
 * state, and the last loaded item ID. It also provides a `handleLoadMore`
 * function that can be used to trigger the loading of more items.
 *
 * The `useInfiniteScroll` custom hook can be used by child components to access
 * the infinite scroll context and its associated state and functions.
 */
export const InfiniteScrollProvider: React.FC<{
  loadMore: (lastId: string) => Promise<any>; // Function to load more items
  initialItems: any[];
  hasMore: boolean; // Boolean flag to check if there are more items to load
  children: React.ReactNode;
}> = ({ loadMore, initialItems, hasMore, children }) => {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState<string | null>(null);

  // Function to load more data when requested
  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const newItems = await loadMore(lastId || items[items.length - 1].id);
      setItems((prevItems) => [...prevItems, ...newItems]);
      if (newItems.length > 0) {
        setLastId(newItems[newItems.length - 1].id);
      }
    } finally {
      setLoading(false);
    }
  }, [loadMore, lastId, items, loading, hasMore]);

  return (
    <InfiniteScrollContext.Provider value={{ items, loading, handleLoadMore }}>
      {children}
    </InfiniteScrollContext.Provider>
  );
};

// Custom hook to use the infinite scroll context
/**
 * A custom React hook that provides access to the InfiniteScrollContext.
 * This hook allows components to use the state and functionality provided by the InfiniteScrollProvider.
 * @returns An object containing the `items`, `loading`, and `handleLoadMore` properties from the InfiniteScrollContext.
 */
export const useInfiniteScroll = () => {
  return useContext(InfiniteScrollContext);
};
