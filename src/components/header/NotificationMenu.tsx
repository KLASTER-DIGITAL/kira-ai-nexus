
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const getDefaultNotifications = (): Notification[] => [
  {
    id: 1,
    title: "Новая задача назначена",
    description: "Вам была назначена новая задача.",
    time: "2 минуты назад",
    unread: true,
  },
  {
    id: 2,
    title: "Напоминание о событии",
    description: "Встреча с командой через 30 минут.",
    time: "30 минут назад",
    unread: true,
  },
  {
    id: 3,
    title: "Обновление заметки",
    description: "Кто-то прокомментировал вашу заметку.",
    time: "2 часа назад",
    unread: false,
  },
];

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: notificationsCount = 0, refetch } = useNotificationsCount();
  
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API для получения уведомлений
    // Пока используем демонстрационные данные
    const fetchNotifications = async () => {
      try {
        // Проверяем авторизацию пользователя
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          console.error("Ошибка авторизации:", authError || "Пользователь не авторизован");
          setNotifications([]);
          return;
        }
        
        // Здесь будет реальный запрос к таблице уведомлений
        // Пока используем демо-данные
        setNotifications(getDefaultNotifications().slice(0, notificationsCount));
      } catch (error) {
        console.error("Ошибка при загрузке уведомлений:", error);
        setNotifications([]);
      }
    };
    
    fetchNotifications();
  }, [notificationsCount]);
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  const handleMarkAllAsRead = () => {
    // В реальном приложении здесь будет запрос к API для обновления статусов уведомлений
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success("Все уведомления отмечены как прочитанные");
    refetch(); // Обновляем счетчик уведомлений
  };
  
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
          <span>Уведомления</span>
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Отметить все как прочитанные
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            Нет уведомлений
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
          Просмотреть все уведомления
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
