
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { PushSubscription } from '@/types/notifications';
import { toast } from 'sonner';
import { 
  checkPushSupport, 
  VAPID_PUBLIC_KEY, 
  urlBase64ToUint8Array, 
  arrayBufferToBase64 
} from '@/utils/notifications/vapidKeys';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Проверяем поддержку push-уведомлений
  const supportCheck = checkPushSupport();
  const isPushSupported = supportCheck.isSupported;

  // Получение push-подписок
  const {
    data: subscriptions,
    isLoading,
  } = useQuery({
    queryKey: ['push-subscriptions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Ошибка получения push-подписок:', error);
        throw error;
      }

      return data as PushSubscription[];
    },
    enabled: !!user && isPushSupported,
  });

  // Создание push-подписки
  const subscribeToPush = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Пользователь не авторизован');
      
      if (!isPushSupported) {
        const errorMessage = `Push-уведомления не поддерживаются: ${supportCheck.issues.join(', ')}`;
        throw new Error(errorMessage);
      }

      console.log('Запрашиваем разрешение на уведомления...');
      
      // Запрашиваем разрешение на уведомления
      const permission = await Notification.requestPermission();
      console.log('Разрешение на уведомления:', permission);
      
      if (permission !== 'granted') {
        throw new Error(`Разрешение на уведомления: ${permission}. Проверьте настройки браузера.`);
      }

      console.log('Регистрируем service worker...');
      
      // Регистрируем service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker зарегистрирован:', registration);
      
      // Ждем, пока service worker станет активным
      await navigator.serviceWorker.ready;
      console.log('Service worker готов');
      
      console.log('Создаем push-подписку с VAPID ключом:', VAPID_PUBLIC_KEY);
      
      try {
        // Создаем подписку с правильным VAPID ключом
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        console.log('Push-подписка успешно создана:', subscription);

        // Сохраняем подписку в базе данных
        const subscriptionData = {
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh_key: arrayBufferToBase64(subscription.getKey('p256dh')),
          auth_key: arrayBufferToBase64(subscription.getKey('auth')),
          user_agent: navigator.userAgent,
        };

        console.log('Сохраняем подписку в БД:', subscriptionData);

        const { data, error } = await supabase
          .from('push_subscriptions')
          .insert(subscriptionData)
          .select()
          .single();

        if (error) {
          console.error('Ошибка сохранения подписки:', error);
          throw error;
        }

        console.log('Подписка успешно сохранена:', data);
        return data;
      } catch (subscriptionError) {
        console.error('Ошибка создания push-подписки:', subscriptionError);
        if (subscriptionError.name === 'InvalidStateError') {
          throw new Error('VAPID ключ недействителен. Проверьте конфигурацию сервера.');
        }
        throw new Error(`Не удалось создать подписку: ${subscriptionError.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['push-subscriptions'] });
      toast.success('Push-уведомления успешно включены');
    },
    onError: (error) => {
      console.error('Ошибка подписки на push-уведомления:', error);
      toast.error(`Ошибка: ${error.message}`);
    },
  });

  // Отмена push-подписки
  const unsubscribeFromPush = useMutation({
    mutationFn: async (subscriptionId: string) => {
      if (!user) throw new Error('Пользователь не авторизован');

      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('id', subscriptionId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['push-subscriptions'] });
      toast.success('Push-уведомления отключены');
    },
    onError: (error) => {
      console.error('Ошибка отписки от push-уведомлений:', error);
      toast.error('Не удалось отключить push-уведомления');
    },
  });

  return {
    subscriptions,
    isLoading,
    isPushSupported,
    supportIssues: supportCheck.issues,
    subscribeToPush: subscribeToPush.mutate,
    unsubscribeFromPush: unsubscribeFromPush.mutate,
    isSubscribing: subscribeToPush.isPending,
    isUnsubscribing: unsubscribeFromPush.isPending,
  };
};
