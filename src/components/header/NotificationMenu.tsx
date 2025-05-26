
import React from "react";
import { BellIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNotificationsCount } from "@/hooks/notifications/useNotificationsCount";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import NotificationSettingsDialog from "@/components/notifications/NotificationSettingsDialog";

const NotificationMenu = () => {
  const { data: notificationsCount = 0 } = useNotificationsCount();
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(5);
  
  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };
  
  const handleNotificationClick = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };
  
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ru 
      });
    } catch (e) {
      return "недавно";
    }
  };
  
  return (
    <div className="w-full">
      <DropdownMenuLabel className="flex justify-between items-center">
        <span>Уведомления</span>
        <div className="flex items-center gap-2">
          <NotificationSettingsDialog>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Settings className="h-3 w-3" />
            </Button>
          </NotificationSettingsDialog>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-xs"
            onClick={handleMarkAllAsRead}
            disabled={notificationsCount === 0 || markAllAsRead.isPending}
          >
            Отметить все
          </Button>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      {isLoading ? (
        <div className="py-4 text-center text-muted-foreground">
          Загрузка уведомлений...
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">
          Нет уведомлений
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className="cursor-pointer p-0"
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div 
                className={cn(
                  "flex flex-col w-full p-3 gap-1",
                  !notification.is_read && "bg-accent/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="font-semibold text-sm">{notification.title}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatTimeAgo(notification.created_at)}
                  </span>
                </div>
                {notification.description && (
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {notification.description}
                  </span>
                )}
                {!notification.is_read && (
                  <span className="ml-auto mt-1">
                    <Badge variant="secondary" className="text-[10px]">Новое</Badge>
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      )}
      
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer justify-center font-medium">
        Просмотреть все уведомления
      </DropdownMenuItem>
    </div>
  );
};

export default NotificationMenu;
