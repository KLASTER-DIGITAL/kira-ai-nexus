
import React, { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 p-2 space-y-4 animate-fade-in">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-secondary shadow-sm max-w-[80%] px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2 mb-1 text-sm font-medium">
              <div className="w-5 h-5 bg-kira-purple rounded-full flex items-center justify-center text-white text-xs">
                K
              </div>
              <span>KIRA AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-kira-purple rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-kira-purple rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              <div className="w-2 h-2 bg-kira-purple rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
