
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { N8nResponse } from '@/types/chat';

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
    
    // Use FormData to support file uploads
    const formData = new FormData();
    formData.append('message', content);
    formData.append('user_id', userId);
    formData.append('session_id', sessionId);
    
    // Add files if provided
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      formData.append('file_count', String(files.length));
    }

    // Create fetch options with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
    
    try {
      // For FormData we don't set Content-Type, browser will set it with boundary
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Webhook error: ${response.status}`, await response.text());
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json() as N8nResponse;
      console.log('Webhook response received:', data);
      return data;
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
