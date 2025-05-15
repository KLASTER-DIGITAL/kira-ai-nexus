
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';

// Types for layout widgets
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chat' | 'tasks' | 'notes' | 'calendar' | string;
  gridArea?: string;
  isVisible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
}

interface DashboardState {
  widgets: DashboardWidget[];
  isLoading: boolean;
  isConfigDialogOpen: boolean;
  setWidgets: (widgets: DashboardWidget[]) => void;
  addWidget: (widget: Omit<DashboardWidget, 'order'>) => void;
  removeWidget: (id: string) => void;
  toggleWidgetVisibility: (id: string) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  resetLayout: () => void;
  loadUserLayout: (userId: string) => Promise<void>;
  saveUserLayout: (userId: string) => Promise<void>;
  setConfigDialogOpen: (isOpen: boolean) => void;
}

// Default widgets configuration
const defaultWidgets: DashboardWidget[] = [
  { id: "chat", title: "Чат с KIRA AI", type: "chat", isVisible: true, order: 0, size: 'medium' },
  { id: "tasks", title: "Мои задачи", type: "tasks", isVisible: true, order: 1, size: 'medium' },
  { id: "notes", title: "Заметки", type: "notes", isVisible: true, order: 2, size: 'medium' },
  { id: "calendar", title: "Календарь", type: "calendar", isVisible: true, order: 3, size: 'medium' },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: [...defaultWidgets],
      isLoading: false,
      isConfigDialogOpen: false,
      
      setWidgets: (widgets) => set({ widgets }),
      
      addWidget: (widget) => set((state) => ({ 
        widgets: [...state.widgets, { ...widget, order: state.widgets.length }]
      })),
      
      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(w => w.id !== id)
      })),
      
      toggleWidgetVisibility: (id) => {
        set((state) => ({
          widgets: state.widgets.map(w => 
            w.id === id ? { ...w, isVisible: !w.isVisible } : w
          )
        }));
        
        // Save changes to Supabase
        const { user } = useAuth();
        if (user?.id) {
          setTimeout(() => get().saveUserLayout(user.id), 0);
        }
      },
      
      reorderWidgets: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.widgets);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          
          // Update order properties
          const updatedWidgets = result.map((widget, index) => ({ ...widget, order: index }));
          
          return { widgets: updatedWidgets };
        });
        
        // Save changes to Supabase
        const { user } = useAuth();
        if (user?.id) {
          setTimeout(() => get().saveUserLayout(user.id), 0);
        }
      },
      
      resetLayout: () => {
        set({ widgets: [...defaultWidgets] });
        
        // Save changes to Supabase
        const { user } = useAuth();
        if (user?.id) {
          setTimeout(() => get().saveUserLayout(user.id), 0);
        }
      },
      
      loadUserLayout: async (userId) => {
        try {
          set({ isLoading: true });
          
          const { data, error } = await supabase
            .from('dashboard_layouts')
            .select('layout')
            .eq('user_id', userId)
            .single();
            
          if (error) {
            console.error('Error loading dashboard layout:', error);
            // If no layout found, use default
            return;
          }
          
          if (data && data.layout) {
            // Add type assertion to handle the conversion safely
            const layoutData = data.layout as unknown;
            set({ widgets: layoutData as DashboardWidget[] });
          }
        } catch (err) {
          console.error('Failed to load dashboard layout:', err);
        } finally {
          set({ isLoading: false });
        }
      },
      
      saveUserLayout: async (userId) => {
        try {
          const { widgets } = get();
          
          const { error } = await supabase
            .from('dashboard_layouts')
            .upsert({
              user_id: userId,
              layout: widgets as any, // Use type assertion to handle JSON serialization
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
            
          if (error) {
            console.error('Error saving dashboard layout:', error);
            toast({
              title: "Ошибка сохранения",
              description: "Не удалось сохранить настройки дашборда",
              variant: "destructive"
            });
          }
        } catch (err) {
          console.error('Failed to save dashboard layout:', err);
        }
      },
      
      setConfigDialogOpen: (isOpen) => set({ isConfigDialogOpen: isOpen }),
    }),
    {
      name: 'kira-dashboard-storage',
    }
  )
);
