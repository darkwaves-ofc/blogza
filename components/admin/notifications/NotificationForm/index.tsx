"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Edit, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { updateNotification } from "@/actions/notifications/update";
import { createNotification } from "@/actions/notifications/create";
import {
  GetNotificationsSuccessType,
  isCreateNotificationSuccess,
  isUpdateNotificationSuccess,
} from "@/types/notification";
import { RoleSearchInfoSuccessType } from "@/types/roles";
import { notificationSchema } from "@/schemas/notifications";
import { Switch } from "@/components/ui/switch";

export default function NotificationForm({
  roles,
  setNotifications,
  initialData,
}: {
  roles: RoleSearchInfoSuccessType["roles"];
  setNotifications: React.Dispatch<
    React.SetStateAction<GetNotificationsSuccessType>
  >;
  initialData?: GetNotificationsSuccessType[number];
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      roleIds: initialData?.roleIds || [],
      notifyEmail: initialData?.notifyEmail || false,
    },
  });

  const handleSubmit = async (data: z.infer<typeof notificationSchema>) => {
    setIsSaving(true);
    try {
      if (initialData) {
        const result = await updateNotification(initialData.id, data);
        if (!isUpdateNotificationSuccess(result)) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Notification updated",
            description: "Notification updated successfully",
          });
          setNotifications((prev) =>
            prev.map((notification) =>
              notification.id === result.id ? result : notification
            )
          );
        }
      } else {
        const result = await createNotification(data);
        if (!isCreateNotificationSuccess(result)) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Notification created",
            description: "Notification created successfully",
          });
        }
        setNotifications((prev) => [...prev, result]);
      }

      form.reset();
      setIsEdit(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Dialog open={isEdit} onOpenChange={() => setIsEdit(true)}>
      <DialogTrigger asChild>
        {initialData ? (
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Notification
          </Button>
        ) : (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Notification
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Notification" : "Create Notification"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the details of the selected notification."
              : "Create a new notification to send to specific admin roles."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Notification title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a concise title for your notification.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the notification"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide more details about the notification.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifyEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Email Notification
                    </FormLabel>
                    <FormDescription>
                      Enable email notifications for this alert
                    </FormDescription>
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

            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange([...field.value, value])
                    }
                    value={field.value[field.value.length - 1] || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select roles to notify" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map(({ role }) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the roles that should receive this notification.
                  </FormDescription>
                  <FormMessage />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((roleId) => {
                      const role = roles.find((r) => r.role.id === roleId);
                      return role ? (
                        <div
                          key={role.role.id}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
                        >
                          {role.role.name}
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((id) => id !== roleId)
                              )
                            }
                            className="ml-2 text-secondary-foreground/50 hover:text-secondary-foreground"
                          >
                            ×
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving
                ? "Saving..."
                : (initialData ? "Update" : "Create") + " Notification"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
