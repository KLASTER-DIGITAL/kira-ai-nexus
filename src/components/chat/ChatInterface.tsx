
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { ChatMessage } from "@/types/chat";
import { 
  useChatSession,
  useChatStorage,
  useChatAttachments,
  useMessageHandlers,
  useInitialMessage,
  useChatRealtime
} from "@/hooks/chat";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const ChatInterface: React.FC = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { sessionId, resetSession } = useChatSession();
  const { saveMessage, fetchMessages } = useChatStorage(user?.id);
  const { 
    attachments, 
    addAttachment, 
    removeAttachment, 
    clearAttachments 
  } = useChatAttachments();
  const { createInitialMessage } = useInitialMessage();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle new messages received via real-time subscription
  const handleNewMessage = useCallback((message: ChatMessage) => {
    console.log('Received real-time message:', message);
    setMessages(prev => {
      // Check if the message is already in the list
      const exists = prev.some(m => m.id === message.id);
      if (exists) return prev;
      return [...prev, message];
    });
  }, []);

  // Set up real-time subscription
  useChatRealtime(sessionId, user?.id, handleNewMessage);

  // Initialize message handlers with current context
  const { sendMessage } = useMessageHandlers(
    user?.id,
    sessionId,
    saveMessage,
    setMessages,
    setIsLoading,
    clearAttachments
  );

  // Load messages when session or user changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId || !user?.id) return;
      
      setIsLoading(true);
      try {
        console.log('Loading messages for user:', user.id, 'and session:', sessionId);
        // Fetch existing messages from storage
        const chatHistory = await fetchMessages(sessionId);
        console.log('Fetched chat history:', chatHistory.length, 'messages');
        
        if (chatHistory.length === 0) {
          console.log('No existing messages, creating welcome message');
          // If no messages, create welcome message
          const initialMessage = createInitialMessage(sessionId);
          await saveMessage(initialMessage);
          setMessages([initialMessage]);
        } else {
          setMessages(chatHistory);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить историю сообщений",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [sessionId, user?.id, fetchMessages, saveMessage, createInitialMessage, toast]);

  // Handle sending message with auth check
  const handleSendMessage = async (content: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для отправки сообщений необходимо войти в систему.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Handling message send:', content.length > 0 ? 'With text' : 'No text', 
      'Attachments:', attachments.length);
      
    if (attachments.length > 0) {
      console.log('File details:');
      attachments.forEach((file, index) => {
        console.log(`File ${index + 1}: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);
      });
    }
    
    await sendMessage(content, attachments);
  };

  // Reset session and create a new chat
  const handleResetSession = useCallback(() => {
    const newSessionId = resetSession();
    setMessages([]);
    return newSessionId;
  }, [resetSession]);

  return (
    <div className="h-full flex flex-col">
      <MessageList messages={messages} isLoading={isLoading} />
      
      <div className="mt-auto">
        <ChatHeader onNewChat={handleResetSession} />
        
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          attachments={attachments}
          onAddAttachment={addAttachment}
          onRemoveAttachment={removeAttachment}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
