"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductSearchInfoSuccessType } from "@/types/product";
import PaginationCommon from "@/components/common/Dashboard/PaginationCommon";
import { useCallback, useState, useTransition } from "react";
import { usePagination } from "@/context/PaginationContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function TableTopSearch({
  title,
  description,
  filters,
}: {
  title: string;
  description: string;
  filters?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { setTotalItems, setIsPending } = usePagination();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  // Create URL search params update function
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Handle search with debounce
  const handleSearch = useCallback(
    (value: string) => {
      const queryString = createQueryString({
        search: value || null,
        page: 1, // Reset to first page on new search
      });

      setIsPending(true);
      startTransition(() => {
        router.push(`${pathname}?${queryString}`, {
          scroll: false,
        });
      });
      setSearchTerm(value);
      setIsPending(false);
    },
    [router, pathname, createQueryString, setIsPending]
  );

  return (
    <>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <div className="flex items-center space-x-2">
        <input
          type="search"
          placeholder={`Search ${title}...`}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {filters && filters}
      </div>
    </>
  );
}
