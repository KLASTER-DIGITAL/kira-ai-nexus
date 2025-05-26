
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreVertical, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import TaskEventCard from "./TaskEventCard";
import { useCalendarTaskIntegration } from "@/hooks/useCalendarTaskIntegration";

interface EventCardProps {
  id: string;
  title: string;
  time?: string;
  location?: string;
  date: Date;
  type: "event" | "task" | "reminder";
  color?: string;
  description?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  time,
  location,
  date,
  type,
  color,
  description,
  onEdit,
  onDelete,
  onClick,
  className
}) => {
  const { toggleTaskFromCalendar } = useCalendarTaskIntegration();

  // Если это задача, используем специальный компонент
  if (type === "task") {
    // Создаем объект события для TaskEventCard
    const taskEvent: CalendarEvent = {
      id,
      title,
      description,
      startDate: date.toISOString(),
      allDay: true,
      type: "task",
      recurring: false,
      user_id: "",
      created_at: "",
      updated_at: "",
      content: {
        taskId: id,
        priority: 'medium', // TODO: получать из реальных данных
        completed: 'false'  // TODO: получать из реальных данных
      }
    };

    return (
      <TaskEventCard
        event={taskEvent}
        onToggleComplete={toggleTaskFromCalendar}
        onClick={() => onClick?.(id)}
        className={className}
      />
    );
  }

  const getTypeIcon = () => {
    switch (type) {
      case "reminder":
        return "🔔";
      default:
        return "📅";
    }
  };

  const getTypeBadgeClass = () => {
    switch (type) {
      case "reminder":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <div
      className={`p-3 rounded-md border bg-card hover:shadow-sm hover:border-primary/30 transition-all cursor-pointer ${className}`}
      style={color ? { borderLeftColor: color, borderLeftWidth: '4px' } : {}}
      onClick={() => onClick?.(id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{getTypeIcon()}</span>
            <h4 className="font-medium text-sm truncate">{title}</h4>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={`text-xs ${getTypeBadgeClass()}`}>
              {type === "reminder" ? "Напоминание" : "Событие"}
            </Badge>
            {time && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {time}
              </div>
            )}
          </div>

          {location && (
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EventCard;
