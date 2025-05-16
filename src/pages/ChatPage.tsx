
import React from "react";
import { useAuth } from "@/context/auth";
import ChatInterface from "@/components/chat/ChatInterface";
import { PageHeader } from "@/components/layouts/PageHeader";

const ChatPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="container mx-auto">
      <div className="max-w-4xl mx-auto h-[calc(100vh-180px)]">
        {isAuthenticated ? (
          <ChatInterface />
        ) : (
          <div className="flex items-center justify-center h-full flex-col">
            <h2 className="text-2xl font-semibold mb-4">Пожалуйста, войдите в систему</h2>
            <p className="text-muted-foreground">Для доступа к чату необходимо авторизоваться</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
