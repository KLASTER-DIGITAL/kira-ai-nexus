
import React, { useRef, useState } from "react";
import { Send, PaperclipIcon, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";
import FileAttachmentsList from "./FileAttachmentsList";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  attachments: File[];
  onAddAttachment: (file: File) => void;
  onRemoveAttachment: (fileName: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading,
  attachments,
  onAddAttachment,
  onRemoveAttachment
}) => {
  const [input, setInput] = useState("");
  const { isAuthenticated } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!input.trim() && !attachments.length) return;
    onSendMessage(input);
    setInput("");

    // Focus back on the textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Send message on Enter (without shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to Array and add files
      Array.from(e.target.files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          // Handle file size error (should be handled by parent component)
        } else {
          onAddAttachment(file);
        }
      });
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="border-t pt-4">
      {attachments.length > 0 && (
        <FileAttachmentsList 
          files={attachments}
          onRemove={onRemoveAttachment}
        />
      )}
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Напишите сообщение..."
          className="min-h-[60px] max-h-[120px] pr-28 focus:ring-kira-purple/50 transition-all duration-200"
          disabled={isLoading || !isAuthenticated}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-kira-purple/10 transition-colors"
            disabled={isLoading || !isAuthenticated}
            onClick={triggerFileInput}
          >
            <PaperclipIcon size={18} />
          </Button>
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            multiple
            disabled={isLoading || !isAuthenticated}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-kira-purple/10 transition-colors"
            disabled={isLoading || !isAuthenticated}
          >
            <Mic size={18} />
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={(!input.trim() && !attachments.length) || isLoading || !isAuthenticated}
            size="icon"
            className={cn(
              "transition-colors",
              isLoading 
                ? "bg-secondary text-foreground" 
                : "bg-kira-purple hover:bg-kira-purple-dark text-white"
            )}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
          </Button>
        </div>
      </div>
      
      {!isAuthenticated && (
        <div className="mt-2 text-sm text-center text-muted-foreground">
          Для использования чата необходимо <a href="/auth" className="text-kira-purple hover:underline">войти в систему</a>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
