
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatMessageExtension } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

export const useChatStorage = (userId?: string) => {
  const { toast } = useToast();

  // Save message to Supabase
  const saveMessage = useCallback(async (message: ChatMessage): Promise<boolean> => {
    if (!userId) return false;

    try {
      // Convert the extension to a format Supabase can handle (JSON)
      const extensionJson = message.extension ? {
        files: message.extension.files,
        metadata: message.extension.metadata
      } : null;

      const { error } = await supabase.from('messages').insert({
        id: message.id,
        role: message.role,
        content: message.content,
        user_id: userId,
        session_id: message.session_id,
        created_at: message.timestamp.toISOString(),
        extension: extensionJson,
        payload: message.extension?.files ? { 
          file_count: message.extension.files.length 
        } : null
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить сообщение",
        variant: "destructive",
      });
      return false;
    }
  }, [userId, toast]);

  // Fetch messages for a session
  const fetchMessages = useCallback(async (sessionId: string): Promise<ChatMessage[]> => {
    if (!userId || !sessionId) return [];

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(msg => {
          // Convert database record to ChatMessage
          const message: ChatMessage = {
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at),
            session_id: msg.session_id
          };

          // Add extension if it exists
          if (msg.extension) {
            const extension: ChatMessageExtension = {};
            
            if (msg.extension.files) {
              extension.files = msg.extension.files;
            }
            
            if (msg.extension.metadata) {
              extension.metadata = msg.extension.metadata;
            }
            
            message.extension = extension;
          }
          
          return message;
        });
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить историю сообщений",
        variant: "destructive",
      });
      return [];
    }
  }, [userId, toast]);

  return { saveMessage, fetchMessages };
};
