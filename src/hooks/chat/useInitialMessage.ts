
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export const useInitialMessage = () => {
  const createInitialMessage = useCallback((sessionId: string): ChatMessage => {
    return {
      id: uuidv4(),
      role: 'assistant',
      content: "Привет! Я KIRA AI, ваш персональный ассистент. Чем могу помочь сегодня?",
      timestamp: new Date(),
      session_id: sessionId
    };
  }, []);

  return { createInitialMessage };
};
