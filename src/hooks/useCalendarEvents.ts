
import { useCallback, useMemo } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

interface UseCalendarEventsProps {
  events: CalendarEvent[] | undefined;
  selectedDate: Date | undefined;
}

export const useCalendarEvents = ({ 
  events, 
  selectedDate 
}: UseCalendarEventsProps) => {
  // Get events for a specific date
  const getEventsForSelectedDate = useCallback(() => {
    if (!selectedDate || !events) return [];
    
    // Filter events for the selected date
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    });
  }, [events, selectedDate]);

  // Map event to card props format
  const mapEventToCardProps = useCallback((event: CalendarEvent) => {
    const eventDate = new Date(event.startDate);
    
    return {
      id: event.id,
      title: event.title,
      date: eventDate,
      time: event.allDay ? undefined : format(eventDate, 'HH:mm'),
      location: event.location,
      type: event.type,
      color: event.content?.color,
      description: event.description
    };
  }, []);

  // Memoize the selected date events to prevent unnecessary recalculations
  const selectedDateEvents = useMemo(() => {
    return getEventsForSelectedDate();
  }, [getEventsForSelectedDate]);

  return {
    selectedDateEvents,
    mapEventToCardProps,
    getEventsForSelectedDate
  };
};
