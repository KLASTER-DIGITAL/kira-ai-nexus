
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

interface SendNotificationParams {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
}

export const useSendNotification = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: SendNotificationParams) => {
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          userId: user.id,
          ...params,
        },
      });

      if (error) {
        console.error('Ошибка отправки уведомления:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Тестовое уведомление отправлено');
    },
    onError: (error) => {
      console.error('Ошибка отправки уведомления:', error);
      toast.error(`Ошибка отправки: ${error.message}`);
    },
  });
};
