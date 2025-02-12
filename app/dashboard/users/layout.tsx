import { searchRoles } from "@/actions/roles/info";
import CreateUserDialog from "@/components/admin/users/CreateUserForm";
import { Button } from "@/components/ui/button";
import { isRoleSearchInfoSuccess } from "@/types/roles";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const roles = await searchRoles("", undefined, {
    roles: {},
  });
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="user-manager-header-actions flex flex-row gap-2">
            {isRoleSearchInfoSuccess(roles) && (
              <CreateUserDialog mode="create" roles={roles} />
            )}

            <Link href={"/dashboard/roles"}>
              <Button>Roles</Button>
            </Link>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
