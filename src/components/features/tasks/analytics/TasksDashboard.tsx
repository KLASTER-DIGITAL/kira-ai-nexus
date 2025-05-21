
import React from 'react';
import { Task } from '@/types/tasks';
import { useTasks } from '@/hooks/useTasks';
import TasksAnalytics from './TasksAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const TasksDashboard: React.FC = () => {
  const { tasks, isLoading } = useTasks();
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Получаем сегодняшние задачи
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTasks = tasks?.filter(task => {
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return dueDateOnly.getTime() === todayOnly.getTime();
    }
    return false;
  }) || [];
  
  // Получаем задачи на неделю
  const weekStart = new Date(today);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  const weekTasks = tasks?.filter(task => {
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      return dueDate >= weekStart && dueDate <= weekEnd;
    }
    return false;
  }) || [];
  
  // Получаем задачи высокого приоритета
  const highPriorityTasks = tasks?.filter(task => task.priority === 'high') || [];
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Все задачи</TabsTrigger>
          <TabsTrigger value="today">Сегодня</TabsTrigger>
          <TabsTrigger value="week">Неделя</TabsTrigger>
          <TabsTrigger value="priority">Приоритетные</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <TasksAnalytics tasks={tasks || []} />
        </TabsContent>
        
        <TabsContent value="today" className="mt-4">
          {todayTasks.length > 0 ? (
            <TasksAnalytics tasks={todayTasks} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Задачи на сегодня</CardTitle>
                <CardDescription>На сегодня нет запланированных задач</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                Нет задач, запланированных на сегодня
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="week" className="mt-4">
          {weekTasks.length > 0 ? (
            <TasksAnalytics tasks={weekTasks} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Задачи на неделю</CardTitle>
                <CardDescription>На неделю нет запланированных задач</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                Нет задач, запланированных на текущую неделю
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="priority" className="mt-4">
          {highPriorityTasks.length > 0 ? (
            <TasksAnalytics tasks={highPriorityTasks} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Приоритетные задачи</CardTitle>
                <CardDescription>Нет задач с высоким приоритетом</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                Нет задач с высоким приоритетом
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksDashboard;
