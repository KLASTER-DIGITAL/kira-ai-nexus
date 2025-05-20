
import React, { useMemo, useState } from "react";
import { extractTasksFromNote } from "@/utils/notes/taskExtractor";
import { Button } from "@/components/ui/button";
import { SquarePlus, Check, Clock, CalendarClock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useTaskMutations } from "@/hooks/tasks/useTaskMutations";
import { toast } from "sonner";

interface TaskExtractorProps {
  content: string;
  noteId: string;
}

const TaskExtractor: React.FC<TaskExtractorProps> = ({ content, noteId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdTaskIds, setCreatedTaskIds] = useState<string[]>([]);
  const { createTask } = useTaskMutations();
  
  const extractedTasks = useMemo(() => {
    if (!content) return [];
    try {
      return extractTasksFromNote(content);
    } catch (error) {
      console.error("Ошибка при извлечении задач:", error);
      return [];
    }
  }, [content]);
  
  if (extractedTasks.length === 0) {
    return null;
  }
  
  const handleCreateTasks = async () => {
    setIsCreating(true);
    const newTaskIds: string[] = [];
    
    try {
      for (const task of extractedTasks) {
        // Пропускаем уже созданные задачи используя индекс вместо id
        const taskIndex = extractedTasks.indexOf(task);
        if (createdTaskIds.includes(`task-${taskIndex}`)) {
          continue;
        }
        
        // Убеждаемся, что обязательное поле title присутствует
        if (!task.title) {
          toast.error("Задача без названия не может быть создана");
          continue;
        }
        
        const createTaskInput = {
          title: task.title,
          description: `Создано из заметки: ${noteId}`,
          priority: task.priority || 'medium',
          dueDate: task.dueDate,
          completed: task.completed || false,
          content: {
            tags: task.content?.tags || [],
            source: {
              type: "note",
              id: noteId
            }
          }
        };
        
        try {
          // Не проверяем результат напрямую, а используем переменную
          const createdTask = await createTask(createTaskInput);
          
          // Проверяем корректно ли вернулся результат
          const taskKey = createdTask && typeof createdTask === 'object' && 'id' in createdTask 
            ? createdTask.id 
            : `task-${taskIndex}`;
            
          newTaskIds.push(taskKey);
        } catch (error) {
          console.error("Ошибка при создании задачи:", error);
          // Создаем искусственный идентификатор даже при ошибке, чтобы не пытаться создать её снова
          const taskKey = `task-${taskIndex}`;
          newTaskIds.push(taskKey);
        }
      }
      
      setCreatedTaskIds(prev => [...prev, ...newTaskIds]);
      
      if (newTaskIds.length > 0) {
        toast.success(`Создано задач: ${newTaskIds.length}`);
      } else {
        toast.info("Все задачи уже были созданы");
      }
    } catch (error) {
      console.error("Ошибка при создании задач:", error);
      toast.error("Не удалось создать задачи");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="mt-4 border rounded-md p-3 bg-muted/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Найдено задач: {extractedTasks.length}</h3>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleCreateTasks} 
          disabled={isCreating}
          className="gap-1"
        >
          <SquarePlus className="h-4 w-4" />
          {createdTaskIds.length === extractedTasks.length 
            ? "Задачи созданы" 
            : "Создать задачи"}
        </Button>
      </div>
      
      <div className="space-y-2">
        {extractedTasks.map((task, index) => {
          // Используем индекс для идентификации задачи вместо id
          const taskKey = `task-${index}`;
          const isCreated = createdTaskIds.includes(taskKey);
          
          return (
            <div 
              key={taskKey} 
              className={`flex items-start gap-2 p-2 rounded-sm ${
                task.completed ? 'bg-muted/20' : 'bg-background'
              } ${isCreated ? 'border-l-2 border-primary' : ''}`}
            >
              <div className={`mt-0.5 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                {task.completed ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </div>
              
              <div className="flex-1">
                <p className={task.completed ? 'line-through text-muted-foreground' : ''}>
                  {task.title}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'low' ? 'outline' : 
                    'secondary'
                  } className="text-xs">
                    {task.priority || 'medium'}
                  </Badge>
                  
                  {task.dueDate && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: ru })}
                    </Badge>
                  )}
                  
                  {task.content?.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskExtractor;
