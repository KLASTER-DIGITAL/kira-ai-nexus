
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Task } from '@/types/tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TasksAnalyticsProps {
  tasks: Task[];
  className?: string;
}

const TasksAnalytics: React.FC<TasksAnalyticsProps> = ({ tasks, className }) => {
  // Данные для статистики по статусу
  const statusData = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    
    return [
      { name: 'Выполнено', value: completed, color: '#10b981' },
      { name: 'В процессе', value: pending, color: '#6366f1' }
    ];
  }, [tasks]);
  
  // Данные для статистики по приоритету
  const priorityData = useMemo(() => {
    const highPriority = tasks.filter(task => task.priority === 'high').length;
    const mediumPriority = tasks.filter(task => task.priority === 'medium').length;
    const lowPriority = tasks.filter(task => task.priority === 'low').length;
    
    return [
      { name: 'Высокий', value: highPriority, color: '#ef4444' },
      { name: 'Средний', value: mediumPriority, color: '#f59e0b' },
      { name: 'Низкий', value: lowPriority, color: '#10b981' }
    ];
  }, [tasks]);
  
  // Данные для статистики по срокам
  const dueDateData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdue = tasks.filter(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return dueDate < today;
      }
      return false;
    }).length;
    
    const dueToday = tasks.filter(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return dueDateOnly.getTime() === todayOnly.getTime();
      }
      return false;
    }).length;
    
    const upcoming = tasks.filter(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return dueDate > today;
      }
      return false;
    }).length;
    
    const noDueDate = tasks.filter(task => !task.completed && !task.dueDate).length;
    
    return [
      { name: 'Просрочено', value: overdue, color: '#ef4444' },
      { name: 'Сегодня', value: dueToday, color: '#f59e0b' },
      { name: 'Предстоящие', value: upcoming, color: '#6366f1' },
      { name: 'Без срока', value: noDueDate, color: '#94a3b8' }
    ];
  }, [tasks]);
  
  // Общее количество задач по тегам
  const tagStats = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    
    tasks.forEach(task => {
      const tags = task.content?.tags || [];
      tags.forEach(tag => {
        if (tagCounts[tag]) {
          tagCounts[tag]++;
        } else {
          tagCounts[tag] = 1;
        }
      });
    });
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [tasks]);
  
  // Если нет задач, показываем заглушку
  if (tasks.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Аналитика задач</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          Нет данных для отображения.
          <p className="mt-2 text-sm">Создайте задачи, чтобы увидеть аналитику.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Аналитика задач</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Статистика по статусу */}
          <div>
            <h3 className="text-sm font-medium mb-2">По статусу</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Статистика по приоритету */}
          <div>
            <h3 className="text-sm font-medium mb-2">По приоритету</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-priority-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Статистика по срокам */}
          <div>
            <h3 className="text-sm font-medium mb-2">По срокам</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dueDateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dueDateData.map((entry, index) => (
                    <Cell key={`cell-duedate-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Популярные теги */}
          <div>
            <h3 className="text-sm font-medium mb-2">Популярные теги</h3>
            {tagStats.length > 0 ? (
              <div className="space-y-2">
                {tagStats.map(([tag, count]) => (
                  <div key={tag} className="flex justify-between items-center">
                    <Badge variant="secondary">#{tag}</Badge>
                    <span className="text-sm">{count} задач</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-muted-foreground">
                Нет тегов для отображения
              </p>
            )}
          </div>
        </div>
        
        {/* Общая статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Всего задач</div>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Выполнено</div>
            <div className="text-2xl font-bold">{tasks.filter(task => task.completed).length}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Просрочено</div>
            <div className="text-2xl font-bold text-destructive">{dueDateData[0].value}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Высокий приоритет</div>
            <div className="text-2xl font-bold">{tasks.filter(task => task.priority === 'high').length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksAnalytics;
