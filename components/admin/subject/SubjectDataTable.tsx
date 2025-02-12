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
import { SubjectFormDialog } from "./SubjectForm";
import { SearchSubjectsInfoSuccessType } from "@/types/subject";

export default function SubjectDataTable({
  initialSubjects,
  isPending,
  subjectsPerPage,
  handleDeleteSubject,
}: {
  initialSubjects: SearchSubjectsInfoSuccessType;
  isPending: boolean;
  subjectsPerPage: number;
  handleDeleteSubject: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Teachers</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending
          ? Array.from({ length: subjectsPerPage }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="animate-pulse bg-gray-200 h-4"></TableCell>
                <TableCell className="hidden md:table-cell animate-pulse bg-gray-200 h-4"></TableCell>
                <TableCell className="animate-pulse bg-gray-200 h-4"></TableCell>
              </TableRow>
            ))
          : initialSubjects.subjects?.map((subject, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant="outline">
                    {subject.name}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {subject.teachers?.join(", ")}
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
                      <Link
                        href={"/dashboard/subjects/" + subject.id}
                      >
                        <DropdownMenuItem>View</DropdownMenuItem>
                      </Link>
                      <SubjectFormDialog
                        initialSubject={subject}
                      />
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
                              permanently delete the subject.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteSubject(subject.id)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
