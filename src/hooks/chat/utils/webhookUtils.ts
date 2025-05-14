
import { supabase } from '@/integrations/supabase/client';

// Get webhook URL from config with improved error handling
export const getWebhookUrl = async (): Promise<string> => {
  try {
    // Получаем конфигурацию из таблицы global_config
    const { data, error } = await supabase
      .from('global_config')
      .select('n8n_webhook_test, n8n_webhook_production, n8n_mode')
      .single();

    if (error) {
      console.error("Error fetching webhook config:", error);
      throw error;
    }

    console.log('Retrieved webhook config:', data);
    
    // Используем production webhook если режим production
    if (data.n8n_mode === 'production' && data.n8n_webhook_production) {
      console.log('Using production webhook URL:', data.n8n_webhook_production);
      return data.n8n_webhook_production;
    }
    
    // В противном случае используем тестовый webhook
    console.log('Using test webhook URL:', data.n8n_webhook_test);
    return data.n8n_webhook_test || 'https://n8n.klaster.digital/webhook-test/f2b7cc2d-eefe-4f53-ac05-5050d702e27a';
  } catch (error) {
    console.error("Error fetching webhook URL:", error);
    // Fallback to default webhook if there's an error
    return 'https://n8n.klaster.digital/webhook-test/f2b7cc2d-eefe-4f53-ac05-5050d702e27a';
  }
};
