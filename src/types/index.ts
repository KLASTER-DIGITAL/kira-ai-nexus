
export * from './notes';
export * from './tasks';
export * from './calendar';
export * from './auth';
export * from './chat';

export interface WebhookSettings {
  id: number;
  n8n_webhook_test: string;
  n8n_webhook_production: string | null;
  n8n_mode: 'test' | 'production';
}
