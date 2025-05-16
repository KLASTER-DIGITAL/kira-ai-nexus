
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronsLeft, ChevronsRight, Settings, LogOut } from "lucide-react";

import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { navigationConfig } from "./navigation-config";

export function AppSidebar() {
  const { profile, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  // Определяем доступные элементы навигации на основе роли пользователя
  const navSections = navigationConfig.filter(section => {
    return section.items.some(item => {
      return item.role === "all" || 
             item.role === profile?.role || 
             (profile?.role === "superadmin" && item.role === "user");
    });
  });

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 z-30 flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Заголовок сайдбара с логотипом */}
      <div className={cn(
        "flex h-16 items-center border-b border-border px-4",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed ? (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">K</span>
            </div>
            <span className="font-bold text-lg">KIRA AI</span>
          </Link>
        ) : (
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">K</span>
          </div>
        )}
        
        {!isCollapsed && (
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)}>
            <ChevronsLeft className="h-5 w-5" />
            <span className="sr-only">Свернуть меню</span>
          </Button>
        )}
      </div>

      {/* Прокручиваемая область с навигацией */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-2 space-y-6">
          {navSections.map((section, index) => {
            // Фильтруем элементы навигации на основе роли пользователя
            const filteredItems = section.items.filter(item => {
              return item.role === "all" || 
                     item.role === profile?.role || 
                     (profile?.role === "superadmin" && item.role === "user");
            });
            
            // Если нет элементов для отображения, пропускаем секцию
            if (filteredItems.length === 0) return null;
            
            return (
              <SidebarSection 
                key={`section-${index}`}
                title={section.title}
                isCollapsed={isCollapsed}
              >
                {filteredItems.map((item) => (
                  <SidebarItem 
                    key={item.href}
                    item={item}
                    isActive={location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </SidebarSection>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* Кнопка разворачивания меню (когда меню свернуто) */}
      {isCollapsed && (
        <div className="flex justify-center py-2 border-t border-border">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)}>
                  <ChevronsRight className="h-5 w-5" />
                  <span className="sr-only">Развернуть меню</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Развернуть меню</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {/* Футер с профилем пользователя */}
      <div className="p-3 border-t border-border">
        <div className={cn(
          "flex items-center", 
          isCollapsed ? "flex-col gap-2" : "gap-3"
        )}>
          <Avatar className={cn("h-10 w-10", isCollapsed && "mb-1")}>
            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">
                {profile?.display_name || 'Пользователь'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {profile?.role === "superadmin" ? "Администратор" : "Пользователь"}
              </p>
              
              <div className="flex items-center gap-1 mt-2">
                <Button variant="outline" size="sm" className="w-full gap-1 h-8" onClick={() => signOut()}>
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Выход</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Настройки</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
