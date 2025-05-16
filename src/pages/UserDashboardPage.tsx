
import React from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckSquare, Calendar, MessageSquare, PlusCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboardPage: React.FC = () => {
  const { profile } = useAuth();

  // Пример данных для пользователя
  const userStats = [
    { 
      title: "Заметки", 
      count: 23, 
      icon: <FileText className="w-4 h-4" />,
      color: "bg-emerald-500/10 text-emerald-500",
      link: "/notes"
    },
    { 
      title: "Задачи", 
      count: 15, 
      icon: <CheckSquare className="w-4 h-4" />,
      color: "bg-blue-500/10 text-blue-500",
      link: "/tasks"
    },
    { 
      title: "События", 
      count: 4, 
      icon: <Calendar className="w-4 h-4" />,
      color: "bg-amber-500/10 text-amber-500",
      link: "/calendar"
    },
    { 
      title: "Чаты", 
      count: 2, 
      icon: <MessageSquare className="w-4 h-4" />,
      color: "bg-pink-500/10 text-pink-500",
      link: "/chat"
    }
  ];

  // Последние активности пользователя (заглушка)
  const recentActivities = [
    { id: 1, type: "note", title: "План проекта", time: "15 минут назад" },
    { id: 2, type: "task", title: "Завершить дизайн", time: "2 часа назад" },
    { id: 3, type: "chat", title: "Обсуждение требований", time: "Вчера" },
    { id: 4, type: "note", title: "Идеи для презентации", time: "2 дня назад" },
  ];

  // Ближайшие задачи (заглушка)
  const upcomingTasks = [
    { id: 1, title: "Созвон с командой", dueDate: "Сегодня, 15:00", priority: "high" },
    { id: 2, title: "Завершить прототип", dueDate: "Завтра", priority: "medium" },
    { id: 3, title: "Обновить документацию", dueDate: "Через 2 дня", priority: "low" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Приветствие */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Привет, {profile?.display_name || profile?.email?.split('@')[0] || 'пользователь'}!
          </h1>
          <p className="text-muted-foreground">
            Добро пожаловать в ваш персональный дашборд KIRA AI. Здесь вы можете управлять всеми своими заметками, задачами и многим другим.
          </p>
        </div>

        {/* Статистика пользователя */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`h-8 w-8 rounded-md flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
              </CardContent>
              <CardFooter className="p-2">
                <Link to={stat.link} className="text-xs text-primary hover:underline w-full text-right">
                  Посмотреть все →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {/* Левая колонка (4/7) */}
          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Что нового?</CardTitle>
                <CardDescription>Обзор вашей активности</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="activities">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="activities">Активности</TabsTrigger>
                    <TabsTrigger value="analytics">Аналитика</TabsTrigger>
                  </TabsList>
                  <TabsContent value="activities" className="pt-4">
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className={`mt-1 ${
                            activity.type === "note" 
                              ? "text-emerald-500" 
                              : activity.type === "task" 
                              ? "text-blue-500" 
                              : "text-pink-500"
                          }`}>
                            {activity.type === "note" ? (
                              <FileText className="h-5 w-5" />
                            ) : activity.type === "task" ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <MessageSquare className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="analytics" className="pt-4">
                    <div className="flex flex-col items-center justify-center space-y-3 py-12">
                      <p className="text-muted-foreground text-center">
                        Аналитика будет доступна после накопления достаточного количества данных.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка (3/7) */}
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Предстоящие задачи</CardTitle>
                  <CardDescription>Что нужно сделать в ближайшее время</CardDescription>
                </div>
                <Link to="/tasks">
                  <Button size="sm" variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Новая задача
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">У вас пока нет предстоящих задач</p>
                    </div>
                  ) : (
                    upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-4">
                        <div>
                          <div className={`h-2 w-2 rounded-full ${
                            task.priority === "high" 
                              ? "bg-red-500" 
                              : task.priority === "medium" 
                              ? "bg-yellow-500" 
                              : "bg-green-500"
                          }`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {task.dueDate}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <CheckSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Link to="/tasks" className="text-xs text-primary hover:underline w-full text-center">
                  Просмотреть все задачи
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboardPage;
