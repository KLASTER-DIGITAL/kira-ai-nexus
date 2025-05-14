
import React from "react";
import { 
  Bell, 
  Search, 
  PlusCircle,
  HelpCircle,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle = "Дашборд" }) => {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9" />
        <h1 className="text-xl font-semibold hidden md:block">{pageTitle}</h1>
      </div>
      
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            size={18} 
          />
          <Input
            placeholder="Поиск по всему..."
            className="w-full pl-10 pr-4 bg-background border-muted"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-kira-purple rounded-full"></span>
        </Button>
        
        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
          <PlusCircle size={16} />
          <span>Создать</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <HelpCircle size={20} />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-kira-purple text-white">
                  К
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Настройки</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
