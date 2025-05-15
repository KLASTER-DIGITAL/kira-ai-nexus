
import React, { useEffect } from "react";
import { useAuth } from '@/context/auth';
import { DashboardWidget, useDashboardStore } from "@/store/dashboardStore";
import DashboardItem from "./DashboardItem";
import DashboardConfigDialog from "./DashboardConfigDialog";
import ChatInterface from "../chat/ChatInterface";
import TaskList from "../tasks/TaskList";
import NotesList from "../notes/NotesList";
import CalendarView from "../calendar/CalendarView";
import { PlusCircle, AlertCircle, Bot, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ANIMATIONS } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    widgets, 
    isLoading, 
    setConfigDialogOpen, 
    reorderWidgets,
    loadUserLayout,
    saveUserLayout
  } = useDashboardStore();

  // Load user layout on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserLayout(user.id);
    }
  }, [user?.id]);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find indexes
      const oldIndex = widgets.findIndex(w => w.id === active.id);
      const newIndex = widgets.findIndex(w => w.id === over.id);
      
      // Update widget order
      reorderWidgets(oldIndex, newIndex);
      
      // Show success message
      toast({
        title: "Виджет перемещен",
        description: "Новое расположение виджетов сохранено",
      });
    }
  };

  // Filter visible widgets and sort by order
  const visibleWidgets = widgets
    .filter(widget => widget.isVisible)
    .sort((a, b) => a.order - b.order);

  // Function to open configuration dialog
  const openConfigDialog = () => {
    setConfigDialogOpen(true);
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-kira-purple rounded-full border-t-transparent"></div>
      </div>
    );
  }

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
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={openConfigDialog}
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Настроить дашборд</span>
          </Button>
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center animate-pulse-slow">
            <AlertCircle size={14} className="mr-1" />
            <span>MVP версия</span>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleWidgets.map(w => w.id)}
          strategy={window.innerWidth < 768 ? verticalListSortingStrategy : horizontalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleWidgets.map((widget) => (
              <DashboardItem
                key={widget.id}
                id={widget.id}
                title={widget.title}
              >
                {widget.type === "chat" && <ChatInterface />}
                {widget.type === "tasks" && <TaskList />}
                {widget.type === "notes" && <NotesList />}
                {widget.type === "calendar" && <CalendarView />}
              </DashboardItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <DashboardConfigDialog />
    </div>
  );
};

export default Dashboard;
