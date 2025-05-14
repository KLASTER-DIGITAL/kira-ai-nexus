
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { N8nResponse } from '@/types/chat';
import { getWebhookUrl } from './utils/webhookUtils';
import { sendFileRequest, sendJsonRequest } from './utils/requestUtils';
import { processWebhookResponse } from './utils/responseUtils';

export const useWebhookAPI = () => {
  // Send message to the n8n webhook with improved error handling and timeout
  const sendToWebhook = useCallback(async (
    content: string, 
    userId: string, 
    sessionId: string,
    files?: File[]
  ): Promise<N8nResponse> => {
    // Получаем URL вебхука из настроек
    const webhookUrl = await getWebhookUrl();
    const timestamp = new Date().toISOString();
    
    console.log(`Sending to webhook: ${webhookUrl}`, { 
      content, 
      userId, 
      sessionId, 
      hasFiles: !!files?.length,
      fileNames: files?.map(f => f.name),
      timestamp
    });
    
    // Create controller for request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
    
    try {
      let response;
      
      // Determine message type based on content and files
      let messageType: 'text' | 'voice' | 'file' = 'text';
      if (files && files.length > 0) {
        messageType = 'file';
      } else if (content.startsWith('data:audio') || content.includes('speech') || content.includes('voice')) {
        messageType = 'voice';
      }
      
      // Check if we have files to upload
      if (files && files.length > 0) {
        response = await sendFileRequest(
          webhookUrl, 
          content, 
          userId, 
          sessionId, 
          timestamp, 
          messageType, 
          files, 
          controller.signal
        );
      } else {
        response = await sendJsonRequest(
          webhookUrl, 
          content, 
          userId, 
          sessionId, 
          timestamp, 
          messageType, 
          controller.signal
        );
      }

      clearTimeout(timeoutId);
      
      // Process and return the webhook response
      return processWebhookResponse(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Webhook request failed:", error);
      
      if (error.name === 'AbortError') {
        return {
          reply: "Запрос к n8n превысил время ожидания (30 секунд). Пожалуйста, попробуйте позже или проверьте работоспособность сервера n8n.",
          status: "error",
          error: "Webhook request timed out after 30 seconds",
          type: "text"
        };
      }
      
      return {
        reply: "Произошла ошибка при обработке вашего запроса. " + (error.message || "Пожалуйста, попробуйте позже."),
        status: "error",
        error: error.message || "Unknown error",
        type: "text"
      };
    }
  }, []);

  return { sendToWebhook };
};
