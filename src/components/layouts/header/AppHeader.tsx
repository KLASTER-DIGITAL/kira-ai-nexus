
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { useSidebarStore } from "@/store/sidebarStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  Search, 
  Settings, 
  PlusCircle, 
  Menu,
  FileText,
  CheckSquare,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ModeToggle";
import { PageTitle } from "@/components/layouts/header/PageTitle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "./UserMenu";

export function AppHeader() {
  const location = useLocation();
  const { profile } = useAuth();
  const { collapsed, toggleCollapse } = useSidebarStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        {/* Кнопка меню для мобильных и десктопа */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse}
          aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Меню</span>
        </Button>
        
        {/* Заголовок страницы */}
        <div className="hidden md:block">
          <PageTitle />
        </div>
        
        {/* Поиск - скрыт на мобильных устройствах */}
        <div className="hidden md:flex w-full max-w-sm items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="w-full pl-9 bg-background/70 focus-visible:bg-background"
            />
          </div>
        </div>
      </div>
      
      {/* Заголовок страницы на мобильных */}
      <div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
        <PageTitle />
      </div>
      
      {/* Правая часть заголовка с кнопками */}
      <div className="flex items-center gap-1 md:gap-2">
        <ModeToggle />
        
        {/* Кнопка создания - адаптивная */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Создать</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Создать</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Новая заметка</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckSquare className="mr-2 h-4 w-4" />
              <span>Новая задача</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Новое событие</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Кнопка уведомлений */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Уведомления</span>
          <Badge className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive p-0" />
        </Button>
        
        {/* Меню пользователя */}
        <UserMenu />
      </div>
    </header>
  );
}
