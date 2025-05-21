
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface CalendarMonthInfoProps {
  date: Date | undefined;
  eventsCount: number;
  isLoading: boolean;
}

const CalendarMonthInfo: React.FC<CalendarMonthInfoProps> = ({
  date,
  eventsCount,
  isLoading
}) => {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">События этого месяца</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <p className="text-xs text-muted-foreground mb-2">
          {isLoading ? 'Загрузка событий...' : `${eventsCount} событий на ${format(date || new Date(), 'MMMM yyyy')}`}
        </p>
        <div className="grid grid-cols-3 gap-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-xs">События</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs">Задачи</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-xs">Напоминания</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarMonthInfo;
