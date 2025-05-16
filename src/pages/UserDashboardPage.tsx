
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Типы данных для статистики
interface UserStats {
  notesCount: number;
  tasksCount: number;
  eventsCount: number;
  workHours: number;
  newNotesCount: number;
  activeTasks: number;
}

// Типы для заметок и недавних элементов
interface NoteItem {
  id: string;
  title: string;
  updated_at: string;
}

interface ActivityItem {
  type: 'note' | 'task' | 'event';
  title: string;
  timestamp: string;
}

const UserDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    notesCount: 0,
    tasksCount: 0,
    eventsCount: 0,
    workHours: 0,
    newNotesCount: 0,
    activeTasks: 0
  });
  const [recentNotes, setRecentNotes] = useState<NoteItem[]>([]);
  const [favorites, setFavorites] = useState<NoteItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activityData, setActivityData] = useState<Array<{name: string, value: number}>>([]);
  const [notesData, setNotesData] = useState<Array<{name: string, value: number}>>([]);

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

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (!profile?.id) return;
        
        // Получение количества заметок
        const { data: notesData, error: notesError } = await supabase
          .from('nodes')
          .select('id, created_at')
          .eq('user_id', profile.id)
          .eq('type', 'note');
          
        if (notesError) throw notesError;
        
        // Получение количества задач
        const { data: tasksData, error: tasksError } = await supabase
          .from('nodes')
          .select('id')
          .eq('user_id', profile.id)
          .eq('type', 'task');
          
        if (tasksError) throw tasksError;
        
        // Получение количества событий
        const { data: eventsData, error: eventsError } = await supabase
          .from('nodes')
          .select('id')
          .eq('user_id', profile.id)
          .eq('type', 'event');
          
        if (eventsError) throw eventsError;
        
        // Получение последних заметок
        const { data: recentNotesData, error: recentNotesError } = await supabase
          .from('nodes')
          .select('id, title, updated_at')
          .eq('user_id', profile.id)
          .eq('type', 'note')
          .order('updated_at', { ascending: false })
          .limit(3);
          
        if (recentNotesError) throw recentNotesError;
        
        // Подсчет новых заметок за последнюю неделю
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const newNotesCount = notesData?.filter(note => 
          new Date(note.created_at) >= oneWeekAgo
        ).length || 0;
        
        // Генерация данных активности на основе имеющихся данных
        const generatedActivityData = generateActivityData(notesData || [], tasksData || []);
        const generatedNotesData = generateNotesWeeklyData(notesData || []);
        
        setStats({
          notesCount: notesData?.length || 0,
          tasksCount: tasksData?.length || 0,
          eventsCount: eventsData?.length || 0,
          workHours: calculateTotalWorkHours(),
          newNotesCount,
          activeTasks: tasksData?.length || 0
        });
        
        setRecentNotes(recentNotesData || []);
        setActivityData(generatedActivityData);
        setNotesData(generatedNotesData);
        
        // Генерация записей активности на основе последних действий
        const activitiesList = generateActivities(recentNotesData || []);
        setActivities(activitiesList);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Не удалось загрузить данные пользователя');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [profile?.id]);
  
  // Функция генерации данных активности
  const generateActivityData = (notes: any[], tasks: any[]) => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const activityByDay = new Array(7).fill(0);
    
    // Если у пользователя есть заметки или задачи, распределяем их по дням недели
    if (notes.length > 0 || tasks.length > 0) {
      notes.forEach(note => {
        const date = new Date(note.created_at);
        const dayIndex = date.getDay();
        // Воскресенье в JS это 0, но мы хотим чтобы было 6
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        activityByDay[adjustedIndex]++;
      });
      
      // Добавляем немного случайности, чтобы график выглядел интереснее
      return days.map((day, i) => ({
        name: day,
        value: activityByDay[i]
      }));
    } else {
      // Если данных нет, возвращаем нулевые значения
      return days.map(day => ({
        name: day,
        value: 0
      }));
    }
  };
  
  // Функция генерации данных по заметкам по неделям
  const generateNotesWeeklyData = (notes: any[]) => {
    const weeks = ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'];
    
    // Если у пользователя есть заметки, группируем их по неделям
    if (notes.length > 0) {
      const now = new Date();
      const notesByWeek = new Array(4).fill(0);
      
      notes.forEach(note => {
        const noteDate = new Date(note.created_at);
        const diffTime = Math.abs(now.getTime() - noteDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) notesByWeek[0]++;
        else if (diffDays <= 14) notesByWeek[1]++;
        else if (diffDays <= 21) notesByWeek[2]++;
        else if (diffDays <= 28) notesByWeek[3]++;
      });
      
      return weeks.map((week, i) => ({
        name: week,
        value: notesByWeek[i]
      }));
    } else {
      // Если данных нет, возвращаем нулевые значения
      return weeks.map(week => ({
        name: week,
        value: 0
      }));
    }
  };
  
  // Функция генерации записей активности
  const generateActivities = (recentNotes: NoteItem[]): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    
    recentNotes.forEach(note => {
      activities.push({
        type: 'note',
        title: `Обновлена заметка: "${note.title}"`,
        timestamp: formatTimeAgo(new Date(note.updated_at))
      });
    });
    
    return activities;
  };
  
  // Функция расчета времени работы (просто для демонстрации)
  const calculateTotalWorkHours = (): number => {
    return Math.max(Math.random() * 4, 0.5).toFixed(1) as unknown as number;
  };
  
  // Функция форматирования времени
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes} минут назад`;
    if (diffHours < 24) return `${diffHours} часов назад`;
    return `${diffDays} дней назад`;
  };

  // Контент для вкладки "Недавние"
  const recentNotesContent = (
    <div className="space-y-2">
      {recentNotes.length > 0 ? (
        recentNotes.map((note, index) => (
          <div key={note.id} className="flex items-center p-2 rounded-md hover:bg-muted">
            <NotepadText className="h-4 w-4 mr-2" />
            <div className="flex-1">
              <p className="font-medium">{note.title}</p>
              <p className="text-xs text-muted-foreground">Обновлено {formatTimeAgo(new Date(note.updated_at))}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-2 text-center text-muted-foreground">
          У вас пока нет заметок
        </div>
      )}
      <Button variant="link" className="px-0 h-auto font-semibold flex items-center w-full justify-end">
        Все заметки
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
  
  // Контент для вкладки "Избранное"
  const favoritesContent = (
    <div className="space-y-2">
      {favorites.length > 0 ? (
        favorites.map((item, index) => (
          <div key={item.id} className="flex items-center p-2 rounded-md hover:bg-muted">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">Заметка</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-2 text-center text-muted-foreground">
          У вас пока нет избранных элементов
        </div>
      )}
    </div>
  );
  
  // Контент для вкладки "Активность"
  const activityContent = (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div key={index} className="border-l-2 border-primary pl-4 ml-2">
            <p className="text-sm">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
        ))
      ) : (
        <div className="p-2 text-center text-muted-foreground">
          Нет записей активности
        </div>
      )}
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
              value={stats.notesCount.toString()}
              icon={<NotepadText className="h-4 w-4" />}
              description={stats.newNotesCount > 0 ? `${stats.newNotesCount} новых за неделю` : "Нет новых заметок"}
              change={{ value: stats.newNotesCount > 0 ? 10 : 0, isPositive: true }}
            />
            <StatCard
              title="Задачи"
              value={stats.tasksCount.toString()}
              icon={<CheckSquare className="h-4 w-4" />}
              description={`${stats.activeTasks} активных задач`}
              change={{ value: stats.activeTasks > 0 ? 20 : 0, isPositive: true }}
            />
            <StatCard
              title="События"
              value={stats.eventsCount.toString()}
              icon={<CalendarIcon className="h-4 w-4" />}
              description="Сегодня"
              change={{ value: 0, isPositive: false }}
            />
            <StatCard
              title="Рабочее время"
              value={`${stats.workHours}ч`}
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
                { value: "recent", label: "Недавние", content: recentNotesContent },
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
