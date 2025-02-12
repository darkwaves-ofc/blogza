import { useState } from "react";
import { searchRoles } from "@/actions/roles/info";
import { deleteRole } from "@/actions/roles/delete";
import { toast } from "@/hooks/use-toast";
import {
  isDeleteRoleInfoSuccess,
  isRoleSearchInfoSuccess,
  RoleSearchInfoSuccessType,
} from "@/types/roles";

export type useRolesAdminReturnType = ReturnType<typeof useRolesAdmin>;

export const useRolesAdmin = (
  initialRoles: RoleSearchInfoSuccessType,
  totalRoles: number
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState<RoleSearchInfoSuccessType>(
    initialRoles || []
  );
  const [loading, setLoading] = useState(false);
  const rolesPerPage = 10;

  const fetchRoles = async () => {
    setLoading(true);
    const response = await searchRoles(searchTerm, undefined, {
      roles: {
        permissions: true,
        pages: true,
        users: {
          users: {},
          count: true,
        },
      },
      limit: {
        start: (currentPage - 1) * rolesPerPage,
        end: currentPage * rolesPerPage,
      },
      count: true,
    });

    if (!isRoleSearchInfoSuccess(response)) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return;
    }

    setLoading(false);
    setRoles(response);
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const response = await deleteRole({
        id: roleId,
      });

      if (!isDeleteRoleInfoSuccess(response)) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Successfully deleted Role!",
        });
        await fetchRoles();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    fetchRoles();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchRoles();
  };

  return {
    searchTerm,
    currentPage,
    roles,
    loading,
    rolesPerPage,
    handleDeleteRole,
    handleSearch,
    handlePageChange,
  };
};
