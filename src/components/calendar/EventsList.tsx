
import React from "react";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface EventsListProps {
  date: Date | undefined;
  isLoading: boolean;
  error: unknown;
  selectedDateEvents: CalendarEvent[];
  onAddEventClick: () => void;
}

const EventsList: React.FC<EventsListProps> = ({
  date,
  isLoading,
  error,
  selectedDateEvents,
  onAddEventClick
}) => {
  const formattedDate = date ? format(date, 'dd MMMM yyyy') : '';

  // Преобразование CalendarEvent в формат EventCardProps
  const mapEventToCardProps = (event: CalendarEvent) => {
    const eventDate = new Date(event.startDate);
    
    return {
      id: event.id,
      title: event.title,
      date: eventDate,
      time: event.allDay ? undefined : format(eventDate, 'HH:mm'),
      location: event.location,
      type: event.type,
      color: event.content?.color
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Произошла ошибка при загрузке событий. Пожалуйста, попробуйте позже.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (selectedDateEvents.length > 0) {
    return (
      <div className="space-y-2">
        {selectedDateEvents.map((event) => (
          <EventCard key={event.id} {...mapEventToCardProps(event)} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>Нет событий на выбранную дату</p>
      <Button 
        variant="outline" 
        className="mt-2"
        onClick={onAddEventClick}
      >
        Добавить событие
      </Button>
    </div>
  );
};

export default EventsList;
