
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationsCount } from "@/hooks/notifications/useNotificationsCount";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { useNotificationsRealtime } from "@/hooks/notifications/useNotificationsRealtime";
import NotificationMenu from "@/components/header/NotificationMenu";

const NotificationCenter: React.FC = () => {
  const { data: notificationsCount = 0 } = useNotificationsCount();
  
  // Подключаем обработку уведомлений в реальном времени
  useNotificationsRealtime();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
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
        <NotificationMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { NotificationCenter };
