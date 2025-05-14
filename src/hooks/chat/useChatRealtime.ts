
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';

export const useChatRealtime = (
  sessionId?: string, 
  onNewMessage?: (message: ChatMessage) => void
) => {
  useEffect(() => {
    if (!sessionId || !onNewMessage) return;

    console.log(`Setting up realtime subscription for session: ${sessionId}`);

    // Set up subscription
    const channel = supabase
      .channel(`public:messages:session_id=eq.${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Realtime message received:', payload);
          const newMsg = payload.new as any;
          
          // Convert database row to ChatMessage
          const chatMessage: ChatMessage = {
            id: newMsg.id,
            role: newMsg.role as 'user' | 'assistant',
            content: newMsg.content,
            timestamp: new Date(newMsg.created_at),
            session_id: newMsg.session_id,
            ...(newMsg.extension && { extension: newMsg.extension })
          };
          
          onNewMessage(chatMessage);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase realtime status: ${status}`);
      });

    // Cleanup subscription
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [sessionId, onNewMessage]);
};
