
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { navigationConfig } from "./navigation-config";
import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";
import { SidebarProfile } from "./SidebarProfile";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarContentProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  isMobile: boolean;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  collapsed,
  toggleCollapse,
  isMobile
}) => {
  const { profile } = useAuth();
  const location = useLocation();
  
  // Фильтруем элементы навигации на основе роли пользователя
  const navSections = navigationConfig.filter(section => {
    return section.items.some(item => {
      return item.role === "all" || 
             item.role === profile?.role || 
             (profile?.role === "superadmin" && item.role === "user");
    });
  });

  return (
    <>
      {/* Заголовок сайдбара с логотипом */}
      <div className={cn(
        "flex h-16 items-center border-b border-border px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed ? (
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
        
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={toggleCollapse}>
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
                isCollapsed={collapsed}
              >
                {filteredItems.map((item) => (
                  <SidebarItem 
                    key={item.href}
                    item={item}
                    isActive={location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)}
                    isCollapsed={collapsed}
                  />
                ))}
              </SidebarSection>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* Кнопка разворачивания меню (когда меню свернуто) */}
      {collapsed && !isMobile && (
        <div className="flex justify-center py-2 border-t border-border">
          <TooltipProvider delayDuration={0}>
            <Button variant="ghost" size="icon" onClick={toggleCollapse}>
              <ChevronsRight className="h-5 w-5" />
              <span className="sr-only">Развернуть меню</span>
            </Button>
          </TooltipProvider>
        </div>
      )}
      
      {/* Футер с профилем пользователя */}
      <SidebarProfile collapsed={collapsed} />
    </>
  );
};
