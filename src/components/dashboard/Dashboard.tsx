
import React, { useState, useEffect } from "react";
import DashboardItem from "./DashboardItem";
import ChatInterface from "../chat/ChatInterface";
import TaskList from "../tasks/TaskList";
import NotesList from "../notes/NotesList";
import CalendarView from "../calendar/CalendarView";
import { AlertCircle, Bot } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ANIMATIONS } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import AddWidgetDialog from "./AddWidgetDialog";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string;
  title: string;
  type: string;
  i: string; // grid identifier
  x: number; // column position
  y: number; // row position
  w: number; // width in columns
  h: number; // height in rows
  minW?: number;
  minH?: number;
}

const Dashboard: React.FC = () => {
  // Initial widgets with layout information
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "chat", title: "Чат с KIRA AI", type: "chat", i: "chat", x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    { id: "tasks", title: "Мои задачи", type: "tasks", i: "tasks", x: 1, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
    { id: "notes", title: "Заметки", type: "notes", i: "notes", x: 0, y: 2, w: 1, h: 1, minW: 1, minH: 1 },
    { id: "calendar", title: "Календарь", type: "calendar", i: "calendar", x: 1, y: 1, w: 1, h: 2, minW: 1, minH: 2 },
  ]);

  const [layouts, setLayouts] = useState({
    lg: widgets.map(({ i, x, y, w, h, minW, minH }) => ({ i, x, y, w, h, minW, minH })),
  });

  // Load saved layout from localStorage on component mount
  useEffect(() => {
    const savedWidgets = localStorage.getItem("dashboardWidgets");
    const savedLayouts = localStorage.getItem("dashboardLayouts");
    
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
    
    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts));
    }
  }, []);

  // Save layout to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dashboardWidgets", JSON.stringify(widgets));
    localStorage.setItem("dashboardLayouts", JSON.stringify(layouts));
  }, [widgets, layouts]);

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id));
    toast({
      title: "Виджет удален",
      description: "Вы можете добавить его снова позже",
    });
  };

  const addWidget = (type: string) => {
    // Create a unique ID
    const timestamp = Date.now();
    const id = `${type}-${timestamp}`;
    
    // Get widget title based on type
    const getTitle = () => {
      switch (type) {
        case "chat":
          return "Чат с KIRA AI";
        case "tasks":
          return "Мои задачи";
        case "notes":
          return "Заметки";
        case "calendar":
          return "Календарь";
        default:
          return "Новый виджет";
      }
    };
    
    // Create new widget
    const newWidget: Widget = {
      id,
      title: getTitle(),
      type,
      i: id, // grid identifier matches the widget ID
      x: 0,  // Default position - will be automatically adjusted by react-grid-layout
      y: 0,
      w: type === "chat" || type === "calendar" ? 1 : 1,
      h: type === "chat" || type === "calendar" ? 2 : 1,
      minW: 1,
      minH: 1,
    };
    
    setWidgets([...widgets, newWidget]);
    
    toast({
      title: "Виджет добавлен",
      description: `Виджет "${getTitle()}" успешно добавлен на дашборд`,
    });
  };

  const onLayoutChange = (currentLayout: any) => {
    setLayouts({ ...layouts, lg: currentLayout });
  };

  // Function to open AI sidebar (using document click to trigger the floating button)
  const openAISidebar = () => {
    // Find the AI button in the DOM and click it programmatically
    const aiButton = document.querySelector('[data-ai-trigger="true"]') as HTMLButtonElement;
    if (aiButton) {
      aiButton.click();
    } else {
      toast({
        title: "AI Ассистент",
        description: "Нажмите на плавающую кнопку AI в правом нижнем углу экрана.",
      });
    }
  };

  return (
    <div className={ANIMATIONS.fadeIn}>
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
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-kira-purple/10 text-kira-purple border-kira-purple/30 hover:bg-kira-purple hover:text-white"
            onClick={openAISidebar}
          >
            <Bot size={18} />
            <span>Спросить AI</span>
          </Button>
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center animate-pulse-slow">
            <AlertCircle size={14} className="mr-1" />
            <span>MVP версия</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <AddWidgetDialog onAddWidget={addWidget} />
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={250}
        onLayoutChange={onLayoutChange}
        isDraggable={true}
        isResizable={true}
        compactType="vertical"
        margin={[16, 16]}
      >
        {widgets.map((widget) => (
          <div key={widget.i}>
            <DashboardItem
              title={widget.title}
              onRemove={() => removeWidget(widget.id)}
            >
              {widget.type === "chat" && <ChatInterface />}
              {widget.type === "tasks" && <TaskList />}
              {widget.type === "notes" && <NotesList />}
              {widget.type === "calendar" && <CalendarView />}
            </DashboardItem>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
