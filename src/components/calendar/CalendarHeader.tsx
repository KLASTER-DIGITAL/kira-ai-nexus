
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { DialogTrigger } from "@/components/ui/dialog";

interface CalendarHeaderProps {
  date: Date | undefined;
  setIsAddEventOpen: (open: boolean) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ date, setIsAddEventOpen }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium flex items-center">
        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
        События на {date ? format(date, 'dd MMMM yyyy') : ''}
      </h3>

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
