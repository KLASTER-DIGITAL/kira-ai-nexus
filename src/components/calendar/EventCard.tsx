
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventCardProps {
  id: string;
  title: string;
  time?: string;
  location?: string;
  date: Date;
  type?: "task" | "event" | "reminder";
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  time,
  location,
  type = "event",
  className,
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

  return (
    <Card className={cn("mb-2 hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-3">
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <h4 className="font-medium line-clamp-2">{title}</h4>
            <Badge variant="outline" className={cn("ml-2 px-2 py-0 text-xs", getTypeColor())}>
              {type}
            </Badge>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
