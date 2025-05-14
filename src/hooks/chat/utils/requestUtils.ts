
import { N8nFileMetadata, N8nMessagePayload } from '@/types/chat';

// Send a file request using FormData
export const sendFileRequest = async (
  webhookUrl: string,
  content: string,
  userId: string,
  sessionId: string,
  timestamp: string,
  messageType: 'text' | 'voice' | 'file',
  files: File[],
  signal: AbortSignal
): Promise<Response> => {
  // Use FormData for file uploads
  const formData = new FormData();
  
  // Add message data as text/plain fields
  formData.append('message', content || (files.length > 0 ? files[0].name : "Прикрепленный файл"));
  formData.append('user_id', userId);
  formData.append('session_id', sessionId);
  formData.append('timestamp', timestamp);
  formData.append('message_type', messageType);
  formData.append('file_count', String(files.length));
  
  // Generate file metadata for n8n processing
  const filesMetadata: N8nFileMetadata[] = files.map((file, index) => ({
    name: file.name,
    type: file.type,
    size: file.size,
    index: index
  }));
  
  // Add files_metadata as JSON string
  formData.append('files_metadata', JSON.stringify(filesMetadata));
  
  // Add only the first file as 'file' key (for simplified n8n processing)
  if (files.length > 0) {
    formData.append('file', files[0]);
  }
  
  // Add all files with numbered keys as backup
  files.forEach((file, index) => {
    if (index > 0) { // Skip the first one as it's already added as 'file'
      formData.append(`file_${index}`, file);
    }
  });
  
  console.log('Sending FormData with files to webhook');
  console.log('File count:', files.length);
  console.log('Files metadata:', JSON.stringify(filesMetadata));
  console.log('Message:', content);
  console.log('Full webhook URL:', webhookUrl);
  
  try {
    // For FormData we don't set Content-Type, browser will set it with boundary
    return fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      signal: signal
    });
  } catch (error) {
    console.error('Error sending FormData request:', error);
    throw error;
  }
};

// Send a JSON request
export const sendJsonRequest = async (
  webhookUrl: string,
  content: string,
  userId: string,
  sessionId: string,
  timestamp: string,
  messageType: 'text' | 'voice' | 'file',
  signal: AbortSignal
): Promise<Response> => {
  // If no files, use JSON for better structure and debugging
  const requestBody: N8nMessagePayload = {
    message: content,
    user_id: userId,
    session_id: sessionId,
    timestamp: timestamp,
    message_type: messageType,
    file_count: 0,
    files_metadata: []
  };
  
  console.log('Sending JSON to webhook:', JSON.stringify(requestBody));
  console.log('Full webhook URL:', webhookUrl);
  
  try {
    return fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: signal
    });
  } catch (error) {
    console.error('Error sending JSON request:', error);
    throw error;
  }
};
