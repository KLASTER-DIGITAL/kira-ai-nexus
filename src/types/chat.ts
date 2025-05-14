

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  session_id: string;
  extension?: ChatMessageExtension;
  type?: 'text' | 'voice' | 'file'; // Добавлен тип сообщения
}

export interface ChatMessageExtension {
  files?: ChatAttachment[];
  metadata?: Record<string, any>;
}

export interface ChatAttachment {
  name: string;
  type: string;
  url?: string | null;
  size: number;
  local_id?: string | null; // Для отслеживания загрузок
  content?: string | null;  // Base64 содержимое, если необходимо
  metadata?: Record<string, any>; // Дополнительные метаданные файла
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  user_id: string;
  session_id: string;
  created_at: string;
  extension?: ChatMessageExtension;
  payload?: any; // Для хранения дополнительных данных
  type?: 'text' | 'voice' | 'file'; // Добавлен тип сообщения
}

export interface GlobalConfig {
  id: number;
  n8n_webhook_test: string;
  n8n_webhook_production: string | null;
  n8n_mode: 'test' | 'production';
}

export interface N8nResponse {
  reply: string;
  files?: ChatAttachment[];
  metadata?: Record<string, any>;
  status?: 'success' | 'error';
  error?: string;
  type?: 'text' | 'voice' | 'file'; // Добавлен тип сообщения
}

export interface N8nFileMetadata {
  name: string;
  type: string;
  size: number;
  index: number;
}

// Новый интерфейс для структуры payload, отправляемого в n8n
export interface N8nMessagePayload {
  message: string;
  user_id: string;
  session_id: string;
  timestamp: string;
  message_type: 'text' | 'voice' | 'file';
  files_metadata?: N8nFileMetadata[];
}
