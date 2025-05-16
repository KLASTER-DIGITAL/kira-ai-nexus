
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigationConfig } from "./navigation-config";
import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";

interface SidebarNavigationProps {
  collapsed: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed }) => {
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
  );
};
