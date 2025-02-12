import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllPages, getAllPageGroups } from "@/lib/permission_manager";
import { useRolesFormAdminReturnType } from "./role-form.data";
export default function Pages({
  form,
  selectedPageGroups,
  handlePageGroupSelect,
}: {
  form: useRolesFormAdminReturnType["form"];
  selectedPageGroups: useRolesFormAdminReturnType["selectedPageGroups"];
  handlePageGroupSelect: useRolesFormAdminReturnType["handlePageGroupSelect"];
}) {
  return (
    <>
      <FormItem>
        <FormLabel>Page Groups</FormLabel>
        <FormDescription>
          Select page groups to automatically select pages
        </FormDescription>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {getAllPageGroups().map((group) => (
            <FormItem
              key={group}
              className="flex flex-row items-start space-x-3 space-y-0"
            >
              <FormControl>
                <Checkbox
                  checked={selectedPageGroups.includes(group)}
                  onCheckedChange={(checked) =>
                    handlePageGroupSelect(group, !!checked)
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
        name="pages"
        render={() => (
          <FormItem>
            <FormLabel>Accessible Pages</FormLabel>
            <FormDescription>Select pages this role can access</FormDescription>
            <ScrollArea className="h-[200px] w-full border rounded-md p-4">
              <div className="grid grid-cols-2 gap-2">
                {getAllPages().map((page) => (
                  <FormField
                    key={page}
                    control={form.control}
                    name="pages"
                    render={({ field }) => (
                      <FormItem
                        key={page}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(page)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, page])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== page
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{page}</FormLabel>
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
