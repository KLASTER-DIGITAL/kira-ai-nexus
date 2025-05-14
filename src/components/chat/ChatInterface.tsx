
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { useChatMessages } from "@/hooks/chat";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    resetSession,
    attachments,
    addAttachment,
    removeAttachment 
  } = useChatMessages();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleSendMessage = async (content: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для отправки сообщений необходимо войти в систему.",
        variant: "destructive"
      });
      return;
    }

    await sendMessage(content);
  };

  return (
    <div className="h-full flex flex-col">
      <MessageList messages={messages} isLoading={isLoading} />
      
      <div className="mt-auto">
        <ChatHeader onNewChat={resetSession} />
        
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
