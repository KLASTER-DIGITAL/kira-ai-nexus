
import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

type SuggestedQuestion = {
  id: string;
  text: string;
};

const LANGUAGE = {
  ru: {
    title: "KIRA AI",
    placeholder: "Спросите что-нибудь...",
    suggestedTitle: "Рекомендации",
    questions: [
      { id: "q1", text: "Как улучшить мои задачи?" },
      { id: "q2", text: "Что я пропустил в расписании?" },
      { id: "q3", text: "Помоги систематизировать заметки" },
      { id: "q4", text: "Проанализируй мой день" },
    ],
    welcomeMessage: "Привет! Я KIRA AI, ваш умный ассистент. Чем могу помочь?",
  },
  en: {
    title: "KIRA AI",
    placeholder: "Ask something...",
    suggestedTitle: "Suggestions",
    questions: [
      { id: "q1", text: "How can I improve my tasks?" },
      { id: "q2", text: "What am I missing in my schedule?" },
      { id: "q3", text: "Help organize my notes" },
      { id: "q4", text: "Analyze my day" },
    ],
    welcomeMessage: "Hello! I'm KIRA AI, your smart assistant. How can I help?",
  },
};

const AISidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<"ru" | "en">("ru");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("kira_ai_language");
    if (savedLanguage === "ru" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    const savedMessages = localStorage.getItem("kira_ai_messages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Fix timestamps that were serialized
        const fixedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(fixedMessages);
      } catch (e) {
        console.error("Error parsing saved messages", e);
      }
    } else {
      // Initialize with welcome message
      setMessages([
        {
          id: "welcome",
          content: LANGUAGE[language].welcomeMessage,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("kira_ai_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem("kira_ai_language", language);
  }, [language]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Я обрабатываю ваш запрос. В этой версии ответы предварительно запрограммированы.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Отвечаю на вопрос: "${question}". В этой версии ответы предварительно запрограммированы.`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ru" ? "en" : "ru"));
  };

  const lang = LANGUAGE[language];

  return (
    <>
      {/* Floating AI Button */}
      <Button
        size="icon"
        className={cn(
          "fixed right-6 bottom-6 rounded-full w-12 h-12 bg-kira-purple hover:bg-kira-purple-dark shadow-lg z-40",
          ANIMATIONS.scaleIn
        )}
        onClick={() => setOpen(true)}
      >
        <Bot size={24} />
      </Button>

      {/* AI Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] p-0 border-l border-sidebar-border bg-sidebar"
        >
          <SheetHeader className="px-4 py-3 border-b border-sidebar-border bg-sidebar-accent">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sidebar-foreground">
                <div className="bg-kira-purple w-8 h-8 rounded-md flex items-center justify-center text-white font-bold">
                  K
                </div>
                <SheetTitle className="text-sidebar-foreground">
                  {lang.title}
                </SheetTitle>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  {language === "ru" ? "EN" : "RU"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-end" : "justify-start",
                    ANIMATIONS.fadeIn
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 rounded-lg",
                      message.sender === "user"
                        ? "bg-kira-purple text-white"
                        : "bg-sidebar text-sidebar-foreground"
                    )}
                  >
                    {message.sender === "assistant" && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 bg-kira-purple rounded-full flex items-center justify-center text-white text-xs">
                          K
                        </div>
                        <span className="font-medium text-sm">KIRA AI</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            <div className="p-4 border-t border-sidebar-border bg-sidebar">
              <h4 className="text-sm font-medium text-sidebar-foreground mb-2">
                {lang.suggestedTitle}
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {lang.questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSuggestedQuestion(q.text)}
                    className="text-xs px-3 py-1.5 rounded-full bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors flex items-center"
                  >
                    <span>{q.text}</span>
                    <ChevronRight size={14} className="ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-sidebar-border bg-sidebar">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={lang.placeholder}
                  className="pr-12 bg-sidebar-accent text-sidebar-foreground border-sidebar-border"
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1 bottom-1 bg-kira-purple hover:bg-kira-purple-dark text-white"
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AISidebar;
