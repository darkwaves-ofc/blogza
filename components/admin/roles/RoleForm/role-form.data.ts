import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createRole } from "@/actions/roles/create";
import { updateRole } from "@/actions/roles/update";
import { toast } from "@/hooks/use-toast";
import {
  isCreateRoleInfoSuccess,
  isUpdateRoleInfoSuccess,
  RoleSearchInfoSuccessType,
} from "@/types/roles";
import { pagesGroups, permissionsGroups } from "@/lib/permission_manager";

const roleSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Role name must be at least 2 characters" }),
  pages: z.array(z.string()).min(1, { message: "Select at least one page" }),
  permissions: z
    .array(z.string())
    .min(1, { message: "Select at least one permission" }),
  position: z.optional(z.number()),
});

export const useRolesFormAdmin = (
  initialData?: RoleSearchInfoSuccessType["roles"][number]["role"]
) => {
  const [open, setOpen] = useState(false);
  const [selectedPageGroups, setSelectedPageGroups] = useState<string[]>([]);
  const [selectedPermissionGroups, setSelectedPermissionGroups] = useState<
    string[]
  >([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      name: "",
      pages: [],
      permissions: [],
      position: undefined,
    },
  });

  const handlePageGroupSelect = (group: string, checked: boolean) => {
    const groupPages = (pagesGroups.find((g) => g.name === group)?.pages ||
      []) as string[];

    const currentPages = form.getValues("pages");
    const newPages = checked
      ? Array.from(new Set([...currentPages, ...groupPages]))
      : currentPages.filter((page: string) => !groupPages.includes(page));

    form.setValue("pages", newPages);

    setSelectedPageGroups((prev) =>
      checked ? [...prev, group] : prev.filter((g) => g !== group)
    );
  };

  const handlePermissionGroupSelect = (group: string, checked: boolean) => {
    const groupPermissions = (permissionsGroups.find((g) => g.name === group)
      ?.permissions || []) as string[];

    const currentPermissions = form.getValues("permissions");
    const newPermissions = checked
      ? Array.from(new Set([...currentPermissions, ...groupPermissions]))
      : currentPermissions.filter((perm) => !groupPermissions.includes(perm));

    form.setValue("permissions", newPermissions);

    setSelectedPermissionGroups((prev) =>
      checked ? [...prev, group] : prev.filter((g) => g !== group)
    );
  };

  const onSubmit = async (data: z.infer<typeof roleSchema>) => {
    try {
      if (!initialData) {
        const result = await createRole({
          ...data,
          permissions: [...selectedPageGroups, ...selectedPermissionGroups],
        });

        if (!isCreateRoleInfoSuccess(result)) {
          console.error(result.error);
          toast({
            title: "Role Create Error",
            description: result.error,
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Success",
            description: "Role created successfully",
          });
        }
      } else {
        const result = await updateRole({
          ...data,
          id: initialData.id,
          permissions: [...selectedPageGroups, ...selectedPermissionGroups],
        });
        if (!isUpdateRoleInfoSuccess(result)) {
          console.error(result.error);
          toast({
            title: "Role Update Error",
            description: result.error,
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Success",
            description: "Role Update successfully",
          });
          router.refresh();
        }
      }

      form.reset();
      setSelectedPageGroups([]);
      setSelectedPermissionGroups([]);
      setOpen(false);
    } catch (error) {
      console.error("Submission error", error);
    }
  };

  return {
    open,
    setOpen,
    form,
    selectedPageGroups,
    selectedPermissionGroups,
    handlePageGroupSelect,
    handlePermissionGroupSelect,
    onSubmit,
  };
};

export type useRolesFormAdminReturnType = ReturnType<typeof useRolesFormAdmin>;
