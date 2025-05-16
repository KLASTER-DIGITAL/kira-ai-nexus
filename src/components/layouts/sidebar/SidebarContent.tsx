
import React from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarProfile } from "./SidebarProfile";

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
  return (
    <>
      {/* Заголовок сайдбара с логотипом */}
      <SidebarHeader 
        collapsed={collapsed} 
        toggleCollapse={toggleCollapse} 
        isMobile={isMobile} 
      />

      {/* Прокручиваемая область с навигацией */}
      <SidebarNavigation collapsed={collapsed} />
      
      {/* Футер с профилем пользователя */}
      <SidebarProfile collapsed={collapsed} />
    </>
  );
};
