
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, ChatAttachment } from '@/types/chat';
import { useChatAPI } from './useChatAPI';

export const useMessageHandlers = (
  userId?: string, 
  sessionId?: string,
  saveMessage?: (message: ChatMessage) => Promise<boolean>,
  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  clearAttachments?: () => void
) => {
  const { toast } = useToast();
  const { sendToWebhook } = useChatAPI();

  // Send message to n8n and process response
  const sendMessage = useCallback(async (content: string, attachments: File[] = []) => {
    if (!userId || !sessionId || (!content.trim() && attachments.length === 0) || !saveMessage || !setMessages || !setIsLoading) {
      console.error("Missing required parameters for sendMessage");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting message send process with attachments:', attachments.length);
      
      // Determine message type based on content and attachments
      let messageType: 'text' | 'voice' | 'file' = 'text';
      if (attachments.length > 0) {
        messageType = 'file';
      } else if (content.startsWith('data:audio') || content.includes('speech') || content.includes('voice')) {
        messageType = 'voice';
      }
      
      // Create file attachments metadata if files are present
      const fileAttachments: ChatAttachment[] = attachments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        local_id: URL.createObjectURL(file),
        metadata: {
          lastModified: file.lastModified,
          index: attachments.indexOf(file) // Add index to match n8n format
        }
      }));

      // Create and save user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: content.trim() || (attachments.length > 0 ? attachments[0].name : "Прикрепленный файл"),
        timestamp: new Date(),
        session_id: sessionId,
        type: messageType,
        ...(attachments.length > 0 && {
          extension: {
            files: fileAttachments
          }
        })
      };

      console.log('Saving user message:', userMessage);
      await saveMessage(userMessage);
      setMessages(prev => [...prev, userMessage]);

      // Send message to n8n webhook with files
      console.log('Sending message to webhook with attachments:', attachments.length, 
        'Files:', attachments.map(f => f.name));
      const data = await sendToWebhook(content, userId, sessionId, attachments);
      console.log('Webhook response received:', data);

      // Create and save assistant message from response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.reply || "",
        timestamp: new Date(),
        session_id: sessionId,
        type: data.type || 'text',
        ...(data.files && data.files.length > 0 && {
          extension: {
            files: data.files,
            metadata: data.metadata || {}
          }
        })
      };

      // If there was an error, show a toast notification
      if (data.status === 'error') {
        console.error("Error from webhook:", data.error);
        toast({
          title: "Ошибка в n8n",
          description: data.error || "Ошибка при обработке запроса в n8n",
          variant: "destructive",
        });
        
        // If it's specifically a missing Respond node error, show admin-focused message
        if (data.error?.includes('Respond to Webhook')) {
          assistantMessage.content += "\n\n*Для администраторов: Необходимо добавить узел 'Respond to Webhook' " +
                                      "в рабочий процесс n8n для корректной обработки запросов.*";
        }
      }

      console.log('Processing assistant message:', assistantMessage);
      
      // Log detailed information about files in the response
      if (data.files && data.files.length > 0) {
        console.log('Response contains files:', data.files.length);
        data.files.forEach((file, index) => {
          console.log(`File ${index + 1}:`, {
            name: file.name,
            type: file.type,
            url: file.url,
            size: file.size,
            hasContent: !!file.content,
            hasMetadata: !!file.metadata
          });
        });
      }

      await saveMessage(assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
      
      // Clear attachments after successful send
      if (clearAttachments) {
        clearAttachments();
      }
      
      return assistantMessage; // Return the assistant message for potential further processing
    } catch (error: any) {
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
        session_id: sessionId,
        type: 'text'
      };
      
      await saveMessage(errorMessage);
      setMessages(prev => [...prev, errorMessage]);
      return errorMessage; // Return the error message for potential further processing
    } finally {
      setIsLoading(false);
    }
  }, [userId, sessionId, saveMessage, setMessages, setIsLoading, sendToWebhook, toast, clearAttachments]);

  return { sendMessage };
};
