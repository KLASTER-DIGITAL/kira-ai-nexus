
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarEvent } from '@/types/calendar';

// Mock data and functions for now
// In a real implementation this would connect to your Supabase backend
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Запуск MVP",
    description: "Релиз MVP версии KIRA AI",
    startDate: "2025-05-24T09:00:00",
    endDate: "2025-05-24T10:30:00",
    allDay: false,
    type: "event",
    recurring: false,
    user_id: "user123",
    created_at: "2025-05-10T09:00:00",
    updated_at: "2025-05-10T09:00:00",
    content: {
      color: "#4f46e5"
    }
  },
  {
    id: "2",
    title: "Встреча с инвесторами",
    description: "Презентация KIRA AI потенциальным инвесторам",
    startDate: "2025-05-27T14:00:00",
    endDate: "2025-05-27T16:00:00",
    allDay: false,
    type: "event",
    recurring: false,
    user_id: "user123",
    created_at: "2025-05-10T09:00:00",
    updated_at: "2025-05-10T09:00:00",
    content: {
      color: "#10b981"
    }
  },
];

interface CalendarFilter {
  startDate?: Date;
  endDate?: Date;
}

export const useCalendar = (filter?: CalendarFilter) => {
  const queryClient = useQueryClient();
  
  // Fetch events with optional date range filtering
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['calendar', filter],
    queryFn: async () => {
      // In real implementation this would be a fetch to Supabase
      // With filters applied to the query
      return mockEvents.filter(event => {
        if (!filter) return true;
        
        let matches = true;
        
        if (filter.startDate) {
          matches = matches && new Date(event.endDate || "") >= filter.startDate;
        }
        
        if (filter.endDate) {
          matches = matches && new Date(event.startDate) <= filter.endDate;
        }
        
        return matches;
      });
    }
  });

  // Create new event
  const createEventMutation = useMutation({
    mutationFn: async (newEvent: Omit<CalendarEvent, 'id'>) => {
      // In real implementation this would be a POST to Supabase
      const event: CalendarEvent = {
        ...newEvent,
        id: Date.now().toString(),
      };
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });

  // Update event
  const updateEventMutation = useMutation({
    mutationFn: async (updatedEvent: CalendarEvent) => {
      // In real implementation this would be a PUT to Supabase
      return updatedEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });

  // Delete event
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      // In real implementation this would be a DELETE to Supabase
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });

  return {
    events,
    isLoading,
    error,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
  };
};
