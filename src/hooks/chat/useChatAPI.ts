
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { N8nResponse, ChatAttachment } from '@/types/chat';

export const useChatAPI = () => {
  // Get webhook URL from config
  const getWebhookUrl = async (): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('global_config')
        .select('n8n_webhook_test, n8n_webhook_production, n8n_mode')
        .single();

      if (error) throw error;

      console.log('Retrieved webhook config:', data);
      
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

  // Send message to the n8n webhook with improved error handling and timeout
  const sendToWebhook = useCallback(async (
    content: string, 
    userId: string, 
    sessionId: string,
    files?: File[]
  ): Promise<N8nResponse> => {
    const webhookUrl = await getWebhookUrl();
    console.log(`Sending to webhook: ${webhookUrl}`, { content, userId, sessionId, hasFiles: !!files?.length });
    
    // Create controller for request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
    
    try {
      let response;
      
      // Check if we have files to upload
      if (files && files.length > 0) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('message', content);
        formData.append('user_id', userId);
        formData.append('session_id', sessionId);
        
        // Add files
        files.forEach((file, index) => {
          formData.append(`file${index}`, file);
        });
        formData.append('file_count', String(files.length));
        
        console.log('Sending FormData with files to webhook');
        
        // For FormData we don't set Content-Type, browser will set it with boundary
        response = await fetch(webhookUrl, {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });
      } else {
        // If no files, use JSON for better structure and debugging
        const requestBody = {
          message: content,
          user_id: userId,
          session_id: sessionId
        };
        
        console.log('Sending JSON to webhook:', JSON.stringify(requestBody));
        
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Webhook error: ${response.status}`, errorText);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Webhook response received:', data);
      
      // Make sure the response structure is valid
      const validatedResponse: N8nResponse = {
        reply: data.reply || "",
        status: data.status || "success"
      };
      
      if (data.files && Array.isArray(data.files)) {
        // Validate and convert each file attachment
        validatedResponse.files = data.files.map((file: any): ChatAttachment => ({
          name: file.name || 'file',
          type: file.type || 'application/octet-stream',
          url: file.url || null,
          size: file.size || 0,
          local_id: file.local_id || null
        }));
      }
      
      if (data.metadata) {
        validatedResponse.metadata = data.metadata;
      }
      
      if (data.error) {
        validatedResponse.error = data.error;
        validatedResponse.status = "error";
      }
      
      return validatedResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Webhook request failed:", error);
      
      if (error.name === 'AbortError') {
        throw new Error('Webhook request timed out after 30 seconds');
      }
      
      throw error;
    }
  }, []);

  return { sendToWebhook };
};
