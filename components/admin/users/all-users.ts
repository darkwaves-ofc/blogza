import { useCallback, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast, useToast } from "@/hooks/use-toast";
import { usePagination } from "@/context/PaginationContext";
import {
  isDeleteUserSuccess,
  isSearchUsersSuccess,
  SearchUsersSuccessType,
} from "@/types/user";
import { deleteUser } from "@/actions/user/delete";
import { searchUsers } from "@/actions/user/info";
import { RoleSearchInfo } from "@/types/roles";

export type useUsersReturn = ReturnType<typeof useUsers>;

const useUsers = (initialUsers: SearchUsersSuccessType) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { setTotalItems, setIsPending } = usePagination();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  setTotalItems(initialUsers?.count || 0);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await deleteUser(userId);
      if (!isDeleteUserSuccess(response)) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Delete User Success",
        });
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isPending,
    handleDeleteUser,
  };
};

export default useUsers;
