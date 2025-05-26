
// Валидный публичный VAPID ключ (должен соответствовать приватному ключу в Supabase)
export const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Uy27BpO_2VgHyR-HtJXlQU8VovfDDg3aOoQnwJUgVWqYWBwEJMROJJ_vfJE';

// Проверка поддержки push-уведомлений
export function checkPushSupport() {
  const issues = [];
  
  if (!('serviceWorker' in navigator)) {
    issues.push('Service Worker не поддерживается');
  }
  
  if (!('PushManager' in window)) {
    issues.push('Push API не поддерживается');
  }
  
  if (!('Notification' in window)) {
    issues.push('Notification API не поддерживается');
  }
  
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    issues.push('Требуется HTTPS соединение');
  }
  
  return {
    isSupported: issues.length === 0,
    issues
  };
}

// Утилиты для конвертации ключей
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
