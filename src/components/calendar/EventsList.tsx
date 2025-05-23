
import React from "react";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

interface EventsListProps {
  date: Date | undefined;
  isLoading: boolean;
  error: unknown;
  selectedDateEvents: CalendarEvent[];
  onAddEventClick: () => void;
  onEditEvent?: (id: string) => void;
  onDeleteEvent?: (id: string) => void;
  onEventClick?: (id: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({
  date,
  isLoading,
  error,
  selectedDateEvents,
  onAddEventClick,
  onEditEvent,
  onDeleteEvent,
  onEventClick
}) => {
  const formattedDate = date ? format(date, 'dd MMMM yyyy') : '';
  const { toast } = useToast();
  
  // Use the hook for mapping events
  const { mapEventToCardProps } = useCalendarEvents({
    events: selectedDateEvents,
    selectedDate: date
  });

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
        {selectedDateEvents.map((event) => {
          const cardProps = mapEventToCardProps(event);
          return (
            <EventCard 
              key={event.id} 
              {...cardProps} 
              onEdit={onEditEvent}
              onDelete={(id: string) => {
                if (onDeleteEvent) {
                  onDeleteEvent(id);
                  toast({
                    title: "Событие удалено",
                    description: "Событие было успешно удалено из календаря"
                  });
                }
              }}
              onClick={onEventClick}
            />
          );
        })}
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
