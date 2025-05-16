
import React, { useEffect } from "react";
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
import { useNotificationsCount } from "@/hooks/notifications/useNotificationsCount";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { useNotificationsRealtime } from "@/hooks/notifications/useNotificationsRealtime";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const NotificationMenu = () => {
  const { data: notificationsCount = 0 } = useNotificationsCount();
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(5); // Получаем последние 5 уведомлений
  
  // Подключаем обработку уведомлений в реальном времени
  useNotificationsRealtime();
  
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {notificationsCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {notificationsCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between">
          <span>Уведомления</span>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0"
            onClick={handleMarkAllAsRead}
            disabled={notificationsCount === 0 || markAllAsRead.isPending}
          >
            Отметить все как прочитанные
          </Button>
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
          notifications.map((notification) => (
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
                  <span className="font-semibold">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(notification.created_at)}
                  </span>
                </div>
                {notification.description && (
                  <span className="text-xs text-muted-foreground">
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
          ))
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center font-medium">
          Просмотреть все уведомления
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
