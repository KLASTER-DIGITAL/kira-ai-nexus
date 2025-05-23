
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useCalendar } from "@/hooks/useCalendar";
import EventsList from "./EventsList";
import CalendarMonthInfo from "./CalendarMonthInfo";
import CalendarHeader from "./CalendarHeader";
import EventDialogs from "./EventDialogs";
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
        <CalendarHeader 
          date={date} 
          setIsAddEventOpen={setIsAddEventOpen} 
        />

        <EventsList
          date={date}
          isLoading={isLoading}
          error={error}
          selectedDateEvents={selectedDateEvents}
          onAddEventClick={() => setIsAddEventOpen(true)}
          onEditEvent={handleEditEvent}
          onDeleteEvent={deleteEvent}
          onEventClick={handleEditEvent}
        />
      </div>

      <EventDialogs 
        date={date}
        isAddEventOpen={isAddEventOpen}
        setIsAddEventOpen={setIsAddEventOpen}
        isEditEventOpen={isEditEventOpen}
        setIsEditEventOpen={setIsEditEventOpen}
        eventForm={eventForm}
        handleInputChange={handleInputChange}
        resetEventForm={resetEventForm}
        currentEventId={currentEventId}
        createEvent={createEvent}
        updateEvent={updateEvent}
      />
    </div>
  );
};

export default CalendarView;
