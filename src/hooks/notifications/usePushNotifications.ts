
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { PushSubscription } from '@/types/notifications';
import { toast } from 'sonner';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Проверяем поддержку push-уведомлений
  const isPushSupported = 'serviceWorker' in navigator && 'PushManager' in window;

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
      if (!isPushSupported) throw new Error('Push-уведомления не поддерживаются');

      // Запрашиваем разрешение на уведомления
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Разрешение на уведомления не предоставлено');
      }

      // Регистрируем service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Создаем подписку
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VAPID_PUBLIC_KEY || 'BMqEQs5y9p4ZJAJ1-cSbOXhwMFQ7E8WgzP6cOJZnB_4GGKH7-O5I8XjHKfNT8vKqL5QK7W1IOMJL9PBKJ1V_s', // VAPID ключ
      });

      // Сохраняем подписку в базе данных
      const { data, error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh') || new ArrayBuffer(0)))),
          auth_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth') || new ArrayBuffer(0)))),
          user_agent: navigator.userAgent,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['push-subscriptions'] });
      toast.success('Push-уведомления включены');
    },
    onError: (error) => {
      console.error('Ошибка подписки на push-уведомления:', error);
      toast.error('Не удалось включить push-уведомления');
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
    subscribeToPush: subscribeToPush.mutate,
    unsubscribeFromPush: unsubscribeFromPush.mutate,
    isSubscribing: subscribeToPush.isPending,
    isUnsubscribing: unsubscribeFromPush.isPending,
  };
};
