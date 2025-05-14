
import { N8nResponse, ChatAttachment } from '@/types/chat';

// Process webhook response with improved error handling
export const processWebhookResponse = async (response: Response): Promise<N8nResponse> => {
  // Log response status and headers for debugging
  console.log('Webhook response status:', response.status);
  console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Webhook error: ${response.status}`, errorText);
    
    // Handle specific n8n errors
    if (errorText.includes('Workflow could not be started')) {
      console.error("n8n workflow error: Workflow could not be started. Please check your n8n workflow configuration.");
      
      return {
        reply: "Не удалось запустить рабочий процесс n8n. Пожалуйста, проверьте настройки webhook в n8n и убедитесь, что рабочий процесс активирован.",
        status: "error",
        error: "Workflow could not be started. Check n8n configuration."
      };
    }
    
    // Handle "No Respond to Webhook node" error specifically
    if (errorText.includes('No Respond to Webhook') || 
        errorText.includes('node found in the workflow')) {
      console.warn("The n8n workflow is missing a 'Respond to Webhook' node");
      
      // Return a user-friendly fallback response
      return {
        reply: "Мне не удалось обработать ваш запрос из-за проблем с конфигурацией n8n. " +
               "Пожалуйста, добавьте узел 'Respond to Webhook' в рабочий процесс n8n.",
        status: "error",
        error: "Missing 'Respond to Webhook' node in n8n workflow"
      };
    }
    
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }

  // Try to get response as JSON
  const responseText = await response.text();
  console.log('Raw webhook response:', responseText);
  
  let data;
  try {
    // Parse the JSON response
    data = JSON.parse(responseText);
    console.log('Webhook response parsed:', data);
    
    // Handle array responses with output property (common in n8n)
    if (Array.isArray(data) && data.length > 0 && data[0].output) {
      console.log('Detected n8n array response format with output property:', data[0].output);
      data = {
        reply: data[0].output,
        status: "success",
        type: "text"
      };
      console.log('Converted array response to standard format:', data);
    }
  } catch (e) {
    console.error('Failed to parse webhook response as JSON:', e);
    // If parsing fails, create a minimal valid response with the text
    data = {
      reply: responseText || "Получен ответ, но в неправильном формате.",
      status: "success",
      type: "text"  // Default to text if not specified
    };
  }
  
  // Make sure the response structure is valid
  const validatedResponse: N8nResponse = {
    reply: data.reply,
    status: data.status || "success",
    type: data.type || "text"  // Default to text if not specified
  };

  // Handle simple responses from n8n (like your specified format)
  if (data.status === "received" && data.filename) {
    validatedResponse.status = "received";
    validatedResponse.filename = data.filename;
    validatedResponse.message = data.message || "ok";
    validatedResponse.reply = `Файл ${data.filename} успешно получен.`;
  }
  
  if (data.files && Array.isArray(data.files)) {
    // Validate and convert each file attachment
    validatedResponse.files = data.files.map((file: any): ChatAttachment => ({
      name: file.name || 'file',
      type: file.type || 'application/octet-stream',
      url: file.url || null,
      size: file.size || 0,
      local_id: file.local_id || null,
      metadata: file.metadata || null,
      content: file.content || null
    }));
    
    // If there are files, update the response type to 'file' if not already set
    if (validatedResponse.files.length > 0 && !data.type) {
      validatedResponse.type = 'file';
    }
    
    // Log detailed information about files
    console.log('Processed files from response:', 
      validatedResponse.files.map(f => ({ name: f.name, type: f.type, hasUrl: !!f.url, hasContent: !!f.content }))
    );
  }
  
  if (data.metadata) {
    validatedResponse.metadata = data.metadata;
  }
  
  if (data.error) {
    validatedResponse.error = data.error;
    validatedResponse.status = "error";
  }
  
  return validatedResponse;
};
