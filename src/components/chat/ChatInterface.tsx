
import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, MoreVertical, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
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

    // Симуляция ответа
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
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-kira-purple text-white">
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-sm">KIRA AI</h2>
            <p className="text-xs text-muted-foreground">Интеллектуальный ассистент</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <MoreVertical size={16} />
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 bg-kira-purple text-white flex-shrink-0">
                <AvatarFallback>K</AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={cn(
                "max-w-[75%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-kira-purple text-white"
                  : "bg-secondary border border-border"
              )}
            >
              <p className="text-sm">{message.content}</p>
              <div className="text-[10px] opacity-70 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            
            {message.role === "user" && (
              <Avatar className="h-8 w-8 bg-gray-300 flex-shrink-0">
                <AvatarFallback>К</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Separator />

      {/* Input area */}
      <div className="p-3 bg-card">
        <div className="relative flex items-end rounded-lg border bg-background">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Smile size={18} />
          </Button>
          
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="min-h-[40px] max-h-[120px] resize-none border-0 focus-visible:ring-0 bg-transparent flex-1 py-3 px-0"
          />
          
          <div className="flex items-center px-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9">
              <Paperclip size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9">
              <Mic size={18} />
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim()}
              size="icon"
              className="bg-kira-purple hover:bg-kira-purple-dark text-white h-9 w-9"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
