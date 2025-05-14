
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatMessageExtension } from '@/types/chat';

export const useChatRealtime = (
  sessionId?: string,
  userId?: string,
  onNewMessage?: (message: ChatMessage) => void
) => {
  useEffect(() => {
    if (!sessionId || !userId || !onNewMessage) return;

    console.log(`Setting up realtime subscription for user: ${userId} and session: ${sessionId}`);

    // Создаем фильтр, включающий и user_id, и session_id
    const filter = `session_id=eq.${sessionId},user_id=eq.${userId}`;

    // Set up subscription
    const channel = supabase
      .channel(`public:messages:${filter}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: filter
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
            session_id: newMsg.session_id
          };

          // Process extension data if it exists
          if (newMsg.extension) {
            const extension: ChatMessageExtension = {};
            
            if (typeof newMsg.extension === 'object' && newMsg.extension !== null) {
              if ('files' in newMsg.extension && Array.isArray(newMsg.extension.files)) {
                extension.files = newMsg.extension.files;
              }
              
              if ('metadata' in newMsg.extension) {
                extension.metadata = newMsg.extension.metadata;
              }
            }
            
            if (Object.keys(extension).length > 0) {
              chatMessage.extension = extension;
            }
          }
          
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
  }, [sessionId, userId, onNewMessage]);
};
