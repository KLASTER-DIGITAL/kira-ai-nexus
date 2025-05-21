
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
  {
    id: "3",
    title: "Дедлайн по разработке функционала календаря",
    description: "Завершить разработку и тестирование функционала календаря",
    startDate: "2025-05-21T00:00:00",
    endDate: null,
    allDay: true,
    type: "reminder",
    recurring: false,
    user_id: "user123",
    created_at: "2025-05-12T09:00:00",
    updated_at: "2025-05-12T09:00:00",
    content: {
      color: "#f59e0b"
    }
  },
  {
    id: "4",
    title: "Рефакторинг кода",
    description: "Оптимизировать структуру проекта и улучшить производительность",
    startDate: "2025-05-22T10:00:00",
    endDate: "2025-05-22T12:00:00",
    allDay: false,
    type: "task",
    recurring: false,
    user_id: "user123",
    created_at: "2025-05-13T09:00:00",
    updated_at: "2025-05-13T09:00:00",
    content: {
      color: "#3b82f6"
    }
  },
];

interface CalendarFilter {
  startDate?: Date;
  endDate?: Date;
  type?: string[];
  search?: string;
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
        
        // Фильтр по дате
        if (filter.startDate) {
          matches = matches && new Date(event.endDate || event.startDate) >= filter.startDate;
        }
        
        if (filter.endDate) {
          matches = matches && new Date(event.startDate) <= filter.endDate;
        }
        
        // Фильтр по типу
        if (filter.type && filter.type.length > 0) {
          matches = matches && filter.type.includes(event.type);
        }
        
        // Поиск по тексту
        if (filter.search) {
          const searchLower = filter.search.toLowerCase();
          const titleMatches = event.title.toLowerCase().includes(searchLower);
          const descMatches = event.description ? event.description.toLowerCase().includes(searchLower) : false;
          const locationMatches = event.location ? event.location.toLowerCase().includes(searchLower) : false;
          
          matches = matches && (titleMatches || descMatches || locationMatches);
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
      
      console.log("Creating new event:", event);
      
      // Для демонстрации добавляем в локальный массив
      mockEvents.push(event);
      
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
      console.log("Updating event:", updatedEvent);
      
      // Для демонстрации обновляем в локальном массиве
      const index = mockEvents.findIndex(e => e.id === updatedEvent.id);
      if (index !== -1) {
        mockEvents[index] = {
          ...updatedEvent,
          updated_at: new Date().toISOString()
        };
      }
      
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
      console.log("Deleting event:", eventId);
      
      // Для демонстрации удаляем из локального массива
      const index = mockEvents.findIndex(e => e.id === eventId);
      if (index !== -1) {
        mockEvents.splice(index, 1);
      }
      
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
