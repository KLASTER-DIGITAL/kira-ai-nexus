
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from './use-toast';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  session_id: string;
}

export interface N8nResponse {
  reply: string;
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize or get existing session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chat_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('chat_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Fetch messages for current session
  useEffect(() => {
    const fetchMessages = async () => {
      if (!sessionId || !user) return;

      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedMessages: ChatMessage[] = data.map(msg => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at),
            session_id: msg.session_id
          }));
          setMessages(formattedMessages);
        } else if (data && data.length === 0) {
          // Add initial message if no messages exist
          const initialMessage: ChatMessage = {
            id: uuidv4(),
            role: 'assistant',
            content: "Привет! Я KIRA AI, ваш персональный ассистент. Чем могу помочь сегодня?",
            timestamp: new Date(),
            session_id: sessionId
          };

          // Save initial message to database
          await saveMessageToSupabase(initialMessage);
          setMessages([initialMessage]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить историю сообщений",
          variant: "destructive",
        });
      }
    };

    fetchMessages();
  }, [sessionId, user, toast]);

  // Set up realtime subscription
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Avoid duplicating messages that we just added
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            
            const formattedMessage: ChatMessage = {
              id: newMessage.id,
              role: newMessage.role,
              content: newMessage.content,
              timestamp: new Date(newMessage.created_at),
              session_id: newMessage.session_id
            };
            
            return [...prev, formattedMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Get webhook URL from config
  const getWebhookUrl = async (): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('global_config')
        .select('n8n_webhook_test, n8n_webhook_production, n8n_mode')
        .single();

      if (error) throw error;

      if (data.n8n_mode === 'production' && data.n8n_webhook_production) {
        return data.n8n_webhook_production;
      }
      return data.n8n_webhook_test;
    } catch (error) {
      console.error("Error fetching webhook URL:", error);
      // Fallback to default webhook
      return 'https://n8n.klaster.digital/webhook/f2b7cc2d-eefe-4f53-ac05-5050d702e27a';
    }
  };

  // Save message to Supabase
  const saveMessageToSupabase = async (message: ChatMessage) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('messages').insert({
        id: message.id,
        role: message.role,
        content: message.content,
        user_id: user.id,
        session_id: message.session_id,
        created_at: message.timestamp.toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить сообщение",
        variant: "destructive",
      });
    }
  };

  // Send message to n8n and process response
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !sessionId || !content.trim()) return;

    setIsLoading(true);

    try {
      // Create and save user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
        session_id: sessionId
      };

      await saveMessageToSupabase(userMessage);
      setMessages(prev => [...prev, userMessage]);

      // Get webhook URL
      const webhookUrl = await getWebhookUrl();

      // Send message to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          user_id: user.id,
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json() as N8nResponse;

      // Create and save assistant message from response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.reply || "Извините, я не смог обработать ваш запрос.",
        timestamp: new Date(),
        session_id: sessionId
      };

      await saveMessageToSupabase(assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение или получить ответ",
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
      
      await saveMessageToSupabase(errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [user, sessionId, toast]);

  const resetSession = useCallback(() => {
    const newSessionId = uuidv4();
    localStorage.setItem('chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
    resetSession
  };
};
