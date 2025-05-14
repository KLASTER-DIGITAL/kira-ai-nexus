
import React, { useState, useEffect } from "react";
import DashboardItem from "./DashboardItem";
import ChatInterface from "../chat/ChatInterface";
import TaskList from "../tasks/TaskList";
import NotesList from "../notes/NotesList";
import CalendarView from "../calendar/CalendarView";
import { Bot, LayoutDashboard, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import AddWidgetDialog from "./AddWidgetDialog";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Function to open AI sidebar
  const openAISidebar = () => {
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
    <div>
      {/* Welcome Card */}
      <Card className="mb-6 overflow-hidden">
        <div className="md:grid md:grid-cols-2">
          <CardHeader className="gap-y-1 pb-0">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-kira-purple text-white">
                <LayoutDashboard size={18} />
              </div>
              <CardTitle>Добро пожаловать в KIRA AI</CardTitle>
            </div>
            <CardDescription>
              Ваш интеллектуальный помощник для управления задачами и информацией
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 md:pl-0">
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-kira-purple border-kira-purple/30 hover:bg-kira-purple hover:text-white"
                onClick={openAISidebar}
              >
                <Bot size={16} />
                <span>Спросить AI</span>
              </Button>
              
              <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs flex items-center">
                MVP версия
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Мой дашборд</h2>
          <span className="text-xs text-muted-foreground">
            {widgets.length} {widgets.length === 1 ? 'виджет' : widgets.length >= 2 && widgets.length <= 4 ? 'виджета' : 'виджетов'}
          </span>
        </div>
        <AddWidgetDialog onAddWidget={addWidget}>
          <Button 
            className="flex items-center gap-2 bg-kira-purple hover:bg-kira-purple-dark text-white"
          >
            <PlusCircle size={16} />
            <span>Добавить виджет</span>
          </Button>
        </AddWidgetDialog>
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
