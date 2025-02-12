"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { emitNotification } from "@/actions/notifications/emit";
import {
  GetNotifications,
  GetNotificationsSuccessType,
  isEmitNotificationSuccess,
  isGetNotificationsSuccess,
} from "@/types/notification";
import NotificationForm from "../NotificationForm";
import { RoleSearchInfoSuccessType } from "@/types/roles";

export default function AllNotifications({
  initialData,
  roles,
}: {
  initialData: GetNotifications;
  roles: RoleSearchInfoSuccessType["roles"];
}) {
  const [isEmitting, setIsEmitting] = useState(false);
  const [notifications, setNotifications] =
    useState<GetNotificationsSuccessType>(
      isGetNotificationsSuccess(initialData) ? initialData : []
    );

  const handleEmit = async (
    notification: GetNotificationsSuccessType[number]
  ) => {
    setIsEmitting(true);
    try {
      if (!notification?.id)
        return toast({
          title: "Notification Failed",
          description: "You must save a notification before emitting it.",
        });
      const result = await emitNotification(notification.id);
      if (isEmitNotificationSuccess(result)) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? result.notification : n))
        );
        toast({
          title: "Notification Emitted",
          description: "Your notification has been sent to the selected roles.",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    } finally {
      setIsEmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Notifications</h1>
        <NotificationForm roles={roles} setNotifications={setNotifications} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage and send admin notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Email Notify</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Emitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell>{notification.description}</TableCell>
                  <TableCell>{notification.notifyEmail}</TableCell>
                  <TableCell>
                    {notification.roleIds
                      .map(
                        (id) => roles.find((r) => r.role.id === id)?.role.name
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    {notification.createdAt?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {notification.emittedAt?.toLocaleString() || "Not emitted"}
                  </TableCell>
                  <TableCell>
                    <NotificationForm
                      roles={roles}
                      setNotifications={setNotifications}
                      initialData={notification}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEmit(notification)}
                      disabled={!!notification.emittedAt || isEmitting}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {notification.emittedAt ? "Emitted" : "Emit"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
