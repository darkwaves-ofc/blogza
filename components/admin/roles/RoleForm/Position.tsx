import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRolesFormAdminReturnType } from "./role-form.data";

export default function Position({
  form,
}: {
  form: useRolesFormAdminReturnType["form"];
}) {
  return (
    <FormField
      control={form.control}
      name="position"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Position (Optional)</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter role position"
              {...field}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </FormControl>
          <FormDescription>
            Specify a position for sorting roles (optional)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
