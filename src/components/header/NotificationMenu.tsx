
import React from "react";
import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    title: "New Task Assigned",
    description: "You have been assigned a new task.",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "Calendar Event Reminder",
    description: "Meeting with team in 30 minutes.",
    time: "30 minutes ago",
    unread: true,
  },
  {
    id: 3,
    title: "Note Update",
    description: "Someone commented on your note.",
    time: "2 hours ago",
    unread: false,
  },
];

const NotificationMenu = () => {
  const unreadCount = notifications.filter(n => n.unread).length;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between">
          <span>Notifications</span>
          <Button variant="link" size="sm" className="h-auto p-0">
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="cursor-pointer p-0">
              <div 
                className={cn(
                  "flex flex-col w-full p-3 gap-1",
                  notification.unread && "bg-accent/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="font-semibold">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <span className="text-xs text-muted-foreground">{notification.description}</span>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
