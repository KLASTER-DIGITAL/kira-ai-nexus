
import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, ChevronRight, MessageSquare, Paperclip, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ANIMATIONS } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
    subtitle: "Интеллектуальный ассистент",
    placeholder: "Спросите что-нибудь...",
    suggestedTitle: "Рекомендации",
    sectionTitles: {
      askAbout: "Спросить о",
      features: "Возможности",
    },
    questions: [
      { id: "q1", text: "Есть ли просроченные задачи?" },
      { id: "q2", text: "Какие открытые задачи имеют высокий приоритет?" },
      { id: "q3", text: "Что назначено мне?" },
    ],
    features: [
      { id: "f1", text: "Аналитический отчёт", description: "Выберите из 25+ инструментов отчётности", isNew: true },
      { id: "f2", text: "Обновление проекта", description: "Отчёт о состоянии на основе времени", isNew: true },
      { id: "f3", text: "Поиск дубликатов", description: "Определение и объединение дублирующихся задач", isNew: true },
    ],
    inputPlaceholder: "Расскажите AI, что нужно сделать",
    welcomeMessage: "Добро пожаловать! Я KIRA AI, ваш умный ассистент. Чем могу помочь сегодня?",
  },
  en: {
    title: "KIRA AI",
    subtitle: "Intelligent assistant",
    placeholder: "Ask something...",
    suggestedTitle: "Suggestions",
    sectionTitles: {
      askAbout: "Ask about",
      features: "Features",
    },
    questions: [
      { id: "q1", text: "Are there any overdue tasks?" },
      { id: "q2", text: "Which open tasks have high priority?" },
      { id: "q3", text: "What is assigned to me?" },
    ],
    features: [
      { id: "f1", text: "Executive Summary", description: "Choose from 25+ reporting tools", isNew: true },
      { id: "f2", text: "Project Update", description: "Time-based project status update", isNew: true },
      { id: "f3", text: "Find duplicate tasks", description: "Identify and merge duplicate tasks hassle-free", isNew: true },
    ],
    inputPlaceholder: "Tell AI what to do next",
    welcomeMessage: "Welcome back! I'm KIRA AI, your smart assistant. How can I help today?",
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
          className="w-full sm:w-[400px] p-0 border-l border-sidebar-border bg-background overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-kira-purple w-8 h-8 rounded-md flex items-center justify-center text-white font-bold">
                    K
                  </div>
                  <div>
                    <SheetTitle className="text-foreground mb-0">
                      {lang.title}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground mt-0">
                      {lang.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="text-muted-foreground hover:bg-secondary"
                  >
                    <Globe size={16} className="mr-1" />
                    {language === "ru" ? "EN" : "RU"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:bg-secondary"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </SheetHeader>

            {/* Messages area */}
            {messages.length > 0 ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                          : "bg-secondary text-foreground"
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
            ) : (
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Empty state / Welcome screen */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">{lang.sectionTitles.askAbout}</h3>
                    <div className="space-y-2">
                      {lang.questions.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => handleSuggestedQuestion(q.text)}
                          className="w-full text-left p-3 rounded-md bg-secondary hover:bg-secondary/80 transition-colors flex items-center"
                        >
                          <ChevronRight size={16} className="text-kira-purple mr-2 flex-shrink-0" />
                          <span className="text-sm">{q.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">{lang.sectionTitles.features}</h3>
                    <div className="space-y-2">
                      {lang.features.map((feature) => (
                        <div 
                          key={feature.id}
                          className="relative p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors flex items-start gap-3 group cursor-pointer"
                          onClick={() => handleSuggestedQuestion(feature.text)}
                        >
                          <div className="w-9 h-9 rounded bg-background flex items-center justify-center flex-shrink-0">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="text-kira-purple"
                            >
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{feature.text}</p>
                              {feature.isNew && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-800 rounded">New</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                          </div>
                          <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="p-3 border-t border-border bg-background sticky bottom-0">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={lang.inputPlaceholder}
                  className="pr-12 py-2.5 rounded-lg bg-secondary border-transparent focus-visible:ring-1"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip size={16} />
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 bg-kira-purple hover:bg-kira-purple-dark text-white"
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                  >
                    <Send size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AISidebar;
