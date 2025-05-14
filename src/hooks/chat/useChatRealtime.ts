
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';

export const useChatRealtime = (sessionId: string, onNewMessage: (message: ChatMessage) => void) => {
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
          
          const formattedMessage: ChatMessage = {
            id: newMessage.id,
            role: newMessage.role,
            content: newMessage.content,
            timestamp: new Date(newMessage.created_at),
            session_id: newMessage.session_id
          };
          
          onNewMessage(formattedMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, onNewMessage]);
};
