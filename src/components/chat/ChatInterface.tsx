
import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, MoreVertical, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Привет! Я KIRA AI, ваш персональный ассистент. Чем могу помочь сегодня?",
      timestamp: new Date(),
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Автоматическое изменение размера textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    
    // Сброс высоты textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI response after a short delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Я обрабатываю ваш запрос. В MVP версии я предоставляю базовые ответы, но вскоре буду подключена к продвинутым AI моделям для более глубокого анализа.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-kira-purple rounded-full flex items-center justify-center text-white font-medium">
            K
          </div>
          <div>
            <h2 className="font-medium">KIRA AI</h2>
            <p className="text-xs text-muted-foreground">Интеллектуальный ассистент</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical size={18} />
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-kira-purple rounded-full flex items-center justify-center text-white font-medium mr-2 flex-shrink-0">
                K
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-kira-purple text-white"
                  : "bg-secondary border border-border"
              )}
            >
              <p className="text-sm">{message.content}</p>
              <div className="text-xs opacity-70 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-300 ml-2 flex-shrink-0">
                <AspectRatio ratio={1} className="bg-muted">
                  <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                    К
                  </div>
                </AspectRatio>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="relative flex items-end bg-secondary rounded-lg border">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Smile size={20} />
          </Button>
          
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="min-h-[40px] max-h-[120px] resize-none border-0 focus-visible:ring-0 bg-transparent flex-1"
          />
          
          <div className="flex items-center space-x-2 px-3 py-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Paperclip size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Mic size={20} />
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim()}
              size="icon"
              className="bg-kira-purple hover:bg-kira-purple-dark text-white"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
