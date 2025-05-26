
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushNotificationRequest {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
}

// Функция для создания JWT токена для VAPID
function createVapidJWT(audience: string, subject: string, privateKey: string) {
  const header = {
    typ: "JWT",
    alg: "ES256"
  };

  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 часов
    sub: subject
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  // В реальной реализации здесь должно быть подписание с помощью приватного ключа
  // Для упрощения используем базовую реализацию
  const signature = btoa(`${encodedHeader}.${encodedPayload}`).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, title, body, icon, url, tag }: PushNotificationRequest = await req.json();

    console.log('Отправка push-уведомления для пользователя:', userId);

    // Получаем push-подписки пользователя
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (subscriptionsError) {
      console.error('Ошибка получения подписок:', subscriptionsError);
      throw subscriptionsError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('Подписки не найдены для пользователя:', userId);
      return new Response(
        JSON.stringify({ message: 'No push subscriptions found for user' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Найдено ${subscriptions.length} подписок для отправки`);

    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    if (!vapidPrivateKey) {
      throw new Error('VAPID private key not configured');
    }

    // Отправляем уведомления на все подписки пользователя
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        const payload = JSON.stringify({
          title,
          body,
          icon: icon || '/favicon.ico',
          tag: tag || 'default',
          data: {
            url: url || '/',
            timestamp: new Date().toISOString(),
          }
        });

        console.log('Отправка на endpoint:', subscription.endpoint);

        // Создаем VAPID заголовки
        const urlParts = new URL(subscription.endpoint);
        const audience = `${urlParts.protocol}//${urlParts.host}`;
        const vapidJWT = createVapidJWT(audience, 'mailto:admin@example.com', vapidPrivateKey);

        const response = await fetch(subscription.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': payload.length.toString(),
            'TTL': '86400',
            'Authorization': `vapid t=${vapidJWT}, k=${Deno.env.get('VAPID_PUBLIC_KEY') || ''}`,
          },
          body: payload,
        });

        console.log(`Ответ для ${subscription.endpoint}:`, response.status, response.statusText);

        return { 
          success: response.ok, 
          endpoint: subscription.endpoint,
          status: response.status,
          statusText: response.statusText
        };
      } catch (error) {
        console.error('Ошибка отправки push-уведомления:', error);
        return { 
          success: false, 
          endpoint: subscription.endpoint, 
          error: error.message 
        };
      }
    });

    const results = await Promise.all(sendPromises);
    
    console.log('Результаты отправки:', results);
    
    return new Response(
      JSON.stringify({ 
        message: 'Push notifications sent',
        results 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error('Ошибка в функции send-push-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
