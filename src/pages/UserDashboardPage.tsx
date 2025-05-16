
import React, { useState } from "react";
import { useAuth } from "@/context/auth";
import { 
  NotepadText, 
  CheckSquare, 
  CalendarIcon, 
  Clock, 
  BarChart3, 
  Star, 
  Plus,
  ArrowRight,
  Bell,
  Clipboard,
  MessageSquare,
  Calendar,
  Network
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/dashboard/cards/StatCard";
import ChartCard from "@/components/dashboard/cards/ChartCard";
import OverviewCard from "@/components/dashboard/cards/OverviewCard";

const activityData = [
  { name: "Пн", value: 4 },
  { name: "Вт", value: 6 },
  { name: "Ср", value: 8 },
  { name: "Чт", value: 5 },
  { name: "Пт", value: 10 },
  { name: "Сб", value: 3 },
  { name: "Вс", value: 2 },
];

const notesData = [
  { name: "Неделя 1", value: 5 },
  { name: "Неделя 2", value: 8 },
  { name: "Неделя 3", value: 12 },
  { name: "Неделя 4", value: 10 },
];

// Данные карточек
const quickLinks = [
  {
    title: "Заметки",
    icon: NotepadText,
    href: "/notes",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
  },
  {
    title: "Задачи",
    icon: CheckSquare,
    href: "/tasks",
    color: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
  },
  {
    title: "Календарь",
    icon: Calendar,
    href: "/calendar",
    color: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
  },
  {
    title: "Чат",
    icon: MessageSquare,
    href: "/chat",
    color: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300"
  },
  {
    title: "Граф связей",
    icon: Network,
    href: "/graph",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
  }
];

const UserDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Контент для вкладок
  const recentNotes = (
    <div className="space-y-2">
      <div className="flex items-center p-2 rounded-md hover:bg-muted">
        <NotepadText className="h-4 w-4 mr-2" />
        <div className="flex-1">
          <p className="font-medium">Заметки по проекту</p>
          <p className="text-xs text-muted-foreground">Обновлено 2 часа назад</p>
        </div>
      </div>
      <div className="flex items-center p-2 rounded-md hover:bg-muted">
        <NotepadText className="h-4 w-4 mr-2" />
        <div className="flex-1">
          <p className="font-medium">Идеи разработки</p>
          <p className="text-xs text-muted-foreground">Обновлено вчера</p>
        </div>
      </div>
      <div className="flex items-center p-2 rounded-md hover:bg-muted">
        <NotepadText className="h-4 w-4 mr-2" />
        <div className="flex-1">
          <p className="font-medium">Недельный план</p>
          <p className="text-xs text-muted-foreground">Обновлено 3 дня назад</p>
        </div>
      </div>
      <Button variant="link" className="px-0 h-auto font-semibold flex items-center w-full justify-end">
        Все заметки
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
  
  const favoritesContent = (
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
  );
  
  const activityContent = (
    <div className="space-y-4">
      <div className="border-l-2 border-primary pl-4 ml-2">
        <p className="text-sm">Создана новая задача: "Подготовить отчёт"</p>
        <p className="text-xs text-muted-foreground">15:30, сегодня</p>
      </div>
      <div className="border-l-2 border-primary pl-4 ml-2">
        <p className="text-sm">Обновлена заметка: "Квартальные планы"</p>
        <p className="text-xs text-muted-foreground">12:45, сегодня</p>
      </div>
      <div className="border-l-2 border-primary pl-4 ml-2">
        <p className="text-sm">Добавлено событие: "Еженедельная встреча"</p>
        <p className="text-xs text-muted-foreground">09:15, сегодня</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Вкладки */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="reports">Отчёты</TabsTrigger>
            <TabsTrigger value="notifications">
              Уведомления
              <Badge className="ml-2 bg-primary/20 text-primary" variant="secondary">3</Badge>
            </TabsTrigger>
          </TabsList>
          <Button className="hidden md:flex">
            <Plus className="mr-2 h-4 w-4" /> Создать
          </Button>
        </div>
        
        {/* Контент вкладки "Обзор" */}
        <TabsContent value="overview" className="space-y-6">
          {/* Приветствие */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Добро пожаловать, {profile?.display_name || 'Пользователь'}!
              </h2>
              <p className="text-muted-foreground">
                Вот что происходит в вашем рабочем пространстве сегодня.
              </p>
            </div>
          </div>
          
          {/* Статистика */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Заметки"
              value="12"
              icon={<NotepadText className="h-4 w-4" />}
              description="3 новых за неделю"
              change={{ value: 10, isPositive: true }}
            />
            <StatCard
              title="Задачи"
              value="8"
              icon={<CheckSquare className="h-4 w-4" />}
              description="5 активных задач"
              change={{ value: 20, isPositive: true }}
            />
            <StatCard
              title="События"
              value="3"
              icon={<CalendarIcon className="h-4 w-4" />}
              description="Сегодня"
              change={{ value: 5, isPositive: false }}
            />
            <StatCard
              title="Рабочее время"
              value="3.5ч"
              icon={<Clock className="h-4 w-4" />}
              description="Сегодня"
              change={{ value: 15, isPositive: true }}
            />
          </div>
          
          {/* Графики и обзоры */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <ChartCard
              title="Активность"
              description="Ваша активность во времени"
              data={activityData}
              valueKey="value"
              type="area"
              color="hsl(var(--primary))"
              className="col-span-4"
            />
            
            <ChartCard
              title="Созданные заметки" 
              data={notesData}
              valueKey="value"
              type="line"
              color="#8B5CF6"
              height={150}
              className="col-span-3"
            />
          </div>
          
          {/* Карточки с вкладками и быстрыми ссылками */}
          <div className="grid gap-4 md:grid-cols-2">
            <OverviewCard
              title="Ваш контент"
              tabs={[
                { value: "recent", label: "Недавние", content: recentNotes },
                { value: "favorites", label: "Избранное", content: favoritesContent },
                { value: "activity", label: "Активность", content: activityContent },
              ]}
              defaultTab="recent"
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Быстрый доступ</CardTitle>
                <CardDescription>Основные инструменты для работы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickLinks.map((link, index) => (
                    <Button 
                      key={index} 
                      variant="outline"
                      className="flex flex-col items-center justify-center h-24 p-3 hover:bg-muted/50"
                      asChild
                    >
                      <a href={link.href}>
                        <div className={cn("p-2 rounded-full mb-2", link.color)}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm">{link.title}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Контент вкладки "Аналитика" */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Аналитика</h2>
            <p className="text-muted-foreground">
              Здесь будет отображаться аналитика вашей активности и использования системы.
            </p>
          </Card>
        </TabsContent>
        
        {/* Контент вкладки "Отчёты" */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Отчёты</h2>
            <p className="text-muted-foreground">
              Здесь будут доступны отчёты по вашей активности и задачам.
            </p>
          </Card>
        </TabsContent>
        
        {/* Контент вкладки "Уведомления" */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>Ваши последние уведомления и обновления</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <div className="bg-primary/20 text-primary rounded-full p-1.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Новая задача назначена</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Вам была назначена новая задача "Подготовить презентацию"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">2 часа назад</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <div className="bg-primary/20 text-primary rounded-full p-1.5">
                    <Clipboard className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Обновление в проекте</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Заметка "Квартальный отчет" была обновлена
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Вчера</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <div className="bg-primary/20 text-primary rounded-full p-1.5">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Новое сообщение</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      У вас новое сообщение от Алексей К.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">2 дня назад</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Показать все уведомления</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboardPage;
