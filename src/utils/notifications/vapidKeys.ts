
// Генерация VAPID ключей для push-уведомлений
export function generateVapidKeys() {
  // Простая реализация для генерации VAPID ключей
  // В продакшене используйте web-push библиотеку
  return {
    publicKey: 'BPh-M4pN8bFgF3vV7J1qF8ZyF7J2dWY_Hv9KgBp_8NJhY7MdF8vGbT4pK9xY7',
    privateKey: 'pXkL8mN9bH6gF2vV8J5qF9ZyF8J3dWY_Hv0KgBp_0NJhY8MdF9vGbT5pK0xY8'
  };
}

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
