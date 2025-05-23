
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatMessageExtension, ChatAttachment } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

// Define a type that matches Supabase's Json type constraints
type JsonCompatible = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonCompatible }
  | JsonCompatible[];

export const useChatStorage = (userId?: string) => {
  const { toast } = useToast();

  // Save message to Supabase
  const saveMessage = useCallback(async (message: ChatMessage): Promise<boolean> => {
    if (!userId) return false;

    try {
      // Convert the extension to a format Supabase can handle (JSON)
      let extensionJson: JsonCompatible | null = null;
      let payloadJson: JsonCompatible | null = null;
      
      if (message.extension) {
        // We need to serialize the extension to match Supabase's Json type
        extensionJson = {} as { [key: string]: JsonCompatible };
        
        if (message.extension.files) {
          // Convert files to plain objects that can be serialized
          extensionJson.files = message.extension.files.map(file => ({
            name: file.name,
            type: file.type,
            url: file.url || null,
            size: file.size,
            local_id: file.local_id || null
          }));
        }
        
        if (message.extension.metadata) {
          extensionJson.metadata = message.extension.metadata;
        }
        
        // Create a simple payload for additional queries
        if (message.extension.files) {
          payloadJson = { 
            file_count: message.extension.files.length 
          };
        }
      }

      console.log(`Saving message to Supabase with user_id: ${userId} and session_id: ${message.session_id}`);

      const { error } = await supabase.from('messages').insert({
        id: message.id,
        role: message.role,
        content: message.content,
        user_id: userId,
        session_id: message.session_id,
        created_at: message.timestamp.toISOString(),
        extension: extensionJson,
        payload: payloadJson
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
      console.log(`Fetching messages with user_id: ${userId} and session_id: ${sessionId}`);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      console.log(`Fetched ${data?.length || 0} messages for session ${sessionId}`);

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
            
            // Type guard to check if extension is an object with the expected properties
            if (typeof msg.extension === 'object' && msg.extension !== null) {
              // Handle files if they exist in the extension
              if ('files' in msg.extension && Array.isArray(msg.extension.files)) {
                // Explicit type casting with validation
                const fileAttachments: ChatAttachment[] = msg.extension.files.map((file: any) => ({
                  name: String(file.name || ''),
                  type: String(file.type || ''),
                  url: file.url ? String(file.url) : null,
                  size: Number(file.size || 0),
                  local_id: file.local_id ? String(file.local_id) : null
                }));
                
                extension.files = fileAttachments;
              }
              
              // Handle metadata if it exists in the extension
              if ('metadata' in msg.extension && msg.extension.metadata) {
                // Safely convert to Record<string, any>
                const metadata: Record<string, any> = {};
                
                if (typeof msg.extension.metadata === 'object' && msg.extension.metadata !== null) {
                  // Copy properties from the original metadata
                  Object.entries(msg.extension.metadata).forEach(([key, value]) => {
                    metadata[key] = value;
                  });
                }
                
                extension.metadata = metadata;
              }
            }
            
            if (Object.keys(extension).length > 0) {
              message.extension = extension;
            }
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
