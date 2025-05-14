
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
    console.log(`Sending to webhook: ${webhookUrl}`, { 
      content, 
      userId, 
      sessionId, 
      hasFiles: !!files?.length,
      fileNames: files?.map(f => f.name)
    });
    
    // Create controller for request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
    
    try {
      let response;
      
      // Check if we have files to upload
      if (files && files.length > 0) {
        // Use FormData for file uploads with array format for n8n compatibility
        const formData = new FormData();
        formData.append('message', content);
        formData.append('user_id', userId);
        formData.append('session_id', sessionId);
        
        // Add files as array using the 'files[]' format that n8n expects
        files.forEach((file) => {
          formData.append('files[]', file);
        });
        
        console.log('Sending FormData with files to webhook using files[] format');
        console.log('File count:', files.length);
        console.log('File names:', files.map(f => f.name).join(', '));
        
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
      
      // Log response status for debugging
      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Webhook error: ${response.status}`, errorText);
        
        // Handle "No Respond to Webhook node" error specifically
        if (errorText.includes('No Respond to Webhook') || 
            errorText.includes('node found in the workflow')) {
          console.warn("The n8n workflow is missing a 'Respond to Webhook' node");
          
          // Return a user-friendly fallback response
          return {
            reply: "Мне не удалось обработать ваш запрос из-за проблем с конфигурацией n8n. " +
                   "Пожалуйста, добавьте узел 'Respond to Webhook' в рабочий процесс n8n.",
            status: "error",
            error: "Missing 'Respond to Webhook' node in n8n workflow"
          };
        }
        
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      // Try to get response as JSON
      const responseText = await response.text();
      console.log('Raw webhook response:', responseText);
      
      let data;
      try {
        // Parse the JSON response
        data = JSON.parse(responseText);
        console.log('Webhook response parsed:', data);
      } catch (e) {
        console.error('Failed to parse webhook response as JSON:', e);
        // If parsing fails, create a minimal valid response with the text
        data = {
          reply: responseText || "Получен ответ, но в неправильном формате.",
          status: "success"
        };
      }
      
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
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Webhook request failed:", error);
      
      if (error.name === 'AbortError') {
        return {
          reply: "Запрос к n8n превысил время ожидания (30 секунд). Пожалуйста, попробуйте позже или проверьте работоспособность сервера n8n.",
          status: "error",
          error: "Webhook request timed out after 30 seconds"
        };
      }
      
      return {
        reply: "Произошла ошибка при обработке вашего запроса. " + (error.message || "Пожалуйста, попробуйте позже."),
        status: "error",
        error: error.message || "Unknown error"
      };
    }
  }, []);

  return { sendToWebhook };
};
