import { searchRoles } from "@/actions/roles/info";
import AllRoles from "@/components/admin/roles/AllRoles";
import AllUsers from "@/components/admin/users/AllUsers";
import { isRoleSearchInfoSuccess } from "@/types/roles";

export default async function page() {
  const response = await searchRoles("", undefined, {
    roles: {
      permissions: true,
      pages: true,
      users: {
        users: {},
        count: true,
      },
    },
    count: true,
  });

  if (!isRoleSearchInfoSuccess(response)) {
    return <>Error: {response.error}</>;
  }

  return (
    <AllRoles initialRoles={response} totalRoles={response.count || 0} />
  );
}
