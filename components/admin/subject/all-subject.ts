  import { useCallback, useState, useTransition } from "react";
  import { useRouter, usePathname, useSearchParams } from "next/navigation";
  import { toast } from "@/hooks/use-toast";
  import { usePagination } from "@/context/PaginationContext";
  import {
    isSearchSubjectsInfoSuccess,
    SearchSubjectsInfoSuccessType,
  } from "@/types/subject";
  import { deleteSubject } from "@/actions/subject/delete";
  import { searchSubjectsInfo } from "@/actions/subject/info";

  export type useSubjectsReturn = ReturnType<typeof useSubjects>;

  const useSubjects = (initialSubjects: SearchSubjectsInfoSuccessType) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { setTotalItems, setIsPending } = usePagination();
    const [isPending, startTransition] = useTransition();
    setTotalItems(initialSubjects?.count || 0);

    const handleDeleteSubject = async (subjectId: string) => {
      try {
        const response = await deleteSubject(subjectId);
        if ('error' in response) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Delete Subject Success",
          });
          router.refresh();
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      isPending,
      handleDeleteSubject,
    };
  };

  export default useSubjects;