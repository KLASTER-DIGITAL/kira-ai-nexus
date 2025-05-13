
import React, { useState } from "react";
import DashboardItem from "./DashboardItem";
import ChatInterface from "../chat/ChatInterface";
import TaskList from "../tasks/TaskList";
import NotesList from "../notes/NotesList";
import CalendarView from "../calendar/CalendarView";
import { PlusCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  // This is a simple placeholder for drag-and-drop functionality
  // In a complete implementation, we'd use libraries like react-grid-layout or @dnd-kit/core
  const [widgets, setWidgets] = useState([
    { id: "chat", title: "Чат с KIRA AI", type: "chat" },
    { id: "tasks", title: "Мои задачи", type: "tasks" },
    { id: "notes", title: "Заметки", type: "notes" },
    { id: "calendar", title: "Календарь", type: "calendar" },
  ]);

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id));
    toast({
      title: "Виджет удален",
      description: "Вы можете добавить его снова позже",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-kira-purple to-kira-blue bg-clip-text text-transparent">
            Добро пожаловать в KIRA AI
          </h1>
          <p className="text-muted-foreground">
            Ваш интеллектуальный помощник для управления задачами и информацией
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center animate-pulse-slow">
            <AlertCircle size={14} className="mr-1" />
            <span>MVP версия</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {widgets.map((widget) => (
          <DashboardItem
            key={widget.id}
            title={widget.title}
            onRemove={() => removeWidget(widget.id)}
          >
            {widget.type === "chat" && <ChatInterface />}
            {widget.type === "tasks" && <TaskList />}
            {widget.type === "notes" && <NotesList />}
            {widget.type === "calendar" && <CalendarView />}
          </DashboardItem>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
