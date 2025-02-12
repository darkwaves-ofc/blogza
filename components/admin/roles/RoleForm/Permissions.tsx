import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getAllPermissions,
  getAllPermissionGroups,
} from "@/lib/permission_manager";
import {
  useRolesFormAdminReturnType,
} from "./role-form.data";

export default function Permissions({
  form,
  selectedPermissionGroups,
  handlePermissionGroupSelect,
}: {
  form: useRolesFormAdminReturnType["form"];
  selectedPermissionGroups: useRolesFormAdminReturnType["selectedPermissionGroups"];
  handlePermissionGroupSelect: useRolesFormAdminReturnType["handlePermissionGroupSelect"];
}) {
  return (
    <>
      <FormItem>
        <FormLabel>Permission Groups</FormLabel>
        <FormDescription>
          Select permission groups to automatically select permissions
        </FormDescription>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {getAllPermissionGroups().map((group) => (
            <FormItem
              key={group}
              className="flex flex-row items-start space-x-3 space-y-0"
            >
              <FormControl>
                <Checkbox
                  checked={selectedPermissionGroups.includes(group)}
                  onCheckedChange={(checked) =>
                    handlePermissionGroupSelect(group, !!checked)
                  }
                />
              </FormControl>
              <FormLabel className="font-normal">{group}</FormLabel>
            </FormItem>
          ))}
        </div>
      </FormItem>

      <FormField
        control={form.control}
        name="permissions"
        render={() => (
          <FormItem>
            <FormLabel>Permissions</FormLabel>
            <FormDescription>Select permissions for this role</FormDescription>
            <ScrollArea className="h-[200px] w-full border rounded-md p-4">
              <div className="grid grid-cols-2 gap-2">
                {getAllPermissions().map((permission) => (
                  <FormField
                    key={permission}
                    control={form.control}
                    name="permissions"
                    render={({ field }) => (
                      <FormItem
                        key={permission}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(permission)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, permission])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== permission
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {permission}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
