
import React, { useState, useEffect } from "react";
import { Task } from "@/types/tasks";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaskMutations } from "@/hooks/tasks/useTaskMutations";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface NoteTasksProps {
  noteId: string;
}

const NoteTasks: React.FC<NoteTasksProps> = ({ noteId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateTask } = useTaskMutations();
  
  // Fetch tasks related to this note
  useEffect(() => {
    const fetchTasks = async () => {
      if (!noteId) return;
      
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData?.user) {
          console.error("User not authenticated");
          return;
        }
        
        const { data, error } = await supabase
          .from("nodes")
          .select("*")
          .eq("type", "task")
          .eq("user_id", userData.user.id)
          .contains("content", { source: { id: noteId } });
          
        if (error) {
          console.error("Error fetching tasks:", error);
          return;
        }
        
        // Transform the raw data to match Task type
        const transformedTasks: Task[] = data.map((item: any) => {
          // Extract completed and priority from the content field (or use defaults)
          const completed = item.content?.completed || false;
          const priority = item.content?.priority || 'medium';
          
          return {
            id: item.id,
            title: item.title,
            description: item.content?.description || '',
            completed,
            priority,
            dueDate: item.content?.dueDate,
            user_id: item.user_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            type: item.type,
            content: item.content
          };
        });
        
        setTasks(transformedTasks);
      } catch (err) {
        console.error("Error in task fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [noteId]);
  
  const toggleTaskCompletion = (taskId: string, completed: boolean) => {
    updateTask({
      id: taskId,
      completed: !completed,
    });
    
    // Update local state
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      )
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-3">
        Нет связанных задач
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div 
          key={task.id}
          className={`flex items-center gap-2 p-2 rounded-sm ${task.completed ? 'bg-muted/20' : 'bg-card/50'}`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => toggleTaskCompletion(task.id, task.completed)}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
          
          <div className="flex-1">
            <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </p>
            
            {task.dueDate && (
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: ru })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteTasks;
