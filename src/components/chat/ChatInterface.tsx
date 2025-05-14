
import React, { useState, useRef, useEffect } from "react";
import { Send, PaperclipIcon, Mic, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatMessages, ChatMessage } from "@/hooks/useChatMessages";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, resetSession } = useChatMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

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
              <p className="whitespace-pre-wrap">{message.content}</p>
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
            >
              <PaperclipIcon size={18} />
            </Button>
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
              disabled={!input.trim() || isLoading || !isAuthenticated}
              size="icon"
              className="bg-kira-purple hover:bg-kira-purple-dark text-white transition-colors"
            >
              <Send size={18} />
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
