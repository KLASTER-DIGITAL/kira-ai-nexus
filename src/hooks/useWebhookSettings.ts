
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface WebhookSettings {
  id: number;
  n8n_webhook_test: string;
  n8n_webhook_production: string | null;
  n8n_mode: 'test' | 'production';
}

export const useWebhookSettings = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query with optimized caching
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['webhook-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('global_config')
          .select('*')
          .single();

        if (error) throw error;
        return data as WebhookSettings;
      } catch (error) {
        console.error("Error fetching webhook settings:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить настройки webhook",
          variant: "destructive",
        });
        throw error;
      }
    },
    // Optimize caching for better performance
    staleTime: 1000 * 60 * 15, // 15 minutes
    cacheTime: 1000 * 60 * 60, // 60 minutes
  });

  // Use mutation for saving data
  const mutation = useMutation({
    mutationFn: async (updatedSettings: Partial<WebhookSettings>) => {
      if (!settings) return null;
      
      const { error } = await supabase
        .from('global_config')
        .update({
          n8n_webhook_test: updatedSettings.n8n_webhook_test || settings.n8n_webhook_test,
          n8n_webhook_production: updatedSettings.n8n_webhook_production || settings.n8n_webhook_production,
          n8n_mode: updatedSettings.n8n_mode || settings.n8n_mode
        })
        .eq('id', settings.id);

      if (error) throw error;
      
      return { ...settings, ...updatedSettings };
    },
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: (data) => {
      // Update cache immediately without refetch
      queryClient.setQueryData(['webhook-settings'], data);
      toast({
        title: "Успех",
        description: "Настройки webhook успешно сохранены",
      });
    },
    onError: (error) => {
      console.error("Error saving webhook settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки webhook",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });

  const saveSettings = useCallback(async (updatedSettings: Partial<WebhookSettings>) => {
    mutation.mutate(updatedSettings);
  }, [mutation]);

  const fetchSettings = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['webhook-settings'] });
  }, [queryClient]);

  return {
    settings,
    isLoading,
    isSaving,
    fetchSettings,
    saveSettings
  };
};
