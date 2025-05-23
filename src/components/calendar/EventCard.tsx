
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface EventCardProps {
  id: string;
  title: string;
  time?: string;
  location?: string;
  date: Date;
  type?: "task" | "event" | "reminder";
  color?: string;
  description?: string;
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  time,
  location,
  type = "event",
  color,
  description,
  className,
  onEdit,
  onDelete,
  onClick,
}) => {
  const getTypeColor = () => {
    switch (type) {
      case "task":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "event":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "reminder":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Используем пользовательский цвет для левой границы, если он указан
  const cardStyle = color ? {
    borderLeft: `4px solid ${color}`
  } : {};
  
  const handleCardClick = () => {
    if (onClick) onClick(id);
  };

  const handleEdit = (e: Event | React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    if (onEdit) onEdit(id);
  };

  const handleDelete = (e: Event | React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card 
          className={cn("mb-2 hover:shadow-md transition-shadow cursor-pointer", className)} 
          style={cardStyle}
          onClick={handleCardClick}
        >
          <CardContent className="p-3">
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <h4 className="font-medium line-clamp-2">{title}</h4>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={cn("px-2 py-0 text-xs", getTypeColor())}>
                    {type}
                  </Badge>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <button 
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="p-1 rounded-full hover:bg-muted"
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1" align="end">
                      <div className="flex flex-col text-sm">
                        <button 
                          className="px-2 py-1.5 text-left hover:bg-muted rounded-sm"
                          onClick={handleEdit}
                        >
                          Редактировать
                        </button>
                        <button 
                          className="px-2 py-1.5 text-left hover:bg-muted text-destructive rounded-sm"
                          onClick={handleDelete}
                        >
                          Удалить
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {time && (
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  <span>{time}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="mr-1 h-3.5 w-3.5" />
                  <span className="truncate">{location}</span>
                </div>
              )}
              
              {description && (
                <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {description}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem onSelect={handleEdit}>
          Редактировать событие
        </ContextMenuItem>
        <ContextMenuItem 
          onSelect={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          Удалить событие
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default EventCard;
