import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoader() {
    return (
      <TableRow>
        <TableCell className="font-medium">
          <Skeleton className="w-full h-5" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5" />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Skeleton className="w-full h-5" />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Skeleton className="w-full h-5" />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Skeleton className="w-full h-5" />
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
              <Link href={"#"}>
                <DropdownMenuItem>View</DropdownMenuItem>
              </Link>
              <Link href={"#"}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }
  