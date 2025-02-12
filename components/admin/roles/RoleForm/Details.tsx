import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useRolesFormAdminReturnType,
} from "./role-form.data";

export default function Details({
  form,
}: {
  form: useRolesFormAdminReturnType["form"];
}) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Role Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter role name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
