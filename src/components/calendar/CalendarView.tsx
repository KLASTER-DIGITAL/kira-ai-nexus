
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
}

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Брифинг по разработке",
      date: new Date(2025, 4, 13),
      time: "10:00",
    },
    {
      id: "2",
      title: "Планирование спринта",
      date: new Date(2025, 4, 14),
      time: "14:30",
    },
    {
      id: "3",
      title: "Код ревью",
      date: new Date(2025, 4, 15),
      time: "11:00",
    },
  ]);

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

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-[350px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border rounded-md p-3"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">
            События на {date?.toLocaleDateString()}
          </h3>
          <Button size="sm" className="flex items-center gap-1">
            <Plus size={14} />
            <span>Добавить событие</span>
          </Button>
        </div>

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-2">
            {selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 border rounded-md bg-card"
              >
                <h4 className="font-medium">{event.title}</h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock size={14} className="mr-1" />
                  <span>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Нет событий на выбранную дату
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
