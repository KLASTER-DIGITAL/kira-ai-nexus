
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
  Shield,
  Bot
} from "lucide-react";
import { useAuth } from '@/context/auth';
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  role?: 'user' | 'superadmin' | 'any';
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Дашборд", path: "/dashboard/user", role: 'user' },
  { icon: Shield, label: "Админ панель", path: "/dashboard/admin", role: 'superadmin' },
  { icon: Bot, label: "Настройки AI", path: "/ai-settings", role: 'superadmin' },
  { icon: MessageCircle, label: "Чат", path: "/chat", role: 'any' },
  { icon: CheckSquare, label: "Задачи", path: "/tasks", role: 'any' },
  { icon: FileText, label: "Заметки", path: "/notes", role: 'any' },
  { icon: Calendar, label: "Календарь", path: "/calendar", role: 'any' },
];

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  const { isSuperAdmin } = useAuth();
  
  // Фильтруем элементы меню на основе роли пользователя
  const filteredMenuItems = menuItems.filter(item => {
    if (item.role === 'superadmin' && !isSuperAdmin()) {
      return false;
    }
    return true;
  });

  return (
    <div
      className={`
        h-screen bg-sidebar flex flex-col text-sidebar-foreground
        ${collapsed ? "w-[70px]" : "w-[240px]"}
        transition-all duration-300 border-r border-sidebar-border
      `}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-center">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="bg-kira-purple w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-sidebar-foreground">KIRA AI</span>
          )}
        </NavLink>
      </div>

      <div className="mt-6 px-2 flex-1">
        {filteredMenuItems.map((item, index) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              end
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto px-2 mb-4">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-colors",
            isActive 
              ? "bg-sidebar-accent text-sidebar-foreground" 
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Settings size={20} />
          {!collapsed && <span>Настройки</span>}
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
            isActive 
              ? "bg-sidebar-accent text-sidebar-foreground" 
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <User size={20} />
          {!collapsed && <span>Профиль</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
