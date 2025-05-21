
import React from "react";
import { Calendar, CalendarCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ANIMATIONS } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";

const CalendarIntegration: React.FC = () => {
  const handleAddGoogleCalendar = () => {
    toast({
      title: "Google Calendar",
      description: "Интеграция с Google Calendar будет доступна в ближайшее время.",
    });
  };

  return (
    <div className={`${ANIMATIONS.fadeIn} p-4 h-full`}>
      <CardHeader className="px-0 pt-0">
        <CardTitle>Интеграции</CardTitle>
      </CardHeader>

      <CardContent className="px-0 pb-0 flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-md border p-3 bg-background/50">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Google Calendar</h3>
              <p className="text-xs text-muted-foreground">Синхронизация событий</p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleAddGoogleCalendar}
          >
            Подключить
          </Button>
        </div>
        
        <div className="flex items-center justify-between rounded-md border p-3 bg-background/50">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
              <CalendarCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Задачи KIRA</h3>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                  Подключено
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Интеграция с задачами</p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            disabled
          >
            Настроить
          </Button>
        </div>

        <div className="mt-auto">
          <h3 className="font-medium text-sm mb-2">Доступные напоминания</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm border-b pb-1">
              <span>За 30 минут</span>
              <Badge variant="outline" className="bg-muted">По умолчанию</Badge>
            </div>
            <div className="flex items-center justify-between text-sm border-b pb-1">
              <span>За 1 час</span>
              <Badge variant="outline" className="bg-muted">Активно</Badge>
            </div>
            <div className="flex items-center justify-between text-sm border-b pb-1">
              <span>За 1 день</span>
              <Badge variant="outline" className="bg-muted">Активно</Badge>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4"
            variant="outline"
            onClick={() => {
              toast({
                title: "Настройки напоминаний",
                description: "Функция будет доступна в следующем обновлении.",
              });
            }}
          >
            <Plus size={16} className="mr-2" />
            Добавить напоминание
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default CalendarIntegration;
