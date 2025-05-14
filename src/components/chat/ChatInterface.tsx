
import React, { useState, useRef, useEffect } from "react";
import { Send, PaperclipIcon, Mic, RotateCcw, X, FileIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMessages } from "@/hooks/chat";
import { ChatMessage, ChatAttachment } from "@/types/chat";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    resetSession,
    attachments,
    addAttachment,
    removeAttachment 
  } = useChatMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && !attachments.length) return;

    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для отправки сообщений необходимо войти в систему.",
        variant: "destructive"
      });
      return;
    }

    await sendMessage(input);
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

  const handleNewChat = () => {
    resetSession();
    toast({
      title: "Новый чат",
      description: "Создана новая сессия чата"
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to Array and add files
      Array.from(e.target.files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            title: "Слишком большой файл",
            description: `Файл ${file.name} превышает допустимый размер 10MB`,
            variant: "destructive"
          });
        } else {
          addAttachment(file);
        }
      });
      // Reset file input
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Render message content including attachments
  const renderMessageContent = (message: ChatMessage) => {
    return (
      <>
        {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
        
        {message.extension?.files && message.extension.files.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {message.extension.files.map((file, index) => (
                <div 
                  key={file.local_id || `${file.name}-${index}`} 
                  className="flex items-center bg-background/50 rounded p-1 text-sm"
                >
                  <FileIcon size={14} className="mr-1" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  {file.url && (
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      (Открыть)
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 p-2 space-y-4 animate-fade-in">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg transform transition-all duration-300 hover:scale-[1.01] ${
                message.role === "user"
                  ? "bg-kira-purple text-white shadow-md"
                  : "bg-secondary shadow-sm"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1 text-sm font-medium">
                  <div className="w-5 h-5 bg-kira-purple rounded-full flex items-center justify-center text-white text-xs">
                    K
                  </div>
                  <span>KIRA AI</span>
                </div>
              )}
              {renderMessageContent(message)}
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
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

      {/* File attachments preview */}
      {attachments.length > 0 && (
        <div className="border-t pt-2 px-2 mb-2">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file) => (
              <div 
                key={file.name} 
                className="flex items-center bg-secondary rounded-full px-2 py-1 text-sm"
              >
                <FileIcon size={14} className="mr-1" />
                <span className="truncate max-w-[120px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 p-0 hover:bg-destructive/20 hover:text-destructive"
                  onClick={() => removeAttachment(file.name)}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={handleNewChat}
          >
            <RotateCcw size={14} />
            <span>Новый чат</span>
          </Button>
        </div>
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
    </div>
  );
};

export default ChatInterface;
