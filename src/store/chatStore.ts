
import { create } from 'zustand';
import { ChatMessage } from '@/types/chat';

interface ChatState {
  activeSessionId: string | null;
  sessionsMap: Record<string, ChatMessage[]>;
  isLoading: boolean;
  setActiveSessionId: (sessionId: string) => void;
  updateMessages: (sessionId: string, messages: ChatMessage[]) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  setLoading: (isLoading: boolean) => void;
  clearSession: (sessionId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeSessionId: null,
  sessionsMap: {},
  isLoading: false,
  setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId }),
  updateMessages: (sessionId, messages) => set((state) => ({
    sessionsMap: {
      ...state.sessionsMap,
      [sessionId]: messages
    }
  })),
  addMessage: (sessionId, message) => set((state) => {
    const currentMessages = state.sessionsMap[sessionId] || [];
    return {
      sessionsMap: {
        ...state.sessionsMap,
        [sessionId]: [...currentMessages, message]
      }
    };
  }),
  setLoading: (isLoading) => set({ isLoading }),
  clearSession: (sessionId) => set((state) => {
    // Create a new sessionsMap without the specified session
    const { [sessionId]: omit, ...rest } = state.sessionsMap;
    return {
      sessionsMap: rest,
      // If clearing the active session, set activeSessionId to null
      activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId
    };
  })
}));
