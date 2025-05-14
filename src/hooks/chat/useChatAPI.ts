
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

  // Send message to the n8n webhook
  const sendToWebhook = useCallback(async (
    content: string, 
    userId: string, 
    sessionId: string
  ): Promise<N8nResponse> => {
    const webhookUrl = await getWebhookUrl();
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content,
        user_id: userId,
        session_id: sessionId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json() as N8nResponse;
    return data;
  }, []);

  return { sendToWebhook };
};
