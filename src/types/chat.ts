
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  user_id: string;
  session_id: string;
  created_at: string;
}

export interface GlobalConfig {
  id: number;
  n8n_webhook_test: string;
  n8n_webhook_production: string | null;
  n8n_mode: 'test' | 'production';
}
