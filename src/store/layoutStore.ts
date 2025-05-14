
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for layout widgets
export interface LayoutWidget {
  id: string;
  title: string;
  type: 'chat' | 'tasks' | 'notes' | 'calendar' | string;
  gridArea?: string;
  isVisible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
}

interface LayoutState {
  widgets: LayoutWidget[];
  setWidgets: (widgets: LayoutWidget[]) => void;
  addWidget: (widget: Omit<LayoutWidget, 'order'>) => void;
  removeWidget: (id: string) => void;
  toggleWidgetVisibility: (id: string) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  resetLayout: () => void;
}

// Default widgets configuration
const defaultWidgets: LayoutWidget[] = [
  { id: "chat", title: "Чат с KIRA AI", type: "chat", isVisible: true, order: 0, size: 'medium' },
  { id: "tasks", title: "Мои задачи", type: "tasks", isVisible: true, order: 1, size: 'medium' },
  { id: "notes", title: "Заметки", type: "notes", isVisible: true, order: 2, size: 'medium' },
  { id: "calendar", title: "Календарь", type: "calendar", isVisible: true, order: 3, size: 'medium' },
];

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      widgets: [...defaultWidgets],
      
      setWidgets: (widgets) => set({ widgets }),
      
      addWidget: (widget) => set((state) => ({ 
        widgets: [...state.widgets, { ...widget, order: state.widgets.length }]
      })),
      
      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(w => w.id !== id)
      })),
      
      toggleWidgetVisibility: (id) => set((state) => ({
        widgets: state.widgets.map(w => 
          w.id === id ? { ...w, isVisible: !w.isVisible } : w
        )
      })),
      
      reorderWidgets: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.widgets);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        // Update order properties
        return {
          widgets: result.map((widget, index) => ({ ...widget, order: index }))
        };
      }),
      
      resetLayout: () => set({ widgets: [...defaultWidgets] }),
    }),
    {
      name: 'kira-layout-storage',
    }
  )
);
