
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from "./EventForm";
import { CalendarEvent } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

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

interface EventDialogsProps {
  date: Date | undefined;
  isAddEventOpen: boolean;
  setIsAddEventOpen: (open: boolean) => void;
  isEditEventOpen: boolean;
  setIsEditEventOpen: (open: boolean) => void;
  eventForm: Partial<EventFormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  resetEventForm: () => void;
  currentEventId: string | null;
  createEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
}

const EventDialogs: React.FC<EventDialogsProps> = ({
  date,
  isAddEventOpen,
  setIsAddEventOpen,
  isEditEventOpen,
  setIsEditEventOpen,
  eventForm,
  handleInputChange,
  resetEventForm,
  currentEventId,
  createEvent,
  updateEvent
}) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddEvent = () => {
    if (!eventForm.title) {
      toast({
        title: "Ошибка",
        description: "Название события обязательно",
        variant: "destructive"
      });
      return;
    }

    if (!date || !user) {
      toast({
        title: "Ошибка",
        description: "Дата и авторизация обязательны",
        variant: "destructive"
      });
      return;
    }

    // Формируем дату начала из выбранной даты и времени
    const eventDate = new Date(date);
    let startDate: Date;
    
    if (eventForm.startTime) {
      const [startHours, startMinutes] = eventForm.startTime.split(':').map(Number);
      startDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        startHours,
        startMinutes
      );
    } else {
      // Если время не указано, создаем событие на весь день
      startDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        0, 0, 0
      );
    }

    // Формируем дату окончания (если указано время окончания)
    let endDate: string | undefined = undefined;
    if (eventForm.endTime) {
      const [endHours, endMinutes] = eventForm.endTime.split(':').map(Number);
      const endDateTime = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        endHours,
        endMinutes
      );
      endDate = endDateTime.toISOString();
    }

    // Создаем событие для API
    const newEvent: Omit<CalendarEvent, 'id'> = {
      title: eventForm.title!,
      description: eventForm.description || '',
      startDate: startDate.toISOString(),
      endDate,
      allDay: !eventForm.startTime,
      location: eventForm.location,
      type: eventForm.type as "event" | "task" | "reminder",
      recurring: false,
      user_id: user.id,
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

  const handleUpdateEvent = () => {
    if (!currentEventId || !user) return;
    
    const eventDate = new Date(date!);
    let startDate: Date;
    
    if (eventForm.startTime) {
      const [startHours, startMinutes] = eventForm.startTime.split(':').map(Number);
      startDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        startHours,
        startMinutes
      );
    } else {
      startDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        0, 0, 0
      );
    }

    let endDate: string | undefined = undefined;
    if (eventForm.endTime) {
      const [endHours, endMinutes] = eventForm.endTime.split(':').map(Number);
      const endDateTime = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        endHours,
        endMinutes
      );
      endDate = endDateTime.toISOString();
    }

    const updatedEvent: CalendarEvent = {
      id: currentEventId,
      title: eventForm.title!,
      description: eventForm.description || '',
      startDate: startDate.toISOString(),
      endDate,
      allDay: !eventForm.startTime,
      location: eventForm.location,
      type: eventForm.type as "event" | "task" | "reminder",
      recurring: false,
      user_id: user.id,
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
  };

  return (
    <>
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
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
            onAddEvent={handleUpdateEvent}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventDialogs;
