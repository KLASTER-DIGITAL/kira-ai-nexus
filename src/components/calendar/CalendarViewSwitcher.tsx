
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, Clock } from "lucide-react";
import { CalendarViewType } from "@/types/calendar";
import { cn } from "@/lib/utils";

interface CalendarViewSwitcherProps {
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  className?: string;
}

const CalendarViewSwitcher: React.FC<CalendarViewSwitcherProps> = ({
  currentView,
  onViewChange,
  className
}) => {
  const views = [
    { type: 'month' as CalendarViewType, label: 'Месяц', icon: Calendar },
    { type: 'week' as CalendarViewType, label: 'Неделя', icon: CalendarDays },
    { type: 'day' as CalendarViewType, label: 'День', icon: Clock }
  ];

  return (
    <div className={cn("flex border rounded-md", className)}>
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <Button
            key={view.type}
            variant={currentView === view.type ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.type)}
            className={cn(
              "rounded-none first:rounded-l-md last:rounded-r-md",
              currentView === view.type && "bg-primary text-primary-foreground"
            )}
          >
            <Icon className="h-4 w-4 mr-1" />
            {view.label}
          </Button>
        );
      })}
    </div>
  );
};

export default CalendarViewSwitcher;
