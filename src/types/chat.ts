
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  session_id: string;
  extension?: ChatMessageExtension;
  type?: 'text' | 'voice' | 'file'; // Message type
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
  local_id?: string | null; // For tracking uploads
  content?: string | null;  // Base64 content if needed
  metadata?: Record<string, any>; // Additional file metadata
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  user_id: string;
  session_id: string;
  created_at: string;
  extension?: ChatMessageExtension;
  payload?: any; // For storing additional data
  type?: 'text' | 'voice' | 'file'; // Message type
}

export interface GlobalConfig {
  id: number;
  n8n_webhook_test: string;
  n8n_webhook_production: string | null;
  n8n_mode: 'test' | 'production';
}

export interface N8nResponse {
  reply?: string;
  files?: ChatAttachment[];
  metadata?: Record<string, any>;
  status?: 'success' | 'error' | 'received';
  error?: string;
  type?: 'text' | 'voice' | 'file'; // Message type
  filename?: string;
  message?: string;
}

export interface N8nFileMetadata {
  name: string;
  type: string;
  size: number;
  index: number;
}

// Updated interface for n8n webhook payload structure
export interface N8nMessagePayload {
  message: string;
  user_id: string;
  session_id: string;
  timestamp: string;
  message_type: 'text' | 'voice' | 'file';
  file_count?: number;
  files_metadata?: N8nFileMetadata[];
}
