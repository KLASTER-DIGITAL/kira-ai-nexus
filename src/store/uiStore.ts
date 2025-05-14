
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // AI sidebar state
  isAISidebarOpen: boolean;
  toggleAISidebar: () => void;
  
  // Toast messages queue
  toasts: Array<{id: string, message: string, type: 'success' | 'error' | 'info' | 'warning'}>;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // AI sidebar
      isAISidebarOpen: false,
      toggleAISidebar: () => set((state) => ({ isAISidebarOpen: !state.isAISidebarOpen })),
      
      // Toasts
      toasts: [],
      addToast: (message, type) => 
        set((state) => ({ 
          toasts: [...state.toasts, { id: Date.now().toString(), message, type }] 
        })),
      removeToast: (id) => 
        set((state) => ({ 
          toasts: state.toasts.filter(toast => toast.id !== id) 
        })),
    }),
    {
      name: 'kira-ui-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
