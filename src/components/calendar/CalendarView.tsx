
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import EventCard, { EventCardProps } from "./EventCard";

// Заглушка для событий
const demoEvents: EventCardProps[] = [
  {
    id: "1",
    title: "Брифинг по разработке",
    date: new Date(2025, 4, 21),
    time: "10:00",
    location: "Конференц-зал",
    type: "event"
  },
  {
    id: "2",
    title: "Планирование спринта",
    date: new Date(2025, 4, 22),
    time: "14:30",
    location: "Онлайн",
    type: "event"
  },
  {
    id: "3",
    title: "Создать отчет по проекту",
    date: new Date(2025, 4, 23),
    time: "11:00",
    type: "task"
  },
  {
    id: "4",
    title: "Встреча с клиентом",
    date: new Date(2025, 4, 23),
    time: "15:00",
    location: "Офис клиента",
    type: "event"
  },
  {
    id: "5",
    title: "Дедлайн по задаче №123",
    date: new Date(2025, 4, 25),
    type: "reminder"
  }
];

interface EventFormData {
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  type: "task" | "event" | "reminder";
}

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState<EventCardProps[]>(demoEvents);
  const [eventForm, setEventForm] = useState<Partial<EventFormData>>({
    date: new Date(),
    type: "event"
  });
  const { toast } = useToast();

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

    const newEvent: EventCardProps = {
      id: `event-${Date.now()}`,
      title: eventForm.title!,
      date: eventForm.date || new Date(),
      time: eventForm.time,
      location: eventForm.location,
      type: eventForm.type || "event"
    };

    setEvents([...events, newEvent]);
    setIsAddEventOpen(false);
    setEventForm({ date: new Date(), type: "event" });

    toast({
      title: "Событие добавлено",
      description: `Событие "${newEvent.title}" успешно добавлено в календарь`
    });
  };

  const getEventsForSelectedDate = () => {
    if (!date) return [];
    return events.filter(
      (event) =>
        event.date.getFullYear() === date.getFullYear() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getDate() === date.getDate()
    );
  };

  const selectedDateEvents = getEventsForSelectedDate();
  const formattedDate = date ? format(date, 'dd MMMM yyyy') : '';

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
              {events.length} событий на {format(date || new Date(), 'MMMM yyyy')}
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
                  <Label htmlFor="time" className="text-right">Время</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={eventForm.time || ''}
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

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-2">
            {selectedDateEvents.map((event) => (
              <EventCard key={event.id} {...event} />
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
