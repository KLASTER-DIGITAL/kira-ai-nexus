
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { ChatMessage } from '@/types/chat';
import { useChatSession } from './useChatSession';
import { useChatStorage } from './useChatStorage';
import { useChatRealtime } from './useChatRealtime';
import { useChatAttachments } from './useChatAttachments';
import { useMessageHandlers } from './useMessageHandlers';
import { useInitialMessage } from './useInitialMessage';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { sessionId, resetSession: resetSessionId } = useChatSession();
  const { saveMessage, fetchMessages } = useChatStorage(user?.id);
  const { attachments, addAttachment, removeAttachment, clearAttachments } = useChatAttachments();
  const { createInitialMessage } = useInitialMessage();
  
  // Handle new messages from realtime subscription
  const handleNewRealtimeMessage = useCallback((newMessage: ChatMessage) => {
    setMessages(prev => {
      // Avoid duplicating messages
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
  }, []);

  // Set up realtime subscription
  useChatRealtime(sessionId, handleNewRealtimeMessage);

  // Fetch messages for current session
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId || !user) return;

      const existingMessages = await fetchMessages(sessionId);
      
      if (existingMessages.length > 0) {
        setMessages(existingMessages);
      } else {
        // Add initial message if no messages exist
        const initialMessage = createInitialMessage(sessionId);

        // Save initial message to database
        await saveMessage(initialMessage);
        setMessages([initialMessage]);
      }
    };

    loadMessages();
  }, [sessionId, user, fetchMessages, saveMessage, createInitialMessage]);

  // Set up message handlers
  const { sendMessage } = useMessageHandlers(
    user?.id, 
    sessionId, 
    saveMessage, 
    setMessages, 
    setIsLoading, 
    clearAttachments
  );

  // Combined send message function that includes attachments
  const handleSendMessage = useCallback(async (content: string) => {
    await sendMessage(content, attachments);
  }, [sendMessage, attachments]);

  // Reset chat session
  const resetSession = useCallback(() => {
    const newSessionId = resetSessionId();
    setMessages([]);
    clearAttachments();
  }, [resetSessionId, clearAttachments]);

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage: handleSendMessage,
    resetSession,
    attachments,
    addAttachment,
    removeAttachment,
    clearAttachments
  };
};
