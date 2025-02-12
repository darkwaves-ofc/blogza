import React, { useState, useRef, useCallback } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/PopOver";
import { toast } from "@/hooks/use-toast";

const DEBOUNCE_MS = 300;

interface SearchResult {
  id: string;
  name: string;
}

// Base search data interface with required limit
export interface BaseSearchData {
  limit: {
    start: number;
    end: number;
  };
}

interface SearchAndSelectCommonProps<T extends BaseSearchData = BaseSearchData> {
  onSelect: (id: string) => void;
  searchFunction: (
    query: string,
    _data: T,
    filters?: undefined
  ) => Promise<any | { error: string }>;
  placeholder?: string;
  className?: string;
  limit?: number;
  mapResults?: (data: any) => SearchResult[];
  additionalData?: Omit<T, keyof BaseSearchData>; // Additional data excluding the base fields
}

export default function SearchAndSelectCommon<T extends BaseSearchData>({
  onSelect,
  searchFunction,
  placeholder = "Search...",
  className,
  limit = 5,
  mapResults = (data) =>
    data.items?.map((item: any) => ({
      id: item.id,
      name: item.name,
    })) || [],
  additionalData = {} as Omit<T, keyof BaseSearchData>,
}: SearchAndSelectCommonProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const searchData = {
          limit: { start: 0, end: limit },
          ...additionalData,
        } as T;

        const results = await searchFunction(query, searchData);

        if (!("error" in results)) {
          const mappedItems = mapResults(results);
          setItems(mappedItems);
        } else {
          toast({
            title: "Error",
            description: results.error || "Search failed",
            variant: "destructive",
          });
          setItems([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [searchFunction, limit, mapResults, additionalData]
  );

  const debouncedSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        handleSearch(query);
      }, DEBOUNCE_MS);
    },
    [handleSearch]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? items.find((item) => item.id === value)?.name || placeholder
            : placeholder}
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={debouncedSearch}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center text-sm">Searching...</div>
            )}
            {!loading && items.length === 0 && searchQuery && (
              <div className="py-6 text-center text-sm">No results found.</div>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className="relative flex cursor-pointer hover:bg-accent gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => {
                  setValue(item.id);
                  onSelect(item.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}