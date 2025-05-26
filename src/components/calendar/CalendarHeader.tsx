
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarViewType } from "@/types/calendar";
import CalendarViewSwitcher from "./CalendarViewSwitcher";

interface CalendarHeaderProps {
  date: Date | undefined;
  setIsAddEventOpen: (open: boolean) => void;
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  date, 
  setIsAddEventOpen, 
  currentView, 
  onViewChange 
}) => {
  const getDateLabel = () => {
    if (!date) return '';
    
    switch (currentView) {
      case 'day':
        return format(date, 'dd MMMM yyyy', { locale: ru });
      case 'week':
        return `Неделя ${format(date, 'dd MMMM yyyy', { locale: ru })}`;
      case 'month':
      default:
        return format(date, 'MMMM yyyy', { locale: ru });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-4">
        <h3 className="font-medium flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          {getDateLabel()}
        </h3>
        
        <CalendarViewSwitcher 
          currentView={currentView}
          onViewChange={onViewChange}
        />
      </div>

      <Button 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => setIsAddEventOpen(true)}
      >
        <Plus size={14} />
        <span>Добавить событие</span>
      </Button>
    </div>
  );
};

export default CalendarHeader;
