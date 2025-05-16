
import React from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth";
import { 
  NotepadText, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  BarChart3, 
  Star
} from "lucide-react";
import StatCard from "@/components/dashboard/widgets/StatCard";

const UserDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  
  // Демо данные для статистики
  const stats = [
    { 
      title: "Заметки", 
      value: "12", 
      icon: <NotepadText className="h-4 w-4" />,
      change: "3 новых",
      className: "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20"
    },
    { 
      title: "Задачи", 
      value: "8", 
      icon: <CheckSquare className="h-4 w-4" />,
      change: "5 активных",
      className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
    },
    { 
      title: "События", 
      value: "3", 
      icon: <CalendarIcon className="h-4 w-4" />,
      change: "Сегодня",
      className: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20"
    },
    { 
      title: "Время работы", 
      value: "3.5ч", 
      icon: <Clock className="h-4 w-4" />,
      change: "Сегодня",
      className: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Приветствие */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold mb-2">
            Добро пожаловать, {profile?.display_name || 'Пользователь'}!
          </h1>
          <p className="text-muted-foreground">
            Ваш персональный дашборд с актуальной информацией.
          </p>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              className={stat.className}
            />
          ))}
        </div>
        
        {/* Вкладки */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="recent">Недавние</TabsTrigger>
            <TabsTrigger value="favorites">Избранное</TabsTrigger>
            <TabsTrigger value="activity">Активность</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="animate-fade-in">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Недавно изменённые заметки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center p-2 rounded-md hover:bg-muted">
                    <NotepadText className="h-4 w-4 mr-2" />
                    <div className="flex-1">
                      <p className="font-medium">Заметка по проекту</p>
                      <p className="text-xs text-muted-foreground">Обновлено 2 часа назад</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-muted">
                    <NotepadText className="h-4 w-4 mr-2" />
                    <div className="flex-1">
                      <p className="font-medium">Идеи для развития</p>
                      <p className="text-xs text-muted-foreground">Обновлено вчера</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-muted">
                    <NotepadText className="h-4 w-4 mr-2" />
                    <div className="flex-1">
                      <p className="font-medium">План работы на неделю</p>
                      <p className="text-xs text-muted-foreground">Обновлено 3 дня назад</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites" className="animate-fade-in">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Избранные элементы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center p-2 rounded-md hover:bg-muted">
                    <Star className="h-4 w-4 text-amber-500 mr-2" />
                    <div className="flex-1">
                      <p className="font-medium">Важный документ</p>
                      <p className="text-xs text-muted-foreground">Заметка</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-muted">
                    <Star className="h-4 w-4 text-amber-500 mr-2" />
                    <div className="flex-1">
                      <p className="font-medium">Встреча с клиентом</p>
                      <p className="text-xs text-muted-foreground">Событие</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="animate-fade-in">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Недавняя активность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4 ml-2">
                    <p className="text-sm">Создана новая задача: "Подготовить отчет"</p>
                    <p className="text-xs text-muted-foreground">15:30, сегодня</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4 ml-2">
                    <p className="text-sm">Обновлена заметка: "Планы на квартал"</p>
                    <p className="text-xs text-muted-foreground">12:45, сегодня</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4 ml-2">
                    <p className="text-sm">Добавлено событие: "Еженедельная встреча"</p>
                    <p className="text-xs text-muted-foreground">09:15, сегодня</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboardPage;
