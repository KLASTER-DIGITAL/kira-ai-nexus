
import React from "react";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CalendarView from "@/components/calendar/CalendarView";
import CalendarIntegration from "@/components/calendar/CalendarIntegration";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, ListTodo, Link } from "lucide-react";
import TaskList from "@/components/tasks/TaskList";

const CalendarPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-8 border rounded-md bg-muted/10">
            <h2 className="text-xl font-semibold mb-2">Необходимо войти в систему</h2>
            <p className="text-muted-foreground mb-4">
              Для просмотра и управления календарем необходимо авторизоваться
            </p>
            <Button onClick={() => navigate("/auth")}>
              Войти в систему
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Календарь</h1>
        <p className="text-muted-foreground">
          Управляйте своими задачами и событиями в календаре
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <Tabs defaultValue="calendar">
              <TabsList className="mb-4">
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Календарь
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4" />
                  Задачи
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Интеграция
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="mt-0">
                <CalendarView />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/20">
                    <h3 className="font-medium mb-2">Задачи в календаре</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Все задачи с установленными датами выполнения автоматически отображаются в календаре как события.
                    </p>
                  </div>
                  <TaskList />
                </div>
              </TabsContent>
              
              <TabsContent value="integration" className="mt-0">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/20">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Интеграция задач и календаря
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Задачи автоматически синхронизируются с календарем:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Задачи с датой выполнения отображаются как события в календаре</li>
                      <li>Изменение статуса задачи обновляет событие в календаре</li>
                      <li>Перемещение даты задачи автоматически обновляет календарь</li>
                      <li>Завершенные задачи скрываются из календаря</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Возможности интеграции:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-green-600 mb-1">✅ Реализовано:</h5>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Автоматическое создание событий из задач</li>
                          <li>• Синхронизация статусов</li>
                          <li>• Отображение приоритетов</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-600 mb-1">🔄 В разработке:</h5>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Drag & Drop задач в календаре</li>
                          <li>• Уведомления о приближающихся дедлайнах</li>
                          <li>• Повторяющиеся задачи</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CalendarIntegration />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
