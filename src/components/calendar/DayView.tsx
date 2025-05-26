
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";

interface DayViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  onEditEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onEventClick: (id: string) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  onDateChange,
  events,
  onEditEvent,
  onDeleteEvent,
  onEventClick
}) => {
  const handlePrevDay = () => {
    onDateChange(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(currentDate, 1));
  };

  const getEventsForDay = () => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, currentDate);
    }).sort((a, b) => {
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  };

  const dayEvents = getEventsForDay();
  const isToday = isSameDay(currentDate, new Date());

  return (
    <div className="w-full">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className={`text-lg font-medium ${isToday ? 'text-primary' : ''}`}>
            {format(currentDate, 'EEEE, d MMMM yyyy', { locale: ru })}
            {isToday && <span className="ml-2 text-sm text-primary">(Сегодня)</span>}
          </h3>
          <Button variant="outline" size="sm" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Content */}
      <div className="border rounded-lg">
        {/* All Day Events */}
        {dayEvents.some(event => event.allDay) && (
          <div className="border-b bg-muted/30 p-3">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Весь день</h4>
            <div className="space-y-2">
              {dayEvents.filter(event => event.allDay).map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  location={event.location}
                  date={new Date(event.startDate)}
                  type={event.type}
                  color={event.content?.color}
                  description={event.description}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                  onClick={onEventClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Timed Events */}
        <div className="p-3">
          {dayEvents.filter(event => !event.allDay).length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">События по времени</h4>
              {dayEvents.filter(event => !event.allDay).map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  time={format(new Date(event.startDate), 'HH:mm')}
                  location={event.location}
                  date={new Date(event.startDate)}
                  type={event.type}
                  color={event.content?.color}
                  description={event.description}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                  onClick={onEventClick}
                />
              ))}
            </div>
          ) : (
            !dayEvents.some(event => event.allDay) && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Нет событий на этот день</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DayView;
