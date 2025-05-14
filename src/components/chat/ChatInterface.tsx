
import React, { useState } from "react";
import { Send, PaperclipIcon, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

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
              <p>{message.content}</p>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Напишите сообщение..."
            className="kira-input w-full pr-28 focus:ring-kira-purple/50 transition-all duration-200"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button variant="ghost" size="icon" className="hover:bg-kira-purple/10 transition-colors">
              <PaperclipIcon size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-kira-purple/10 transition-colors">
              <Mic size={18} />
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim()}
              size="icon"
              className="bg-kira-purple hover:bg-kira-purple-dark text-white transition-colors"
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
