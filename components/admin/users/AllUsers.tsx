"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SearchUsersSuccessType } from "@/types/user";
import { RoleSearchInfo } from "@/types/roles";
import useUsers from "./all-users";
import PaginationCommon from "@/components/common/Dashboard/PaginationCommon";
import TableTopSearch from "@/components/common/Dashboard/TableTopSearch";
import UsersTable from "./UsersTable";

export default function AllUsers({
  initialUsers,
  roles,
  usersPerPage,
  error,
}: {
  initialUsers: SearchUsersSuccessType;
  roles: RoleSearchInfo;
  usersPerPage: number;
  error: React.ReactNode;
}) {
  const { isPending, handleDeleteUser } =
    useUsers(initialUsers);

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <TableTopSearch
          title={"Users"}
          description={"Manage your users and view their sales performance."}
        />
      </CardHeader>
      <CardContent>
        <UsersTable
          initialUsers={initialUsers}
          roles={roles}
          isPending={isPending}
          usersPerPage={usersPerPage}
          handleDeleteUser={handleDeleteUser}
        />
      </CardContent>
      <CardFooter>
        <PaginationCommon error={error} />
      </CardFooter>
    </Card>
  );
}
