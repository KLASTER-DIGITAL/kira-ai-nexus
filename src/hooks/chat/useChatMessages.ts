
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/chat';
import { useChatSession } from './useChatSession';
import { useChatStorage } from './useChatStorage';
import { useChatAttachments } from './useChatAttachments';
import { useMessageHandlers } from './useMessageHandlers';
import { useInitialMessage } from './useInitialMessage';
import { useChatRealtime } from './useChatRealtime';

export const useChatMessages = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { sessionId, resetSession } = useChatSession();
  const { saveMessage, fetchMessages } = useChatStorage(user?.id);
  const { attachments, addAttachment, removeAttachment, clearAttachments } = useChatAttachments();
  const { createInitialMessage } = useInitialMessage();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle new messages received via real-time subscription
  const handleNewMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      // Check if the message is already in the list
      const exists = prev.some(m => m.id === message.id);
      if (exists) return prev;
      return [...prev, message];
    });
  }, []);

  // Set up real-time subscription
  useChatRealtime(sessionId, handleNewMessage);

  // Initialize message handlers with current context
  const { sendMessage } = useMessageHandlers(
    user?.id,
    sessionId,
    saveMessage,
    setMessages,
    setIsLoading,
    clearAttachments
  );

  // Load messages when session changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId || !user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch existing messages from storage
        const chatHistory = await fetchMessages(sessionId);
        
        if (chatHistory.length === 0) {
          // If no messages, create welcome message
          const initialMessage = createInitialMessage(sessionId);
          await saveMessage(initialMessage);
          setMessages([initialMessage]);
        } else {
          setMessages(chatHistory);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить историю сообщений",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [sessionId, user?.id, fetchMessages, saveMessage, createInitialMessage, toast]);

  // Reset session - clear messages and create a new session
  const handleResetSession = useCallback(() => {
    const newSessionId = resetSession();
    setMessages([]);
    return newSessionId;
  }, [resetSession]);

  return {
    messages,
    isLoading,
    sendMessage,
    resetSession: handleResetSession,
    attachments,
    addAttachment,
    removeAttachment
  };
};
