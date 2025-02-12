"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleSearchInfoSuccessType } from "@/types/roles";
import { SkeletonLoader } from "./SkeletonLoader";
import { useRolesAdmin } from "./all-roles-data";
import RolesTableRow from "./RolesTableRow";

export default function AllRoles({
  initialRoles,
  totalRoles,
}: {
  initialRoles: RoleSearchInfoSuccessType;
  totalRoles: number;
}) {
  const {
    searchTerm,
    currentPage,
    roles,
    loading,
    rolesPerPage,
    handleDeleteRole,
    handleSearch,
    handlePageChange,
  } = useRolesAdmin(initialRoles, totalRoles);

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Roles</CardTitle>
        <CardDescription>
          Manage your roles and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead className="hidden md:table-cell">
                Permissions
              </TableHead>
              <TableHead className="hidden md:table-cell">Pages</TableHead>
              <TableHead className="hidden md:table-cell">
                Users Count
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: rolesPerPage }).map((_, index) => (
                  <SkeletonLoader key={index} /> // Display skeleton loader during loading
                ))
              : roles?.roles.map(({ role, users }, index) => (
                  <RolesTableRow
                    key={index}
                    role={role}
                    handleDeleteRole={handleDeleteRole}
                    users={users}
                  />
                ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{(currentPage - 1) * rolesPerPage + 1}</strong> to{" "}
          <strong>{Math.min(currentPage * rolesPerPage, totalRoles)}</strong> of{" "}
          <strong>{totalRoles}</strong> roles
        </div>
        <Pagination className="ml-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * rolesPerPage >= totalRoles}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
