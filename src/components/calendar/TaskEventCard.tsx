
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskEventCardProps {
  event: CalendarEvent;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onClick?: () => void;
  className?: string;
}

const TaskEventCard: React.FC<TaskEventCardProps> = ({
  event,
  onToggleComplete,
  onClick,
  className
}) => {
  const priority = event.content?.priority || 'medium';
  const taskId = event.content?.taskId;
  const isCompleted = event.content?.completed === 'true';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (taskId) {
      onToggleComplete(taskId, !isCompleted);
    }
  };

  return (
    <div
      className={cn(
        "p-2 rounded-md border cursor-pointer transition-all",
        "hover:shadow-sm hover:border-primary/30",
        isCompleted ? "opacity-60 bg-muted/50" : "bg-card",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={handleToggleComplete}
          className="mt-0.5 hover:scale-110 transition-transform"
        >
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground hover:text-primary" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className={cn(
              "text-xs font-medium truncate",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {event.title.replace('Задача: ', '')}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge 
              variant="outline" 
              className={cn("text-xs", getPriorityColor(priority))}
            >
              {priority === 'high' ? 'Высокий' : 
               priority === 'medium' ? 'Средний' : 'Низкий'}
            </Badge>
          </div>

          {event.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskEventCard;
