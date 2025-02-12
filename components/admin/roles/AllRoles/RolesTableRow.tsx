"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
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
import RoleForm from "../RoleForm";
import { useRolesAdminReturnType } from "./all-roles-data";

export default function RolesTableRow({
  role,
  handleDeleteRole,
  users,
}: {
  role: useRolesAdminReturnType["roles"]["roles"][number]["role"];
  handleDeleteRole: useRolesAdminReturnType["handleDeleteRole"];
  users: useRolesAdminReturnType["roles"]["roles"][number]["users"];
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{role.name}</TableCell>
      <TableCell>{role.name}</TableCell>
      <TableCell className="hidden md:table-cell">{role.position}</TableCell>
      <TableCell className="hidden md:table-cell">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="outline">{role.permissions.length}</Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {role.permissions.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Badge variant="outline">{role.pages.length}</Badge>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {role.pages.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {users?.count || 0}
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
            <RoleForm initialData={role} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this role.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
