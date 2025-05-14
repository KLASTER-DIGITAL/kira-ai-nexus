
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  MessageCircle, 
  CheckSquare, 
  FileText, 
  Calendar,
  Settings,
  User,
  LayoutGrid
} from "lucide-react";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

const mainMenuItems = [
  { icon: LayoutDashboard, label: "Дашборд", path: "/dashboard" },
  { icon: MessageCircle, label: "Чат", path: "/chat" },
  { icon: CheckSquare, label: "Задачи", path: "/tasks" },
  { icon: FileText, label: "Заметки", path: "/notes" },
  { icon: Calendar, label: "Календарь", path: "/calendar" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const isActive = (path: string) => location.pathname === path;
  const isMainExpanded = mainMenuItems.some(item => isActive(item.path));
  
  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <NavLink to="/" className="flex items-center gap-2 px-2 py-4">
          <div className="bg-kira-purple w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold">KIRA AI</span>
          )}
        </NavLink>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup defaultOpen={isMainExpanded}>
          <SidebarGroupLabel>Основное</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={isCollapsed ? item.label : undefined}
                  >
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center",
                        isActive ? "text-primary font-medium" : ""
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Приложения</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  tooltip={isCollapsed ? "Виджеты" : undefined}
                >
                  <NavLink to="/widgets" className="flex items-center">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    {!isCollapsed && <span>Виджеты</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              tooltip={isCollapsed ? "Настройки" : undefined}
            >
              <NavLink 
                to="/settings" 
                className={({ isActive }) => cn(
                  "flex items-center",
                  isActive ? "text-primary font-medium" : ""
                )}
              >
                <Settings className="mr-2 h-4 w-4" />
                {!isCollapsed && <span>Настройки</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              tooltip={isCollapsed ? "Профиль" : undefined}
            >
              <NavLink 
                to="/profile"
                className={({ isActive }) => cn(
                  "flex items-center",
                  isActive ? "text-primary font-medium" : ""
                )}
              >
                <User className="mr-2 h-4 w-4" />
                {!isCollapsed && <span>Профиль</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
