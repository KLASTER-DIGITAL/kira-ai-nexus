
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useCalendar } from "@/hooks/useCalendar";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCalendarRealtime } from "@/hooks/useCalendarRealtime";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import EventsList from "./EventsList";
import CalendarMonthInfo from "./CalendarMonthInfo";
import CalendarHeader from "./CalendarHeader";
import EventDialogs from "./EventDialogs";
import WeekView from "./WeekView";
import DayView from "./DayView";
import { CalendarEvent, CalendarViewType } from "@/types/calendar";
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

const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentView, setCurrentView] = useState<CalendarViewType>('month');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<EventFormData>>({
    date: new Date(),
    type: "event",
    color: "#4f46e5"
  });

  // Set up real-time subscriptions
  useCalendarRealtime();

  // Calculate date range based on current view
  const getDateRange = () => {
    if (!date) return { startDate: undefined, endDate: undefined };

    switch (currentView) {
      case 'day':
        return {
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        };
      case 'week':
        return {
          startDate: startOfWeek(date, { weekStartsOn: 1 }),
          endDate: endOfWeek(date, { weekStartsOn: 1 })
        };
      case 'month':
      default:
        return {
          startDate: startOfMonth(date),
          endDate: endOfMonth(date)
        };
    }
  };

  const { startDate, endDate } = getDateRange();

  // Используем хук useCalendar для получения событий
  const { events, isLoading, error, createEvent, updateEvent, deleteEvent } = useCalendar({
    startDate,
    endDate
  });

  // Use our hook for event filtering
  const { selectedDateEvents } = useCalendarEvents({
    events,
    selectedDate: date
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

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h3 className="text-lg font-medium mb-2">Необходима авторизация</h3>
        <p className="text-muted-foreground mb-4">
          Для использования календаря необходимо войти в систему
        </p>
      </div>
    );
  }

  const renderCalendarContent = () => {
    switch (currentView) {
      case 'week':
        return (
          <WeekView
            currentDate={date || new Date()}
            onDateChange={setDate}
            events={events || []}
            onEditEvent={handleEditEvent}
            onDeleteEvent={deleteEvent}
            onEventClick={handleEditEvent}
          />
        );
      case 'day':
        return (
          <DayView
            currentDate={date || new Date()}
            onDateChange={setDate}
            events={events || []}
            onEditEvent={handleEditEvent}
            onDeleteEvent={deleteEvent}
            onEventClick={handleEditEvent}
          />
        );
      case 'month':
      default:
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
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <CalendarHeader 
        date={date} 
        setIsAddEventOpen={setIsAddEventOpen}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {renderCalendarContent()}

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
