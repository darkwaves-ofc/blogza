import RoleForm from "@/components/admin/roles/RoleForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, User2 } from "lucide-react";
import Link from "next/link";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="user-manager-header-actions flex flex-row gap-2">
        <RoleForm/>
        <Link href={"/dashboard/users"}>
          <Button>
            <User2 className="h-3.5 w-3.5" />
            Create a User
          </Button>
        </Link>
      </div>
      {children}
    </main>
  );
}
