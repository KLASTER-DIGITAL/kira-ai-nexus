
import { supabase } from '@/integrations/supabase/client';

// Get webhook URL from config
export const getWebhookUrl = async (): Promise<string> => {
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
    
    // Use test webhook as default or fallback
    return data.n8n_webhook_test || 'https://n8n.klaster.digital/webhook-test/f2b7cc2d-eefe-4f53-ac05-5050d702e27a';
  } catch (error) {
    console.error("Error fetching webhook URL:", error);
    // Fallback to default webhook
    return 'https://n8n.klaster.digital/webhook-test/f2b7cc2d-eefe-4f53-ac05-5050d702e27a';
  }
};
