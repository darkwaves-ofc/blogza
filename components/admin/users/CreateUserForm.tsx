"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, UserPlus } from "lucide-react";
import { createUser } from "@/actions/user/create";
import { updateUserDetails } from "@/actions/user/update"; // Add this import
import {
  isCreateUserSuccess,
  isUpdateUserDetailsSuccess,
  SearchUsersSuccessType,
} from "@/types/user";
import { toast } from "@/hooks/use-toast";
import { RoleSearchInfoSuccessType } from "@/types/roles";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
// Zod schema for user form
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.optional(
    z.string().min(8, { message: "Password must be at least 8 characters" })
  ), // Make password optional for editing
  roleId: z.optional(z.string()),
  system: z.boolean(),
});

interface UserFormDialogProps {
  roles: RoleSearchInfoSuccessType;
  user?: SearchUsersSuccessType["users"][number]; // Optional user data for editing
  mode: "create" | "edit";
}

export const UserFormDialog = ({ roles, user, mode }: UserFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.user.name || "",
      email: user?.user.email || "",
      password: undefined,
      roleId: user?.user.roleId || "",
      system: user?.user.system || false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    try {
      let response;

      if (mode === "create") {
        if (!values.password) {
          toast({
            title: "Password Not Provided",
            variant: "destructive",
          });

          return;
        }

        response = await createUser(
          {
            ...values,
            password: values.password,
          },
          undefined
        );
        if (!isCreateUserSuccess(response)) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
          return;
        }
      } else {
        // Only send password if it's provided
        const updateData = {
          name: values.name,
          email: values.email,
          system: values.system,
          roleId: values.roleId || undefined,
        };
        response = await updateUserDetails(
          user!.user.id,
          updateData,
          values.password || undefined
        );

        if (!isUpdateUserDetailsSuccess(response)) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Success",
        description: `User ${
          mode === "create" ? "created" : "updated"
        } successfully`,
        variant: "default",
      });

      router.refresh();

      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(`User ${mode} failed`, error);
      toast({
        title: "Error",
        description: `Failed to ${mode} user. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Create User
          </Button>
        ) : (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
          </DropdownMenuItem>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New User" : "Edit User"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password Field - Optional for edit mode */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password{" "}
                    {mode === "edit" && "(Leave blank to keep current)"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Selection */}
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? undefined : value)
                    }
                    defaultValue={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {roles.roles.map((role) => (
                        <SelectItem key={role.role.id} value={role.role.id}>
                          {role.role.name}{" "}
                          {role.role.position && `- ${role.role.position}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* System User Switch */}
            <FormField
              control={form.control}
              name="system"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>System User</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {mode === "create" ? "Create User" : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
