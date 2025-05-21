
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarEvent } from "@/types/calendar";

interface EventFormProps {
  eventForm: Partial<{
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    type: "task" | "event" | "reminder";
    color: string;
  }>;
  onClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddEvent: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  eventForm,
  onClose,
  onInputChange,
  onAddEvent
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Название</Label>
        <Input
          id="title"
          name="title"
          value={eventForm.title || ''}
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">Тип</Label>
        <select
          id="type"
          name="type"
          value={eventForm.type}
          onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">Место</Label>
        <Input
          id="location"
          name="location"
          value={eventForm.location || ''}
          onChange={onInputChange}
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
            onChange={onInputChange}
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
          onChange={onInputChange}
          className="col-span-3"
          rows={3}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={onAddEvent}>Создать событие</Button>
      </div>
    </div>
  );
};

export default EventForm;
