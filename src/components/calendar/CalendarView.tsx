
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import EventCard from "./EventCard";
import { CalendarEvent } from "@/types/calendar";
import { useCalendar } from "@/hooks/useCalendar";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    setEventForm({
      date: new Date(),
      type: "event",
      color: "#4f46e5"
    });

    toast({
      title: "Событие добавлено",
      description: `Событие "${newEvent.title}" успешно добавлено в календарь`
    });
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

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-[350px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border rounded-md p-3"
        />

        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">События этого месяца</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 pt-0">
            <p className="text-xs text-muted-foreground mb-2">
              {isLoading ? 'Загрузка событий...' : `${events?.length || 0} событий на ${format(date || new Date(), 'MMMM yyyy')}`}
            </p>
            <div className="grid grid-cols-3 gap-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-xs">События</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs">Задачи</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs">Напоминания</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            События на {formattedDate}
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Название</Label>
                  <Input
                    id="title"
                    name="title"
                    value={eventForm.title || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Тип</Label>
                  <select
                    id="type"
                    name="type"
                    value={eventForm.type}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="event">Событие</option>
                    <option value="task">Задача</option>
                    <option value="reminder">Напоминание</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">Время начала</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={eventForm.startTime || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">Время окончания</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={eventForm.endTime || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Место</Label>
                  <Input
                    id="location"
                    name="location"
                    value={eventForm.location || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">Цвет</Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={eventForm.color || '#4f46e5'}
                      onChange={handleInputChange}
                      className="w-10 h-10 p-1"
                    />
                    <span className="text-sm">{eventForm.color}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">Описание</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={eventForm.description || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddEvent}>Создать событие</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Произошла ошибка при загрузке событий. Пожалуйста, попробуйте позже.
            </AlertDescription>
          </Alert>
        ) : selectedDateEvents.length > 0 ? (
          <div className="space-y-2">
            {selectedDateEvents.map((event) => (
              <EventCard key={event.id} {...mapEventToCardProps(event)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Нет событий на выбранную дату</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setIsAddEventOpen(true)}
            >
              Добавить событие
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
