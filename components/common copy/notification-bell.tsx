"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getUserNotifications } from "@/actions/notifications/info";
import {
  isGetUserNotificationsSuccess,
  isCreateUserViewNotificationSuccess,
  GetUserNotificationsSuccessType,
} from "@/types/notification";
import { useToast } from "@/hooks/use-toast";
import { createUserViewNotification } from "@/actions/notifications/create";
import { usePusher } from "@/providers/PusherProvider";

export default function NotificationBell({
  roleId,
}: {
  roleId: string | null | undefined;
}) {
  const pusher = usePusher();
  const [notifications, setNotifications] =
    useState<GetUserNotificationsSuccessType>([]);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    const newNotifications = await getUserNotifications({ start: 0, end: 10 });
    if (isGetUserNotificationsSuccess(newNotifications)) {
      setNotifications(newNotifications);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []); // No dependency array issues here

  const markAsViewed = async (notificationId: string) => {
    const response = await createUserViewNotification(notificationId);
    if (!isCreateUserViewNotificationSuccess(response)) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    }
  };

  const handleNotificationInteraction = async (
    notification: (typeof notifications)[number]
  ) => {
    if (notification.userNotificationView.length === 0) {
      await markAsViewed(notification.id);
    }
  };

  useEffect(() => {
    if (!roleId) return;

    const channelName = `presence-notifications-${roleId}`;
    const notificationHandler = (data: any) => {
      setNotifications((prev) => [...prev, data.message]);
      toast({
        title: data.message.title,
        description: data.message.description,
      });
    };

    pusher.subscribeToChannel(channelName, {
      "notifications:new": notificationHandler,
    });

    return () => {
      pusher.unsubscribeFromChannel(channelName);
    };
  }, [pusher, roleId, toast]); // Use only necessary dependencies

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 px-1 min-w-[1.25rem]"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleNotificationInteraction(notification)}
              onPointerOver={() => handleNotificationInteraction(notification)}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{notification.title}</span>
                <span className="text-sm text-muted-foreground">
                  {notification.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
