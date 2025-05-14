
import React from "react";
import { FileIcon } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import FileAttachmentsList from "./FileAttachmentsList";

interface MessageItemProps {
  message: ChatMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-lg transform transition-all duration-300 hover:scale-[1.01]",
          isUser
            ? "bg-kira-purple text-white shadow-md"
            : "bg-secondary shadow-sm"
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 text-sm font-medium">
            <div className="w-5 h-5 bg-kira-purple rounded-full flex items-center justify-center text-white text-xs">
              K
            </div>
            <span>KIRA AI</span>
          </div>
        )}
        
        {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
        
        {message.extension?.files && message.extension.files.length > 0 && (
          <div className="mt-2">
            <FileAttachmentsList files={message.extension.files} />
          </div>
        )}
        
        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
