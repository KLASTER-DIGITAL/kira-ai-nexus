
import React from "react";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CalendarView from "@/components/calendar/CalendarView";
import CalendarIntegration from "@/components/calendar/CalendarIntegration";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, ListTodo } from "lucide-react";

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
                  Задачи в календаре
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="mt-0">
                <CalendarView />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">
                    Интеграция задач с календарем будет доступна в ближайшее время
                  </p>
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
