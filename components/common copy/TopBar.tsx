// components/common/TopBar.tsx

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import React from "react";
import ProfileMenu from "../ui/profile-menu";
import { Avatar } from "@radix-ui/themes";
import { cn, generateCapitalLetters } from "@/lib/utils";
import { LoginButton } from "../auth/login-button";
// import { Button } from "react-bootstrap";
import { poppins } from "@/lib/fonts";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import DynamicBreadcrumb from "./DynamicBreadcrumb";
import NotificationBell from "./notification-bell";
const TopBar: React.FC = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center py-4 gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6">
      <DynamicBreadcrumb />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <NotificationBell roleId={session?.user.roleId} />
      {session?.user ? (
        <>
          <ProfileMenu isAdmin user={session?.user}>
            <Avatar
              fallback={generateCapitalLetters(
                session.user.name || "Dark Waves",
                2
              )}
              title={session.user.name || "Dark Waves"}
            />
          </ProfileMenu>
        </>
      ) : (
        <LoginButton mode="modal" asChild>
          <Button variant="destructive" className={cn(poppins.className)}>
            Login
          </Button>
        </LoginButton>
      )}
    </header>
  );
};

export default TopBar;
