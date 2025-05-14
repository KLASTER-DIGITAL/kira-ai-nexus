
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface WebhookSettings {
  id: number;
  n8n_webhook_test: string;
  n8n_webhook_production: string | null;
  n8n_mode: 'test' | 'production';
}

export const useWebhookSettings = () => {
  const [settings, setSettings] = useState<WebhookSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('global_config')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data as WebhookSettings);
    } catch (error) {
      console.error("Error fetching webhook settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = useCallback(async (updatedSettings: Partial<WebhookSettings>) => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('global_config')
        .update({
          n8n_webhook_test: updatedSettings.n8n_webhook_test || settings.n8n_webhook_test,
          n8n_webhook_production: updatedSettings.n8n_webhook_production || settings.n8n_webhook_production,
          n8n_mode: updatedSettings.n8n_mode || settings.n8n_mode
        })
        .eq('id', settings.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updatedSettings } : null);
      toast({
        title: "Успех",
        description: "Настройки webhook успешно сохранены",
      });
    } catch (error) {
      console.error("Error saving webhook settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки webhook",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings, toast]);

  return {
    settings,
    isLoading,
    isSaving,
    fetchSettings,
    saveSettings
  };
};
