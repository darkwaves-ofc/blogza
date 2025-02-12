"use client";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchUsersSuccessType } from "@/types/user";
import UserFormDialog from "./CreateUserForm";
import { isRoleSearchInfoSuccess, RoleSearchInfo } from "@/types/roles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SkeletonLoader } from "./SkeletonLoader";

export default function UsersTable({
  initialUsers,
  roles,
  isPending,
  usersPerPage,
  handleDeleteUser,
}: {
  initialUsers: SearchUsersSuccessType;
  roles: RoleSearchInfo;
  isPending: boolean;
  usersPerPage: number;
  handleDeleteUser: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead> */}
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">Email Verified</TableHead>
          <TableHead className="hidden md:table-cell">Created at</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending
          ? Array.from({ length: usersPerPage }).map((_, index) => (
              <SkeletonLoader key={index} /> // Display skeleton loader during loading
            ))
          : initialUsers.users?.map((user, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{user.user.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {user.user.system
                      ? "System"
                      : user.user.role
                      ? user.user.role?.name
                      : "User"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.user.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.user.emailVerified ? "Yes" : "No"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.user.createdAt.toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link href={"/dashboard/users/" + user.user.id}>
                        <DropdownMenuItem>View</DropdownMenuItem>
                      </Link>
                      {isRoleSearchInfoSuccess(roles) && (
                        <UserFormDialog user={user} roles={roles} mode="edit" />
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the user account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.user.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>{" "}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
