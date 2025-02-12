import { getNotifications } from "@/actions/notifications/info";
import { searchRoles } from "@/actions/roles/info";
import AllNotifications from "@/components/admin/notifications/AllNotifications";
import { Button } from "@/components/ui/button";
import { isRoleSearchInfoSuccess } from "@/types/roles";
import Link from "next/link";

export default async function page() {
  const notifications = await getNotifications();
  const roles = await searchRoles("", undefined, { roles: {} });
  if (!isRoleSearchInfoSuccess(roles))
    return (
      <Link href={"/dashboard/roles"}>
        <Button>Create A role</Button>
      </Link>
    );
  return <AllNotifications roles={roles.roles} initialData={notifications} />;
}
