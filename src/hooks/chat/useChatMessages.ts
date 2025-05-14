
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { ChatMessage, ChatAttachment } from '@/types/chat';
import { useChatSession } from './useChatSession';
import { useChatStorage } from './useChatStorage';
import { useChatAPI } from './useChatAPI';
import { useChatRealtime } from './useChatRealtime';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { sessionId, resetSession: resetSessionId } = useChatSession();
  const { saveMessage, fetchMessages } = useChatStorage(user?.id);
  const { sendToWebhook } = useChatAPI();

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
        const initialMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: "Привет! Я KIRA AI, ваш персональный ассистент. Чем могу помочь сегодня?",
          timestamp: new Date(),
          session_id: sessionId
        };

        // Save initial message to database
        await saveMessage(initialMessage);
        setMessages([initialMessage]);
      }
    };

    loadMessages();
  }, [sessionId, user, fetchMessages, saveMessage]);

  // Handle file attachments
  const addAttachment = useCallback((file: File) => {
    setAttachments(prev => [...prev, file]);
  }, []);

  const removeAttachment = useCallback((fileName: string) => {
    setAttachments(prev => prev.filter(file => file.name !== fileName));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  // Send message to n8n and process response
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !sessionId || (!content.trim() && attachments.length === 0)) return;

    setIsLoading(true);

    try {
      // Create file attachments metadata if files are present
      const fileAttachments: ChatAttachment[] = attachments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        local_id: URL.createObjectURL(file),
      }));

      // Create and save user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
        session_id: sessionId,
        ...(attachments.length > 0 && {
          extension: {
            files: fileAttachments
          }
        })
      };

      await saveMessage(userMessage);
      setMessages(prev => [...prev, userMessage]);

      // Send message to n8n webhook with files
      console.log('Sending message to webhook with attachments:', attachments.length);
      const data = await sendToWebhook(content, user.id, sessionId, attachments);

      // Create and save assistant message from response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.reply || "",
        timestamp: new Date(),
        session_id: sessionId,
        ...(data.files && data.files.length > 0 && {
          extension: {
            files: data.files,
            metadata: data.metadata
          }
        })
      };

      await saveMessage(assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
      
      // Clear attachments after successful send
      clearAttachments();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить сообщение или получить ответ",
        variant: "destructive",
      });
      
      // Add error message as assistant response
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.",
        timestamp: new Date(),
        session_id: sessionId
      };
      
      await saveMessage(errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [user, sessionId, attachments, saveMessage, sendToWebhook, toast, clearAttachments]);

  const resetSession = useCallback(() => {
    const newSessionId = resetSessionId();
    setMessages([]);
    clearAttachments();
  }, [resetSessionId, clearAttachments]);

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
    resetSession,
    attachments,
    addAttachment,
    removeAttachment,
    clearAttachments
  };
};
