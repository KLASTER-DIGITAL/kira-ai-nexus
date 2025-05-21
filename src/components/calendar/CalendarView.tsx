
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCalendar } from "@/hooks/useCalendar";
import EventForm from "./EventForm";
import EventsList from "./EventsList";
import CalendarMonthInfo from "./CalendarMonthInfo";
import { CalendarEvent } from "@/types/calendar";

interface EventFormData {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  type: "task" | "event" | "reminder";
  color: string;
}

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<EventFormData>>({
    date: new Date(),
    type: "event",
    color: "#4f46e5" // Индиго по умолчанию
  });
  const { toast } = useToast();

  // Используем хук useCalendar для получения событий
  const { events, isLoading, error, createEvent, updateEvent, deleteEvent } = useCalendar({
    startDate: date ? new Date(date.getFullYear(), date.getMonth(), 1) : undefined,
    endDate: date ? new Date(date.getFullYear(), date.getMonth() + 1, 0) : undefined
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm({
      ...eventForm,
      [name]: value
    });
  };

  const handleAddEvent = () => {
    if (!eventForm.title) {
      toast({
        title: "Ошибка",
        description: "Название события обязательно",
        variant: "destructive"
      });
      return;
    }

    if (!date || !eventForm.startTime) {
      toast({
        title: "Ошибка",
        description: "Дата и время начала обязательны",
        variant: "destructive"
      });
      return;
    }

    // Формируем дату начала из выбранной даты и времени
    const eventDate = new Date(date);
    const [startHours, startMinutes] = eventForm.startTime.split(':').map(Number);
    const startDate = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      startHours,
      startMinutes
    );

    // Формируем дату окончания (если указано время окончания)
    let endDate = null;
    if (eventForm.endTime) {
      const [endHours, endMinutes] = eventForm.endTime.split(':').map(Number);
      endDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        endHours,
        endMinutes
      );
    }

    // Создаем событие для API
    const newEvent: Omit<CalendarEvent, 'id'> = {
      title: eventForm.title!,
      description: eventForm.description || '',
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : undefined,
      allDay: !eventForm.startTime,
      location: eventForm.location,
      type: eventForm.type as "event" | "task" | "reminder",
      recurring: false,
      user_id: "user123", // Будет заменено на реальный ID пользователя при интеграции с авторизацией
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: {
        color: eventForm.color
      }
    };

    // Отправляем запрос на создание события
    createEvent(newEvent);
    setIsAddEventOpen(false);
    resetEventForm();

    toast({
      title: "Событие добавлено",
      description: `Событие "${newEvent.title}" успешно добавлено в календарь`
    });
  };

  const handleEditEvent = (id: string) => {
    const eventToEdit = events?.find(event => event.id === id);
    if (!eventToEdit) return;

    const eventDate = new Date(eventToEdit.startDate);
    const startTime = eventToEdit.allDay ? '' : format(eventDate, 'HH:mm');
    
    let endTime = '';
    if (eventToEdit.endDate) {
      const endDate = new Date(eventToEdit.endDate);
      endTime = format(endDate, 'HH:mm');
    }

    setEventForm({
      title: eventToEdit.title,
      date: eventDate,
      startTime,
      endTime,
      location: eventToEdit.location || '',
      description: eventToEdit.description || '',
      type: eventToEdit.type,
      color: eventToEdit.content?.color || '#4f46e5'
    });

    setCurrentEventId(id);
    setIsEditEventOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
  };

  const handleEventClick = (id: string) => {
    handleEditEvent(id);
  };

  const resetEventForm = () => {
    setEventForm({
      date: new Date(),
      type: "event",
      color: "#4f46e5"
    });
    setCurrentEventId(null);
  };

  const getEventsForSelectedDate = () => {
    if (!date || !events) return [];
    
    // Фильтруем события для выбранной даты
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-[350px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border rounded-md p-3"
        />

        <CalendarMonthInfo 
          date={date} 
          eventsCount={events?.length || 0} 
          isLoading={isLoading} 
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            События на {date ? format(date, 'dd MMMM yyyy') : ''}
          </h3>

          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus size={14} />
                <span>Добавить событие</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Создать новое событие</DialogTitle>
              </DialogHeader>
              <EventForm 
                eventForm={eventForm}
                onClose={() => setIsAddEventOpen(false)}
                onInputChange={handleInputChange}
                onAddEvent={handleAddEvent}
              />
            </DialogContent>
          </Dialog>
        </div>

        <EventsList
          date={date}
          isLoading={isLoading}
          error={error}
          selectedDateEvents={selectedDateEvents}
          onAddEventClick={() => setIsAddEventOpen(true)}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onEventClick={handleEventClick}
        />
      </div>

      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактировать событие</DialogTitle>
          </DialogHeader>
          <EventForm 
            eventForm={eventForm}
            onClose={() => {
              setIsEditEventOpen(false);
              resetEventForm();
            }}
            onInputChange={handleInputChange}
            onAddEvent={() => {
              if (!currentEventId) return;
              
              const eventDate = new Date(date!);
              const [startHours, startMinutes] = (eventForm.startTime || '00:00').split(':').map(Number);
              const startDate = new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                startHours,
                startMinutes
              );

              let endDate = null;
              if (eventForm.endTime) {
                const [endHours, endMinutes] = eventForm.endTime.split(':').map(Number);
                endDate = new Date(
                  eventDate.getFullYear(),
                  eventDate.getMonth(),
                  eventDate.getDate(),
                  endHours,
                  endMinutes
                );
              }

              const updatedEvent: CalendarEvent = {
                id: currentEventId,
                title: eventForm.title!,
                description: eventForm.description || '',
                startDate: startDate.toISOString(),
                endDate: endDate ? endDate.toISOString() : undefined,
                allDay: !eventForm.startTime,
                location: eventForm.location,
                type: eventForm.type as "event" | "task" | "reminder",
                recurring: false,
                user_id: "user123",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                content: {
                  color: eventForm.color
                }
              };

              updateEvent(updatedEvent);
              setIsEditEventOpen(false);
              resetEventForm();

              toast({
                title: "Событие обновлено",
                description: `Событие "${updatedEvent.title}" успешно обновлено`
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
