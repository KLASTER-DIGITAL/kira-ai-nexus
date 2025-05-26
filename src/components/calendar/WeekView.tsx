
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";

interface WeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  onEditEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onEventClick: (id: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  onDateChange,
  events,
  onEditEvent,
  onDeleteEvent,
  onEventClick
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePrevWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  return (
    <div className="w-full">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(weekStart, 'd MMMM', { locale: ru })} - {format(weekEnd, 'd MMMM yyyy', { locale: ru })}
          </h3>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-1 border rounded-lg overflow-hidden">
        {/* Day Headers */}
        {weekDays.map((day) => (
          <div key={day.toString()} className="border-b bg-muted/50 p-2 text-center">
            <div className="text-xs text-muted-foreground">
              {format(day, 'EEE', { locale: ru })}
            </div>
            <div className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}

        {/* Day Cells */}
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div key={day.toString()} className="min-h-[200px] p-1 border-r last:border-r-0">
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    time={event.allDay ? undefined : format(new Date(event.startDate), 'HH:mm')}
                    location={event.location}
                    date={new Date(event.startDate)}
                    type={event.type}
                    color={event.content?.color}
                    description={event.description}
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                    onClick={onEventClick}
                    className="text-xs"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
